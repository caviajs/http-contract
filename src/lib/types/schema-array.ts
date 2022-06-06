import { SchemaBoolean } from './schema-boolean';
import { SchemaEnum } from './schema-enum';
import { SchemaNumber } from './schema-number';
import { SchemaObject } from './schema-object';
import { SchemaString } from './schema-string';

export type SchemaArray = {
  items?:
    | SchemaArray
    | SchemaBoolean
    | SchemaEnum
    | SchemaNumber
    | SchemaObject
    | SchemaString;
  maxItems?: number;
  minItems?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'array';
}
