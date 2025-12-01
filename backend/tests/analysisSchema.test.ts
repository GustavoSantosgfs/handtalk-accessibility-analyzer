import { describe, it, expect } from 'vitest';
import { analyzeUrlSchema, paginationSchema } from '../src/schemas/analysisSchema';

describe('AnalysisSchema', () => {
  describe('analyzeUrlSchema', () => {
    it('should accept valid https URL', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'https://example.com' });
      expect(result.success).toBe(true);
    });

    it('should accept valid http URL', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'http://example.com' });
      expect(result.success).toBe(true);
    });

    it('should accept URL with path', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'https://example.com/path/to/page' });
      expect(result.success).toBe(true);
    });

    it('should accept URL with query params', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'https://example.com?foo=bar' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'not-a-url' });
      expect(result.success).toBe(false);
    });

    it('should reject empty URL', () => {
      const result = analyzeUrlSchema.safeParse({ url: '' });
      expect(result.success).toBe(false);
    });

    it('should reject missing URL', () => {
      const result = analyzeUrlSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject ftp protocol', () => {
      const result = analyzeUrlSchema.safeParse({ url: 'ftp://example.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
    it('should use default values when not provided', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should parse valid page and limit', () => {
      const result = paginationSchema.safeParse({ page: '2', limit: '20' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject page less than 1', () => {
      const result = paginationSchema.safeParse({ page: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject negative page', () => {
      const result = paginationSchema.safeParse({ page: '-1' });
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const result = paginationSchema.safeParse({ limit: '101' });
      expect(result.success).toBe(false);
    });

    it('should reject limit less than 1', () => {
      const result = paginationSchema.safeParse({ limit: '0' });
      expect(result.success).toBe(false);
    });
  });
});
