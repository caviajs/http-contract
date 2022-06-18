import { generateStructure } from './generate-structure';
import { SchemaArray } from './schema-array';
import { SchemaBoolean } from './schema-boolean';
import { SchemaBuffer } from './schema-buffer';
import { SchemaEnum } from './schema-enum';
import { SchemaNumber } from './schema-number';
import { SchemaObject } from './schema-object';
import { SchemaStream } from './schema-stream';
import { SchemaString } from './schema-string';

export function generateType(
  name: string,
  schema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString,
): string {
  return `export type ${ name } = ${ generateStructure(schema) };`;
}
