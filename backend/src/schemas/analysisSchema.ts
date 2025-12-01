import { z } from 'zod';

export const analyzeUrlSchema = z.object({
  url: z
    .string()
    .url({ message: 'Invalid URL format' })
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      { message: 'URL must start with http:// or https://' }
    )
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, { message: 'Limit must be between 1 and 100' })
});

export type AnalyzeUrlInput = z.infer<typeof analyzeUrlSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
