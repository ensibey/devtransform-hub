import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  FetchingJSONSchemaStore,
  RendererOptions,
} from 'quicktype-core';

export interface QuickTypeOptions {
  typeName?: string;
  // TypeScript options
  tsJustTypes?: boolean;
  tsExplicitTypes?: boolean;
  tsPreferInterfaces?: boolean;
  // Go options
  goPackage?: string;
  goJustTypes?: boolean;
  // Rust options
  rustVisibility?: 'pub' | 'crate' | 'private';
  rustDeriveDebug?: boolean;
  rustDeriveClone?: boolean;
  // Python options
  pythonTarget?: 'pydantic' | 'dataclass';
}

export async function runQuicktype(
  targetLanguage: string,
  typeName: string,
  jsonString: string,
  options: QuickTypeOptions = {}
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage as any);

  await jsonInput.addSource({
    name: typeName || 'GeneratedType',
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const rendererOptions: Record<string, any> = {};

  switch (targetLanguage) {
    case 'typescript':
    case 'ts':
      rendererOptions['just-types'] = 'true';
      if (options.tsPreferInterfaces) {
        rendererOptions['prefer-interfaces'] = 'true';
      }
      break;

    case 'go':
    case 'golang':
      rendererOptions['package'] = options.goPackage || 'main';
      rendererOptions['just-types'] = 'true';
      break;

    case 'rust':
    case 'rs':
      rendererOptions['density'] = 'normal';
      rendererOptions['visibility'] = options.rustVisibility || 'pub';
      rendererOptions['derive-debug'] = 'true';
      break;

    case 'python':
    case 'py':
      if (options.pythonTarget === 'dataclass') {
        rendererOptions['target-type'] = 'dataclasses';
      } else {
        rendererOptions['target-type'] = 'pydantic';
      }
      break;

    case 'csharp':
    case 'cs':
      rendererOptions['namespace'] = 'QuickType';
      rendererOptions['array-type'] = 'list';
      break;

    case 'kotlin':
    case 'kt':
      rendererOptions['framework'] = 'jackson';
      break;

    default:
      break;
  }

  const result = await quicktype({
    inputData,
    lang: targetLanguage as any,
    rendererOptions,
  });

  return result.lines.join('\n');
}
