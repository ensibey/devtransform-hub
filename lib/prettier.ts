import prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';
import * as parserYaml from 'prettier/plugins/yaml';
import * as parserHtml from 'prettier/plugins/html';
import * as parserMarkdown from 'prettier/plugins/markdown';
import { format as formatSql } from 'sql-formatter';
import { FormatId } from './matrix';

export async function formatCode(code: string, formatId: FormatId): Promise<string> {
  if (!code.trim()) return '';

  try {
    switch (formatId) {
      case 'json':
        // Prettier JSON or native JSON.stringify formatted
        try {
          return await prettier.format(code, {
            parser: 'json',
            plugins: [parserBabel, parserEstree],
            tabWidth: 2,
            useTabs: false,
          });
        } catch {
          const parsed = JSON.parse(code);
          return JSON.stringify(parsed, null, 2);
        }

      case 'yaml':
        return await prettier.format(code, {
          parser: 'yaml',
          plugins: [parserYaml],
          tabWidth: 2,
        });

      case 'typescript':
      case 'python':
      case 'go':
      case 'rust':
        // Format JS/TS or clean up whitespace
        if (formatId === 'typescript') {
          return await prettier.format(code, {
            parser: 'typescript',
            plugins: [parserBabel, parserEstree],
            semi: true,
            singleQuote: false,
            tabWidth: 2,
          });
        }
        return code.trim();

      case 'xml':
        try {
          return await prettier.format(code, {
            parser: 'html',
            plugins: [parserHtml],
            tabWidth: 2,
          });
        } catch {
          return code.trim();
        }

      case 'sql':
        return formatSql(code, {
          language: 'sql',
          tabWidth: 2,
          keywordCase: 'upper',
          linesBetweenQueries: 2,
        });

      case 'toml':
      case 'csv':
      default:
        return code.trim();
    }
  } catch (error) {
    console.warn(`Prettier formatting warning for ${formatId}:`, error);
    return code; // return original code if formatting fails (e.g. partial syntax)
  }
}
