import { convertData } from '../lib/converters';
import { formatCode } from '../lib/prettier';
import { FormatId } from '../lib/matrix';
import { QuickTypeOptions } from '../lib/quicktypeRunner';

export type WorkerRequestType = 'convert' | 'format';

export interface WorkerRequestMessage {
  id: string;
  type: WorkerRequestType;
  input: string;
  from?: FormatId;
  to?: FormatId;
  options?: QuickTypeOptions;
}

export interface WorkerResponseMessage {
  id: string;
  success: boolean;
  output?: string;
  durationMs?: number;
  inputBytes?: number;
  outputBytes?: number;
  lineCount?: number;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

// In WebWorker global scope
addEventListener('message', async (event: MessageEvent<WorkerRequestMessage>) => {
  const { id, type, input, from, to, options } = event.data;

  try {
    if (type === 'convert') {
      if (!from || !to) {
        throw new Error('Conversion requires both "from" and "to" format parameters.');
      }
      const result = await convertData(input, from, to, options);
      const response: WorkerResponseMessage = {
        id,
        success: true,
        output: result.output,
        durationMs: result.durationMs,
        inputBytes: result.inputBytes,
        outputBytes: result.outputBytes,
        lineCount: result.lineCount,
      };
      postMessage(response);
    } else if (type === 'format') {
      if (!from) {
        throw new Error('Formatting requires a target format parameter.');
      }
      const startTime = performance.now();
      const output = await formatCode(input, from);
      const durationMs = parseFloat((performance.now() - startTime).toFixed(2));
      const response: WorkerResponseMessage = {
        id,
        success: true,
        output,
        durationMs,
        inputBytes: new Blob([input]).size,
        outputBytes: new Blob([output]).size,
        lineCount: output.split('\n').length,
      };
      postMessage(response);
    }
  } catch (err: any) {
    const errorMessage = err?.message || String(err);

    // Extract line/column information if present in error message
    let errorLine: number | undefined;
    let errorColumn: number | undefined;

    const lineMatch = errorMessage.match(/line (\d+)/i) || errorMessage.match(/at position (\d+)/i);
    if (lineMatch) {
      errorLine = parseInt(lineMatch[1], 10);
    }
    const colMatch = errorMessage.match(/column (\d+)/i);
    if (colMatch) {
      errorColumn = parseInt(colMatch[1], 10);
    }

    const response: WorkerResponseMessage = {
      id,
      success: false,
      error: errorMessage,
      errorLine,
      errorColumn,
    };
    postMessage(response);
  }
});
