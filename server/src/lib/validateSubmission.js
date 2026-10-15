import { LIMITS } from './validate.js';

export const FIELD_TYPES = ['text', 'textarea', 'email', 'select'];
export const MODES = ['anonymous', 'login', 'either'];

const DEFAULT_MAX = { text: 200, email: 200, select: 200, textarea: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// eslint-disable-next-line no-control-regex
const CTRL_MULTILINE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
// eslint-disable-next-line no-control-regex
const CTRL_SINGLELINE = /[\u0000-\u001F\u007F]/g;

const fail = (status, error) => ({ ok: false, status, error });

/**
 * Pure validation of a contact-block submission. No I/O.
 *
 * @param {object} blockData  Stored block data: { mode, fields: [...] }
 * @param {object} answers    { [fieldId]: string }
 * @param {{id:number, username:string}|null} user
 * @param {{anonymous?: boolean}} [opts]
 * @returns {{ok:true, answers:object[], sender:{userId:number,name:string}|null}
 *          |{ok:false, status:number, error:string}}
 */
export function validateSubmission(blockData, answers, user, opts = {}) {
  const misconfigured = fail(400, 'This form is not set up correctly');
  if (!blockData || typeof blockData !== 'object' || !Array.isArray(blockData.fields)) {
    return misconfigured;
  }
  const fields = blockData.fields;
  if (fields.length < 1 || fields.length > LIMITS.messageMaxFields) return misconfigured;

  const seen = new Set();
  for (const f of fields) {
    if (
      !f || typeof f !== 'object' ||
      typeof f.id !== 'string' || !f.id ||
      typeof f.label !== 'string' ||
      !FIELD_TYPES.includes(f.type) ||
      seen.has(f.id)
    ) {
      return misconfigured;
    }
    seen.add(f.id);
  }

  const mode = MODES.includes(blockData.mode) ? blockData.mode : 'either';
  if (mode === 'login' && !user) return fail(401, 'Log in to send a message');

  let sender = null;
  if (user) {
    if (mode === 'login') sender = { userId: user.id, name: user.username };
    else if (mode === 'either' && opts.anonymous !== true) {
      sender = { userId: user.id, name: user.username };
    }
  }

  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return fail(400, 'Please fill in the form');
  }
  const keys = Object.keys(answers);
  if (keys.length > LIMITS.messageMaxFields) return fail(400, 'Too many fields');
  for (const key of keys) {
    if (!seen.has(key)) return fail(400, 'Unknown field');
  }

  const out = [];
  let total = 0;
  for (const f of fields) {
    const label = f.label.trim().slice(0, LIMITS.messageLabel) || 'Field';
    const raw = Object.hasOwn(answers, f.id) ? answers[f.id] : undefined;
    if (raw !== undefined && raw !== null && typeof raw !== 'string') {
      return fail(400, `${label} must be text`);
    }
    const value = (typeof raw === 'string' ? raw : '')
      .replace(f.type === 'textarea' ? CTRL_MULTILINE : CTRL_SINGLELINE, '')
      .trim();

    if (!value) {
      if (f.required === true) return fail(400, `${label} is required`);
      continue;
    }

    const declared = Number.isFinite(f.maxLength) && f.maxLength > 0 ? f.maxLength : DEFAULT_MAX[f.type];
    const max = Math.min(declared, LIMITS.messageField);
    if (value.length > max) return fail(400, `${label} must be ${max} characters or fewer`);

    if (f.type === 'email' && !EMAIL_RE.test(value)) {
      return fail(400, `${label} must be a valid email`);
    }
    if (f.type === 'select') {
      const options = Array.isArray(f.options) ? f.options : [];
      if (!options.some((o) => typeof o === 'string' && o === value)) {
        return fail(400, `${label} has an invalid choice`);
      }
    }

    total += value.length;
    out.push({ id: f.id, label, type: f.type, value });
  }

  if (out.length === 0) return fail(400, 'Please fill in the form');
  if (total > LIMITS.messageTotal) return fail(400, 'Message is too long');

  return { ok: true, answers: out, sender };
}
