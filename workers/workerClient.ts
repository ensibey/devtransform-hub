import { FormatId } from '../lib/matrix';
import { QuickTypeOptions } from '../lib/quicktypeRunner';
import {
  WorkerRequestMessage,
  WorkerResponseMessage,
} from './converter.worker';

export interface ConvertRequestPayload {
  input: string;
  from: FormatId;
  to: FormatId;
  options?: QuickTypeOptions;
}

export interface FormatRequestPayload {
  input: string;
  format: FormatId;
}

export interface ConversionResponse {
  output: string;
  durationMs: number;
  inputBytes: number;
  outputBytes: number;
  lineCount: number;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

class WorkerBridge {
  private worker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (val: ConversionResponse) => void;
      reject: (err: any) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  private requestCounter = 0;
  private isTerminated = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return;

    try {
      this.worker = new Worker(
        new URL('./converter.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
        const { id, success, output, durationMs, inputBytes, outputBytes, lineCount, error, errorLine, errorColumn } =
          event.data;

        const pending = this.pendingRequests.get(id);
        if (!pending) return;

        clearTimeout(pending.timer);
        this.pendingRequests.delete(id);

        if (success && output !== undefined) {
          pending.resolve({
            output,
            durationMs: durationMs || 0,
            inputBytes: inputBytes || 0,
            outputBytes: outputBytes || 0,
            lineCount: lineCount || 0,
          });
        } else {
          pending.resolve({
            output: '',
            durationMs: 0,
            inputBytes: 0,
            outputBytes: 0,
            lineCount: 0,
            error: error || 'An unknown conversion error occurred.',
            errorLine,
            errorColumn,
          });
        }
      };

      this.worker.onerror = (err) => {
        console.error('Worker error encounter:', err);
        this.restartWorker();
      };
    } catch (err) {
      console.warn('Failed to initialize dedicated Web Worker, fallback will be used:', err);
      this.worker = null;
    }
  }

  private restartWorker() {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch {}
      this.worker = null;
    }

    // Reject remaining pending requests with timeout notice
    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timer);
      req.resolve({
        output: '',
        durationMs: 0,
        inputBytes: 0,
        outputBytes: 0,
        lineCount: 0,
        error: 'Conversion timed out or worker crashed. Worker has been restarted.',
      });
      this.pendingRequests.delete(id);
    }

    this.initWorker();
  }

  /**
   * Dispatches a conversion job to the Web Worker with a 3000ms watchdog timeout.
   */
  public async convert(payload: ConvertRequestPayload): Promise<ConversionResponse> {
    if (typeof window === 'undefined') {
      // In SSR context, return empty payload
      return {
        output: '',
        durationMs: 0,
        inputBytes: 0,
        outputBytes: 0,
        lineCount: 0,
      };
    }

    if (!this.worker) {
      this.initWorker();
    }

    const id = `req_${Date.now()}_${++this.requestCounter}`;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        console.warn(`Worker request ${id} exceeded 3000ms watchdog timeout. Restarting worker...`);
        this.restartWorker();
        resolve({
          output: '',
          durationMs: 3000,
          inputBytes: 0,
          outputBytes: 0,
          lineCount: 0,
          error: 'Conversion timed out (exceeded 3000ms limit). Check for circular references or extreme dataset size.',
        });
      }, 3000);

      this.pendingRequests.set(id, { resolve, reject, timer });

      const message: WorkerRequestMessage = {
        id,
        type: 'convert',
        input: payload.input,
        from: payload.from,
        to: payload.to,
        options: payload.options,
      };

      if (this.worker) {
        this.worker.postMessage(message);
      } else {
        clearTimeout(timer);
        this.pendingRequests.delete(id);
        resolve({
          output: '',
          durationMs: 0,
          inputBytes: 0,
          outputBytes: 0,
          lineCount: 0,
          error: 'Web Worker not available in this environment.',
        });
      }
    });
  }

  /**
   * Formats source code using Web Worker Prettier/formatter pipeline.
   */
  public async format(payload: FormatRequestPayload): Promise<ConversionResponse> {
    if (typeof window === 'undefined') {
      return {
        output: payload.input,
        durationMs: 0,
        inputBytes: 0,
        outputBytes: 0,
        lineCount: 0,
      };
    }

    if (!this.worker) {
      this.initWorker();
    }

    const id = `fmt_${Date.now()}_${++this.requestCounter}`;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.restartWorker();
        resolve({
          output: payload.input,
          durationMs: 3000,
          inputBytes: 0,
          outputBytes: 0,
          lineCount: 0,
          error: 'Formatting timed out.',
        });
      }, 3000);

      this.pendingRequests.set(id, { resolve, reject, timer });

      const message: WorkerRequestMessage = {
        id,
        type: 'format',
        input: payload.input,
        from: payload.format,
      };

      if (this.worker) {
        this.worker.postMessage(message);
      } else {
        clearTimeout(timer);
        this.pendingRequests.delete(id);
        resolve({
          output: payload.input,
          durationMs: 0,
          inputBytes: 0,
          outputBytes: 0,
          lineCount: 0,
        });
      }
    });
  }

  public terminate() {
    this.isTerminated = true;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Export singleton instance
export const workerClient = new WorkerBridge();
