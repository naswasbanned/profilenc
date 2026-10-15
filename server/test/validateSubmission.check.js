import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from '../src/lib/validateSubmission.js';

const fields = [
  { id: 'a', label: 'Message', type: 'textarea', required: true, maxLength: 100 },
  { id: 'b', label: 'Name', type: 'text', required: false, maxLength: 10 },
  { id: 'c', label: 'Email', type: 'email', required: false },
  { id: 'd', label: 'Topic', type: 'select', required: false, options: ['x', 'y'] },
];
const block = (mode, f = fields) => ({ mode, fields: f });
const user = { id: 7, username: 'bob' };

test('anonymous mode: sender always null', () => {
  const r = validateSubmission(block('anonymous'), { a: 'hi' }, user, { anonymous: false });
  assert.equal(r.ok, true);
  assert.equal(r.sender, null);
  assert.equal(validateSubmission(block('anonymous'), { a: 'hi' }, null).ok, true);
});

test('login mode: 401 without user; ignores anonymous flag', () => {
  const r = validateSubmission(block('login'), { a: 'hi' }, null);
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
  const r2 = validateSubmission(block('login'), { a: 'hi' }, user, { anonymous: true });
  assert.deepEqual(r2.sender, { userId: 7, name: 'bob' });
});

test('either mode honours anonymous flag', () => {
  assert.deepEqual(validateSubmission(block('either'), { a: 'hi' }, user).sender, { userId: 7, name: 'bob' });
  assert.equal(validateSubmission(block('either'), { a: 'hi' }, user, { anonymous: true }).sender, null);
  assert.equal(validateSubmission(block('either'), { a: 'hi' }, null).sender, null);
});

test('required, optional omitted, order and label snapshot', () => {
  assert.equal(validateSubmission(block('either'), { b: 'x' }, null).ok, false);
  const r = validateSubmission(block('either'), { b: '  ', a: ' hello ' }, null);
  assert.deepEqual(r.answers, [{ id: 'a', label: 'Message', type: 'textarea', value: 'hello' }]);
  const r2 = validateSubmission(block('either'), { b: 'n', a: 'm' }, null);
  assert.deepEqual(r2.answers.map((x) => x.id), ['a', 'b']);
});

test('length caps', () => {
  assert.equal(validateSubmission(block('either'), { a: 'x', b: 'y'.repeat(11) }, null).ok, false);
  assert.equal(validateSubmission(block('either'), { a: 'x'.repeat(101) }, null).ok, false);
  const big = [{ id: 'a', label: 'M', type: 'textarea', required: true, maxLength: 99999 }];
  assert.equal(validateSubmission(block('either', big), { a: 'x'.repeat(5001) }, null).ok, false);
  assert.equal(validateSubmission(block('either', big), { a: 'x'.repeat(5000) }, null).ok, true);
});

test('email and select validation', () => {
  assert.equal(validateSubmission(block('either'), { a: 'x', c: 'a@b.co' }, null).ok, true);
  assert.equal(validateSubmission(block('either'), { a: 'x', c: 'nope' }, null).ok, false);
  assert.equal(validateSubmission(block('either'), { a: 'x', d: 'x' }, null).ok, true);
  assert.equal(validateSubmission(block('either'), { a: 'x', d: 'z' }, null).ok, false);
});

test('unknown ids, bad shapes, proto key', () => {
  assert.equal(validateSubmission(block('either'), { a: 'x', zz: 'y' }, null).ok, false);
  assert.equal(validateSubmission(block('either'), { a: ['x'] }, null).ok, false);
  assert.equal(validateSubmission(block('either'), { a: 5 }, null).ok, false);
  assert.equal(validateSubmission(block('either'), ['x'], null).ok, false);
  assert.equal(validateSubmission(block('either'), null, null).ok, false);
  const evil = JSON.parse('{"a":"x","__proto__":"y"}');
  assert.equal(validateSubmission(block('either'), evil, null).ok, false);
});

test('field count limits', () => {
  const nine = Array.from({ length: 9 }, (_, i) => ({ id: `f${i}`, label: 'L', type: 'text' }));
  assert.equal(validateSubmission(block('either', nine), { f0: 'x' }, null).ok, false);
  const eight = nine.slice(0, 8);
  const nineAnswers = Object.fromEntries(nine.map((f) => [f.id, 'x']));
  assert.equal(validateSubmission(block('either', eight), nineAnswers, null).ok, false);
  assert.equal(validateSubmission(block('either', []), {}, null).ok, false);
  assert.equal(validateSubmission(null, {}, null).ok, false);
});

test('all empty rejected, control chars stripped, duplicate ids misconfigured', () => {
  const opt = [{ id: 'a', label: 'M', type: 'text' }];
  assert.equal(validateSubmission(block('either', opt), { a: '   ' }, null).ok, false);
  const r = validateSubmission(block('either', opt), { a: 'a\u0000b\nc' }, null);
  assert.equal(r.answers[0].value, 'abc');
  const dup = [opt[0], { ...opt[0] }];
  assert.equal(validateSubmission(block('either', dup), { a: 'x' }, null).ok, false);
});

test('unknown mode defaults to either', () => {
  const r = validateSubmission({ mode: 'bogus', fields }, { a: 'x' }, user);
  assert.deepEqual(r.sender, { userId: 7, name: 'bob' });
});
