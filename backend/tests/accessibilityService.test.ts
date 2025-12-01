import { describe, it, expect } from 'vitest';
import accessibilityService from '../src/services/accessibilityService';

describe('AccessibilityService', () => {
  describe('Title Analysis', () => {
    it('should detect existing title with content', () => {
      const html = '<html><head><title>Test Page</title></head><body></body></html>';
      const result = accessibilityService.analyze(html);

      expect(result.title.exists).toBe(true);
      expect(result.title.content).toBe('Test Page');
      expect(result.title.isEmpty).toBe(false);
    });

    it('should detect missing title', () => {
      const html = '<html><head></head><body></body></html>';
      const result = accessibilityService.analyze(html);

      expect(result.title.exists).toBe(false);
      expect(result.title.content).toBe(null);
      expect(result.title.isEmpty).toBe(true);
    });

    it('should detect empty title', () => {
      const html = '<html><head><title></title></head><body></body></html>';
      const result = accessibilityService.analyze(html);

      expect(result.title.exists).toBe(true);
      expect(result.title.isEmpty).toBe(true);
    });

    it('should detect title with only whitespace as empty', () => {
      const html = '<html><head><title>   </title></head><body></body></html>';
      const result = accessibilityService.analyze(html);

      expect(result.title.exists).toBe(true);
      expect(result.title.isEmpty).toBe(true);
    });
  });

  describe('Image Alt Analysis', () => {
    it('should count images with alt attributes', () => {
      const html = `
        <html><body>
          <img src="img1.jpg" alt="Image 1">
          <img src="img2.jpg" alt="Image 2">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.images.total).toBe(2);
      expect(result.images.withoutAlt).toBe(0);
      expect(result.images.missingAltImages).toHaveLength(0);
    });

    it('should detect images without alt attributes', () => {
      const html = `
        <html><body>
          <img src="img1.jpg" alt="Image 1">
          <img src="img2.jpg">
          <img src="img3.jpg" alt="">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.images.total).toBe(3);
      expect(result.images.withoutAlt).toBe(2);
      expect(result.images.missingAltImages).toContain('img2.jpg');
      expect(result.images.missingAltImages).toContain('img3.jpg');
    });

    it('should handle page with no images', () => {
      const html = '<html><body><p>No images here</p></body></html>';
      const result = accessibilityService.analyze(html);

      expect(result.images.total).toBe(0);
      expect(result.images.withoutAlt).toBe(0);
    });
  });

  describe('Input Label Analysis', () => {
    it('should detect inputs with associated labels via for attribute', () => {
      const html = `
        <html><body>
          <label for="name">Name</label>
          <input type="text" id="name">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.inputs.total).toBe(1);
      expect(result.inputs.withoutLabel).toBe(0);
    });

    it('should detect inputs wrapped in labels', () => {
      const html = `
        <html><body>
          <label>
            Name
            <input type="text">
          </label>
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.inputs.total).toBe(1);
      expect(result.inputs.withoutLabel).toBe(0);
    });

    it('should detect inputs with aria-label', () => {
      const html = `
        <html><body>
          <input type="text" aria-label="Search">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.inputs.total).toBe(1);
      expect(result.inputs.withoutLabel).toBe(0);
    });

    it('should detect inputs without labels', () => {
      const html = `
        <html><body>
          <input type="text" id="name">
          <input type="email">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.inputs.total).toBe(2);
      expect(result.inputs.withoutLabel).toBe(2);
    });

    it('should ignore hidden, submit, button, reset, and image inputs', () => {
      const html = `
        <html><body>
          <input type="hidden" name="csrf">
          <input type="submit" value="Submit">
          <input type="button" value="Click">
          <input type="reset" value="Reset">
          <input type="image" src="btn.png">
        </body></html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.inputs.total).toBe(0);
    });
  });

  describe('Score Calculation', () => {
    it('should return 100% for fully accessible page', () => {
      const html = `
        <html>
          <head><title>Accessible Page</title></head>
          <body>
            <img src="img.jpg" alt="Description">
            <label for="email">Email</label>
            <input type="email" id="email">
          </body>
        </html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.score).toBe(100);
      expect(result.passedChecks).toBe(3);
      expect(result.totalChecks).toBe(3);
    });

    it('should return 0% for completely inaccessible page', () => {
      const html = `
        <html>
          <head></head>
          <body>
            <img src="img.jpg">
            <input type="text">
          </body>
        </html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.score).toBe(0);
      expect(result.passedChecks).toBe(0);
      expect(result.totalChecks).toBe(3);
    });

    it('should return partial score', () => {
      const html = `
        <html>
          <head><title>Partial Page</title></head>
          <body>
            <img src="img.jpg">
            <input type="text">
          </body>
        </html>
      `;
      const result = accessibilityService.analyze(html);

      expect(result.score).toBe(33);
      expect(result.passedChecks).toBe(1);
    });
  });
});
