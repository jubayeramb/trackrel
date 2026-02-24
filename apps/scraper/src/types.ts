export interface ScrapeJobData {
  monitorId: string;
  url: string;
  selector: string;
  userId: string;
}

export interface ScrapeJobResult {
  detectedText: string;
  hash: string;
  changed: boolean;
  responseTimeMs: number;
}
