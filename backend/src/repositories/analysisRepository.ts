import Analysis, { IAnalysis } from '../models/Analysis';
import { AccessibilityResult } from '../types/analysis';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class AnalysisRepository {
  async create(url: string, result: AccessibilityResult, duration: number): Promise<IAnalysis> {
    const analysis = new Analysis({
      url,
      result,
      analyzedAt: new Date(),
      duration
    });
    return analysis.save();
  }

  async findById(id: string): Promise<IAnalysis | null> {
    return Analysis.findById(id);
  }

  async findByUrl(url: string): Promise<IAnalysis[]> {
    return Analysis.find({ url }).sort({ analyzedAt: -1 });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<IAnalysis>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Analysis.find().sort({ analyzedAt: -1 }).skip(skip).limit(limit),
      Analysis.countDocuments()
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Analysis.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new AnalysisRepository();
