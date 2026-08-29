import YAML from 'yaml';
import Papa from 'papaparse';
import xmlJs from 'xml-js';
import toml from '@iarna/toml';
import { FormatId } from '../matrix';
import { runQuicktype, QuickTypeOptions } from '../quicktypeRunner';

export interface ConversionResult {
  output: string;
  durationMs: number;
  inputBytes: number;
  outputBytes: number;
  lineCount: number;
}

/**
 * Parses input string from a source format into an in-memory JS structure.
 */
export function parseSourceToJS(input: string, from: FormatId): any {
  const trimmed = input.trim();
  if (!trimmed) return null;

  switch (from) {
    case 'json':
      return JSON.parse(trimmed);

    case 'yaml':
      return YAML.parse(trimmed);

    case 'csv': {
      const parsed = Papa.parse(trimmed, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
        throw new Error(`CSV Parsing Error: ${parsed.errors[0].message}`);
      }
      return parsed.data;
    }

    case 'xml': {
      const xmlObj = xmlJs.xml2js(trimmed, {
        compact: true,
        ignoreComment: true,
        nativeType: true,
      });
      return xmlObj;
    }

    case 'toml':
      return toml.parse(trimmed);

    case 'sql':
      return parseSqlToJS(trimmed);

    case 'typescript':
    case 'go':
    case 'rust':
    case 'python':
      // For type definitions as input, infer a mock JSON instance from the types
      return inferSampleFromTypeDefinition(trimmed, from);

    default:
      throw new Error(`Unsupported source format: ${from}`);
  }
}

/**
 * Serializes a JS structure into the requested target format.
 */
export async function serializeJSToTarget(
  data: any,
  to: FormatId,
  options: QuickTypeOptions = {}
): Promise<string> {
  if (data === null || data === undefined) return '';

  const jsonString = JSON.stringify(data, null, 2);

  switch (to) {
    case 'json':
      return jsonString;

    case 'yaml':
      return YAML.stringify(data, { indent: 2 });

    case 'csv': {
      // Flatten arrays or wrap single object in array
      const arrayData = Array.isArray(data) ? data : [flattenObject(data)];
      const flatList = arrayData.map((item) =>
        typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
      );
      return Papa.unparse(flatList);
    }

    case 'xml': {
      let rootWrapper: any = data;
      // If root is array or primitive, wrap in root tag
      if (Array.isArray(data)) {
        rootWrapper = { root: { item: data } };
      } else if (typeof data !== 'object' || data === null) {
        rootWrapper = { root: { _text: String(data) } };
      } else if (!data.root && !data.user && !data.data && Object.keys(data).length > 1) {
        rootWrapper = { root: data };
      }
      return xmlJs.js2xml(rootWrapper, {
        compact: true,
        spaces: 2,
      });
    }

    case 'toml': {
      const obj = Array.isArray(data)
        ? { items: data }
        : typeof data === 'object' && data !== null
        ? data
        : { value: data };
      return toml.stringify(sanitizeForToml(obj));
    }

    case 'typescript':
      return runQuicktype('typescript', options.typeName || 'DataRecord', jsonString, options);

    case 'go':
      return runQuicktype('go', options.typeName || 'DataRecord', jsonString, options);

    case 'rust':
      return runQuicktype('rust', options.typeName || 'DataRecord', jsonString, options);

    case 'python':
      return runQuicktype('python', options.typeName || 'DataRecord', jsonString, options);

    case 'sql':
      return generateSqlDDLAndInserts(data, options.typeName || 'records');

    default:
      throw new Error(`Unsupported target format: ${to}`);
  }
}

/**
 * Universal Master Conversion Entrypoint
 */
