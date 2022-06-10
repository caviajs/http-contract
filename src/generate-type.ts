import { generateStructure } from './generate-structure';
import { pascalCase } from './lib/utils/pascal-case';
import { SchemaArray } from './lib/types/schema-array';
import { SchemaBoolean } from './lib/types/schema-boolean';
import { SchemaBuffer } from './lib/types/schema-buffer';
import { SchemaEnum } from './lib/types/schema-enum';
import { SchemaNumber } from './lib/types/schema-number';
import { SchemaObject } from './lib/types/schema-object';
import { SchemaStream } from './lib/types/schema-stream';
import { SchemaString } from './lib/types/schema-string';

export function generateType(
  name: string,
  schema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString,
): string {
  return `export type ${ pascalCase(name) } = ${ generateStructure(schema) };`;
}
