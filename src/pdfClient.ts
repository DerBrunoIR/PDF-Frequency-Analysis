import PdfWorker from './pdf.worker?worker';
import type { Frequencies } from "./types";

export const runPdfAnalysisInWorker = (file: File): Promise<Frequencies> => {
  return new Promise(async (resolve, reject) => {
    const worker = new PdfWorker();
    const buffer = await file.arrayBuffer();

    worker.onmessage = (e: MessageEvent) => {
      const { type, data, error } = e.data;
      
      if (type === 'success') {
        // Reconstruct Map from the array entries
        resolve(new Map(data));
      } else {
        reject(new Error(error));
      }
      
      worker.terminate(); // Clean up thread immediately after success
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    // Send data (using Transferable object for zero-copy performance)
    worker.postMessage({ fileBuffer: buffer }, [buffer]);
  });
};
