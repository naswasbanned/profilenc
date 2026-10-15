import { describe, it, expect } from 'vitest';
import { contactPlaceholder } from './contactPlaceholder';

describe('contactPlaceholder', () => {
  it('builds from the label', () => {
    expect(contactPlaceholder('Message')).toBe('Your message...');
    expect(contactPlaceholder('Name')).toBe('Your name...');
    expect(contactPlaceholder('Email')).toBe('Your email...');
  });

  it('trims the label', () => {
    expect(contactPlaceholder('  Phone number  ')).toBe('Your phone number...');
  });

  it('does not double the your prefix', () => {
    expect(contactPlaceholder('Your name')).toBe('Your name...');
    expect(contactPlaceholder('your Email')).toBe('Your Email...');
  });

  it('strips trailing punctuation', () => {
    expect(contactPlaceholder('Message...')).toBe('Your message...');
    expect(contactPlaceholder('Subject?')).toBe('Your subject...');
    expect(contactPlaceholder('Name:')).toBe('Your name...');
  });

  it('falls back when empty', () => {
    expect(contactPlaceholder('')).toBe('Type here...');
    expect(contactPlaceholder('   ')).toBe('Type here...');
    expect(contactPlaceholder(undefined)).toBe('Type here...');
    expect(contactPlaceholder('?')).toBe('Type here...');
  });
});