export async function convertData(
  input: string,
  from: FormatId,
  to: FormatId,
  options: QuickTypeOptions = {}
): Promise<ConversionResult> {
  const startTime = performance.now();
  const inputBytes = new Blob([input]).size;

  if (!input.trim()) {
    return {
      output: '',
      durationMs: 0,
      inputBytes: 0,
      outputBytes: 0,
      lineCount: 0,
    };
  }

  // 1. Direct same-format formatting/passthrough
  if (from === to) {
    const output = input;
    const durationMs = parseFloat((performance.now() - startTime).toFixed(2));
    const outputBytes = new Blob([output]).size;
    return {
      output,
      durationMs,
      inputBytes,
      outputBytes,
      lineCount: output.split('\n').length,
    };
  }

  // 2. Parse source -> JS
  const jsData = parseSourceToJS(input, from);

  // 3. Serialize JS -> Target
  const output = await serializeJSToTarget(jsData, to, options);
  const durationMs = parseFloat((performance.now() - startTime).toFixed(2));
  const outputBytes = new Blob([output]).size;
  const lineCount = output.split('\n').length;

  return {
    output,
    durationMs,
    inputBytes,
    outputBytes,
    lineCount,
  };
}

/**
 * Helper: Flatten nested JSON objects for CSV tabular export.
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  if (!obj || typeof obj !== 'object') {
    return { value: obj };
  }

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(flattened, flattenObject(val, newKey));
    } else if (Array.isArray(val)) {
      flattened[newKey] = JSON.stringify(val);
    } else {
      flattened[newKey] = val;
    }
  }

  return flattened;
}

/**
 * Helper: Sanitize structures for TOML serialization (dates, primitives).
 */
function sanitizeForToml(obj: any): any {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForToml);
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }
    result[key] = sanitizeForToml(value);
  }
  return result;
}

/**
 * Generates clean SQL Table Schema DDL + INSERT statements.
 */
function generateSqlDDLAndInserts(data: any, tableName = 'records'): string {
  const safeTableName = tableName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const items: Record<string, any>[] = Array.isArray(data)
    ? data
    : typeof data === 'object' && data !== null
    ? [data]
    : [{ value: data }];

  if (items.length === 0) {
    return `-- No records found to generate SQL schema`;
  }

  // Collect column types across all items
  const columns: Record<string, string> = {};
  for (const item of items) {
    for (const [key, val] of Object.entries(item)) {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
      if (!columns[sanitizedKey]) {
        columns[sanitizedKey] = inferSqlColumnType(val);
      }
    }
  }

  // Build CREATE TABLE DDL
  const columnDefs = Object.entries(columns).map(([col, type]) => {
    const isId = col.toLowerCase() === 'id';
    return `  "${col}" ${type}${isId ? ' PRIMARY KEY' : ''}`;
  });

  const createTable = `CREATE TABLE IF NOT EXISTS "${safeTableName}" (\n${columnDefs.join(',\n')}\n);`;

  // Build INSERT statements
  const insertStatements = items.map((item) => {
    const cols: string[] = [];
    const values: string[] = [];

    for (const [col] of Object.entries(columns)) {
      cols.push(`"${col}"`);
      const rawVal = item[col] !== undefined ? item[col] : item[Object.keys(item).find(k => k.replace(/[^a-zA-Z0-9_]/g, '_') === col) || ''];
      values.push(formatSqlValue(rawVal));
    }

    return `INSERT INTO "${safeTableName}" (${cols.join(', ')})\nVALUES (${values.join(', ')});`;
  });

  return `${createTable}\n\n${insertStatements.join('\n\n')}`;
}

function inferSqlColumnType(val: any): string {
  if (val === null || val === undefined) return 'TEXT';
  if (typeof val === 'boolean') return 'BOOLEAN';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? 'BIGINT' : 'DOUBLE PRECISION';
  }
  if (Array.isArray(val) || typeof val === 'object') {
    return 'JSONB';
  }
  // Check for ISO Date format
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(val)) {
    return 'TIMESTAMP WITH TIME ZONE';
  }
  return 'VARCHAR(255)';
}

function formatSqlValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return String(val);
  if (Array.isArray(val) || typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

/**
 * Helper: Parse basic SQL insert or select statements into JSON records.
 */
function parseSqlToJS(sql: string): any {
  const insertMatches = Array.from(sql.matchAll(/INSERT\s+INTO\s+[\w"]+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi));
  if (insertMatches.length > 0) {
    const results: any[] = [];
    for (const match of insertMatches) {
      const cols = match[1].split(',').map((c) => c.trim().replace(/["'`]/g, ''));
      const rawVals = match[2].split(',').map((v) => v.trim());
      const record: Record<string, any> = {};
      cols.forEach((col, idx) => {
        let val: any = rawVals[idx] || null;
        if (typeof val === 'string') {
          if (val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
          } else if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val))) val = Number(val);
        }
        record[col] = val;
      });
      results.push(record);
    }
    return results.length === 1 ? results[0] : results;
  }

  // Fallback: parse CREATE TABLE columns into mock schema object
  const createMatch = sql.match(/CREATE\s+TABLE\s+[\w"]+\s*\(([\s\S]+?)\);/i);
  if (createMatch) {
    const lines = createMatch[1].split(',').map((l) => l.trim());
    const mockRecord: Record<string, any> = {};
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const col = parts[0].replace(/["'`]/g, '');
        const type = parts[1].toUpperCase();
        if (col.toUpperCase() === 'PRIMARY' || col.toUpperCase() === 'CONSTRAINT') continue;
        if (type.includes('INT') || type.includes('NUMERIC') || type.includes('FLOAT')) {
          mockRecord[col] = 1;
        } else if (type.includes('BOOL')) {
          mockRecord[col] = true;
        } else {
          mockRecord[col] = `example_${col}`;
        }
      }
    }
    return mockRecord;
  }

  throw new Error('Unable to parse SQL: Provide valid INSERT INTO or CREATE TABLE statements.');
}

/**
 * Helper: Parse basic TypeScript/Go/Rust/Python type definitions into mock sample object.
 */
function inferSampleFromTypeDefinition(code: string, from: FormatId): any {
  const result: Record<string, any> = {};

  if (from === 'typescript') {
    // Match propertyName: type
    const matches = Array.from(code.matchAll(/([a-zA-Z0-9_]+)\s*\??:\s*([a-zA-Z0-9_\[\]]+);?/g));
    for (const match of matches) {
      const field = match[1];
      const type = match[2].trim().toLowerCase();
      if (type.includes('string')) result[field] = 'sample_text';
      else if (type.includes('number')) result[field] = 42;
      else if (type.includes('boolean')) result[field] = true;
      else if (type.includes('[]') || type.includes('array')) result[field] = ['item1', 'item2'];
      else result[field] = {};
    }
  } else if (from === 'go') {
    const matches = Array.from(code.matchAll(/([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_\[\]]+)\s+`json:"([^"]+)"`/g));
    for (const match of matches) {
      const jsonKey = match[3];
      const type = match[2].trim().toLowerCase();
      if (type.includes('string')) result[jsonKey] = 'sample_text';
      else if (type.includes('int') || type.includes('float')) result[jsonKey] = 42;
      else if (type.includes('bool')) result[jsonKey] = true;
      else if (type.includes('[]')) result[jsonKey] = ['item1', 'item2'];
      else result[jsonKey] = {};
    }
  } else if (from === 'rust') {
    const matches = Array.from(code.matchAll(/pub\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>\s]+),?/g));
    for (const match of matches) {
      const field = match[1];
      const type = match[2].trim().toLowerCase();
      if (type.includes('string')) result[field] = 'sample_text';
      else if (type.includes('i') || type.includes('u') || type.includes('f')) result[field] = 42;
      else if (type.includes('bool')) result[field] = true;
      else if (type.includes('vec')) result[field] = ['item1', 'item2'];
      else result[field] = {};
    }
  } else if (from === 'python') {
    const matches = Array.from(code.matchAll(/([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_\[\]]+)/g));
    for (const match of matches) {
      const field = match[1];
      const type = match[2].trim().toLowerCase();
      if (type.includes('str')) result[field] = 'sample_text';
      else if (type.includes('int') || type.includes('float')) result[field] = 42;
      else if (type.includes('bool')) result[field] = true;
      else if (type.includes('list')) result[field] = ['item1', 'item2'];
      else result[field] = {};
    }
  }

  if (Object.keys(result).length === 0) {
    return {
      id: "sample_001",
      name: "Sample Object",
      active: true,
      count: 10
    };
  }

  return result;
}
