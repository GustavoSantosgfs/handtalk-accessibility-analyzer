import { Request, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import { analyzeUrlSchema, paginationSchema } from '../schemas/analysisSchema';
import htmlFetcherService from '../services/htmlFetcherService';
import accessibilityService from '../services/accessibilityService';
import analysisRepository from '../repositories/analysisRepository';
import { AnalysisProgress } from '../types/analysis';

class AnalysisController {
  private io: SocketServer | null = null;

  setSocketServer(io: SocketServer) {
    this.io = io;
  }

  analyze = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    const socketId = req.headers['x-socket-id'] as string | undefined;

    try {
      const validation = analyzeUrlSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation error',
          details: validation.error.issues
        });
        return;
      }

      const { url } = validation.data;

      const emitProgress = (progress: AnalysisProgress) => {
        if (this.io && socketId) {
          this.io.to(socketId).emit('analysis:progress', progress);
        }
      };

      emitProgress({ step: 'fetching', progress: 10, message: 'Fetching URL content...' });

      const html = await htmlFetcherService.fetchHtml(url);

      const result = accessibilityService.analyze(html, emitProgress);

      const duration = Date.now() - startTime;

      const savedAnalysis = await analysisRepository.create(url, result, duration);

      emitProgress({ step: 'done', progress: 100, message: 'Analysis saved!' });

      res.status(200).json({
        id: savedAnalysis._id,
        url: savedAnalysis.url,
        result: savedAnalysis.result,
        analyzedAt: savedAnalysis.analyzedAt,
        duration: savedAnalysis.duration
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  };

  getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = paginationSchema.safeParse(req.query);

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation error',
          details: validation.error.issues
        });
        return;
      }

      const { page, limit } = validation.data;
      const result = await analysisRepository.findAll(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const analysis = await analysisRepository.findById(id);

      if (!analysis) {
        res.status(404).json({ error: 'Analysis not found' });
        return;
      }

      res.status(200).json(analysis);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  };
}

export default new AnalysisController();
