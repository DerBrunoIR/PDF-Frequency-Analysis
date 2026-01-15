import { PDFiumLibrary } from '@hyzyla/pdfium/browser/cdn';

// Define input/output types for strict typing
type WorkerMessage = { fileBuffer: ArrayBuffer };
type WorkerResponse = { type: 'success', data: [string, number[]][] } | { type: 'error', error: string };

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { fileBuffer } = e.data;
    const uint8Array = new Uint8Array(fileBuffer);

    // Initialize logic strictly inside the worker
    const library = await PDFiumLibrary.init({ disableCDNWarning: true });
    const doc = await library.loadDocument(uint8Array);
    const pageCount = doc.getPageCount();

    const freq = new Map<string, number[]>();
    const CONCURRENCY_LIMIT = 50;

    for (let i = 0; i < pageCount; i += CONCURRENCY_LIMIT) {
      const chunkPromises = [];
      const end = Math.min(i + CONCURRENCY_LIMIT, pageCount);

      for (let pageIndex = i; pageIndex < end; pageIndex++) {
        chunkPromises.push((async () => {
          const page = doc.getPage(pageIndex);
          const text = page.getText();
          
          // Tokenization
          const tokens = text.split(/\s+/)
            .map(t => t.toLowerCase())
            .filter(t => /^\w+$/.test(t));

          const localCounts = new Map<string, number>();
          for (const token of tokens) {
            localCounts.set(token, (localCounts.get(token) || 0) + 1);
          }
          return { pageIndex, counts: localCounts };
        })());
      }

      const results = await Promise.all(chunkPromises);

      // Merge results
      for (const { pageIndex, counts } of results) {
        for (const [word, count] of counts) {
          let globalArr = freq.get(word);
          if (!globalArr) {
            globalArr = new Array(pageCount).fill(0);
            freq.set(word, globalArr);
          }
          globalArr[pageIndex] = count;
        }
      }
    }

    doc.destroy();

    // Serialize Map to Array for transport
    const result: WorkerResponse = { 
      type: 'success', 
      data: Array.from(freq.entries()) 
    };
    
    self.postMessage(result);

  } catch (err) {
    self.postMessage({ type: 'error', error: (err as Error).message });
  }
};
