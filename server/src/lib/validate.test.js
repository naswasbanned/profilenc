import { describe, expect, it } from 'vitest';
import { isOwnUploadUrl } from './validate.js';
import { localUploadPath } from '../services/ogImageService.js';

describe('isOwnUploadUrl', () => {
  it("accepts only the user's own upload folder", () => {
    expect(isOwnUploadUrl('/uploads/12/abc-1.webp', 12)).toBe(true);
    expect(isOwnUploadUrl('/uploads/13/abc.webp', 12)).toBe(false);
    expect(isOwnUploadUrl('https://evil.test/uploads/12/a.webp', 12)).toBe(false);
    expect(isOwnUploadUrl('/uploads/12/../13/a.webp', 12)).toBe(false);
    expect(isOwnUploadUrl('/uploads/12/.hidden', 12)).toBe(false);
    expect(isOwnUploadUrl(null, 12)).toBe(false);
  });
});

describe('localUploadPath', () => {
  it('maps local uploads to disk and refuses everything else', () => {
    expect(localUploadPath('/uploads/3/a.webp')).toMatch(/uploads\/3\/a\.webp$/);
    expect(localUploadPath('/uploads/3/a.webp', 4)).toBe(null);
    expect(localUploadPath('http://169.254.169.254/latest')).toBe(null);
    expect(localUploadPath('/uploads/3/../../etc/passwd')).toBe(null);
    expect(localUploadPath('/uploads/og/x.jpg')).toBe(null);
    expect(localUploadPath(undefined)).toBe(null);
  });
});
