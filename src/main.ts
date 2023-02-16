// graphql file composer
// (c) 2023 Richard Marks
// MIT License

import { dirname, join, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

interface ComposeResult {
  files: string[];
}

async function compose(input: string, output: string): Promise<ComposeResult> {
  const result: ComposeResult = { files: [] };
  if (!input || !input.length) {
    throw new Error('Missing required input parameter');
  }

  if (!output || !output.length) {
    throw new Error('Missing required output parameter');
  }
  
  console.log(`🤔  composing from ${input} ...`);

  const content = await readFile(input, { encoding: 'utf-8' });
  const processed = await preprocessFileContent(input, content, result);
  await writeFile(output, processed.filter(Boolean).join('\n'), 'utf-8');

  return result;
}

function matchIncludeDirective(line: string): null | RegExpMatchArray {
  // # #include "filepath"
  return line.match(/^\s?#\s?#include\s?"(.*)"$/);
}

async function preprocessFileContent(
  input: string,
  content: string,
  composeResult: ComposeResult
): Promise<string[]> {
  composeResult.files.push(input);
  const result = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = matchIncludeDirective(line);
    if (match) {
      const includeFilename = match[1];
      const pathToIncludeFile = join(dirname(input), includeFilename);
      const includeContent = await readFile(pathToIncludeFile, {
        encoding: 'utf-8',
      });
      const includedLines = await preprocessFileContent(
        pathToIncludeFile,
        includeContent,
        composeResult
      );
      result.push(...includedLines);
    } else {
      result.push(line);
    }
  }

  return result;
}

async function main() {
  const params = process.argv.slice(2);
  const [input, output] = params;
  console.log(`🤔  composing from ${input} ...`);
  const composed = await compose(input, output);
  console.info(
    `✓  composed ${composed.files.length} file${
      composed.files.length === 1 ? '' : 's'
    } into ${output}`
  );
  if (process.env.DEBUG) {
    for (const file of composed.files) {
      console.log(`✓  composition includes ${file}`);
    }
  }
}
  
main().catch(err => {
  if (err instanceof Error) {
    console.log(`💥  ${err.message}`);
    if (process.env.DEBUG) {
      console.log(err.stack);
    }
  }
  process.exit(1);
});
