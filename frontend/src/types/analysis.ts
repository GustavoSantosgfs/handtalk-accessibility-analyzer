export interface ImageAnalysis {
  total: number;
  withoutAlt: number;
  missingAltImages: string[];
}

export interface InputAnalysis {
  total: number;
  withoutLabel: number;
  inputsWithoutLabel: string[];
}

export interface TitleAnalysis {
  exists: boolean;
  content: string | null;
  isEmpty: boolean;
}

export interface AccessibilityResult {
  title: TitleAnalysis;
  images: ImageAnalysis;
  inputs: InputAnalysis;
  score: number;
  passedChecks: number;
  totalChecks: number;
}

export interface AnalysisResponse {
  id: string;
  url: string;
  result: AccessibilityResult;
  analyzedAt: string;
  duration: number;
}

export interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
