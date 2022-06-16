import { generateStructure } from './generate-structure';
import { pascalCase } from './pascal-case';
import { SchemaArray } from '../lib/schema-array';
import { SchemaBoolean } from '../lib/schema-boolean';
import { SchemaBuffer } from '../lib/schema-buffer';
import { SchemaEnum } from '../lib/schema-enum';
import { SchemaNumber } from '../lib/schema-number';
import { SchemaObject } from '../lib/schema-object';
import { SchemaStream } from '../lib/schema-stream';
import { SchemaString } from '../lib/schema-string';

export function generateType(
  name: string,
  schema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString,
): string {
  return `export type ${ pascalCase(name) } = ${ generateStructure(schema) };`;
}
