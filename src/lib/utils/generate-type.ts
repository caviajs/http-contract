import { Schema } from '../schema';
import { generateStructure } from './generate-structure';
import { pascalCase } from './pascal-case';

export function generateType(name: string, schema: Schema): string {
  return `export type ${ pascalCase(name) } = ${ generateStructure(schema) };`;
}
