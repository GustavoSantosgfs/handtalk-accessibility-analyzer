import * as cheerio from 'cheerio';
import {
  AccessibilityResult,
  TitleAnalysis,
  ImageAnalysis,
  InputAnalysis,
  AnalysisProgress
} from '../types/analysis';

type ProgressCallback = (progress: AnalysisProgress) => void;

class AccessibilityService {
  analyze(html: string, onProgress?: ProgressCallback): AccessibilityResult {
    const $ = cheerio.load(html);

    onProgress?.({ step: 'title', progress: 25, message: 'Analyzing title tag...' });
    const title = this.analyzeTitle($);

    onProgress?.({ step: 'images', progress: 50, message: 'Analyzing image tags...' });
    const images = this.analyzeImages($);

    onProgress?.({ step: 'inputs', progress: 75, message: 'Analyzing input/label associations...' });
    const inputs = this.analyzeInputs($);

    onProgress?.({ step: 'complete', progress: 100, message: 'Analysis complete!' });
    const { score, passedChecks, totalChecks } = this.calculateScore(title, images, inputs);

    return {
      title,
      images,
      inputs,
      score,
      passedChecks,
      totalChecks
    };
  }

  private analyzeTitle($: cheerio.CheerioAPI): TitleAnalysis {
    const titleElement = $('title');
    const exists = titleElement.length > 0;
    const content = exists ? titleElement.text().trim() : null;
    const isEmpty = !content || content.length === 0;

    return { exists, content, isEmpty };
  }

  private analyzeImages($: cheerio.CheerioAPI): ImageAnalysis {
    const images = $('img');
    const total = images.length;
    const missingAltImages: string[] = [];
    let withoutAlt = 0;

    images.each((_, img) => {
      const alt = $(img).attr('alt');
      if (alt === undefined || alt.trim() === '') {
        withoutAlt++;
        const src = $(img).attr('src') || 'unknown';
        missingAltImages.push(src);
      }
    });

    return { total, withoutAlt, missingAltImages };
  }

  private analyzeInputs($: cheerio.CheerioAPI): InputAnalysis {
    const inputs = $('input').not('[type="hidden"], [type="submit"], [type="button"], [type="reset"], [type="image"]');
    const total = inputs.length;
    const inputsWithoutLabel: string[] = [];
    let withoutLabel = 0;

    inputs.each((_, input) => {
      const $input = $(input);
      const id = $input.attr('id');
      const name = $input.attr('name');
      const type = $input.attr('type') || 'text';
      const ariaLabel = $input.attr('aria-label');
      const ariaLabelledBy = $input.attr('aria-labelledby');

      let hasLabel = false;

      // Check for aria-label or aria-labelledby
      if (ariaLabel || ariaLabelledBy) {
        hasLabel = true;
      }

      // Check for associated label via id
      if (!hasLabel && id) {
        const label = $(`label[for="${id}"]`);
        if (label.length > 0) {
          hasLabel = true;
        }
      }

      // Check for wrapping label
      if (!hasLabel) {
        const parentLabel = $input.closest('label');
        if (parentLabel.length > 0) {
          hasLabel = true;
        }
      }

      if (!hasLabel) {
        withoutLabel++;
        const identifier = id || name || `${type}-input`;
        inputsWithoutLabel.push(identifier);
      }
    });

    return { total, withoutLabel, inputsWithoutLabel };
  }

  private calculateScore(
    title: TitleAnalysis,
    images: ImageAnalysis,
    inputs: InputAnalysis
  ): { score: number; passedChecks: number; totalChecks: number } {
    let passedChecks = 0;
    const totalChecks = 3;

    // Check 1: Title exists and is not empty
    if (title.exists && !title.isEmpty) {
      passedChecks++;
    }

    // Check 2: All images have alt attribute
    if (images.total === 0 || images.withoutAlt === 0) {
      passedChecks++;
    }

    // Check 3: All inputs have labels
    if (inputs.total === 0 || inputs.withoutLabel === 0) {
      passedChecks++;
    }

    const score = Math.round((passedChecks / totalChecks) * 100);

    return { score, passedChecks, totalChecks };
  }
}

export default new AccessibilityService();
