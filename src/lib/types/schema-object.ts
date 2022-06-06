import { SchemaArray } from './schema-array';
import { SchemaBoolean } from './schema-boolean';
import { SchemaEnum } from './schema-enum';
import { SchemaNumber } from './schema-number';
import { SchemaString } from './schema-string';

export type SchemaObject = {
  nullable?: boolean;
  properties?: {
    [name: string]:
      | SchemaArray
      | SchemaBoolean
      | SchemaEnum
      | SchemaNumber
      | SchemaObject
      | SchemaString;
  };
  required?: boolean;
  strict?: boolean;
  type: 'object';
}
