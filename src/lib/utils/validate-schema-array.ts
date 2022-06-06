import { SchemaArray } from '../types/schema-array';
import { ValidationError } from '../types/validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';
import { isSchemaArray } from './is-schema-array';
import { isSchemaBoolean } from './is-schema-boolean';
import { isSchemaEnum } from './is-schema-enum';
import { isSchemaNumber } from './is-schema-number';
import { isSchemaObject } from './is-schema-object';
import { isSchemaString } from './is-schema-string';
import { validateSchemaBoolean } from './validate-schema-boolean';
import { validateSchemaEnum } from './validate-schema-enum';
import { validateSchemaNumber } from './validate-schema-number';
import { validateSchemaString } from './validate-schema-string';
import { validateSchemaObject } from './validate-schema-object';

export function validateSchemaArray(schema: SchemaArray, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (Array.isArray(data)) {
    if (schema.items) {
      if (isSchemaArray(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaArray(schema.items, it, [...path, index]));
        }
      } else if (isSchemaBoolean(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaBoolean(schema.items, it, [...path, index]));
        }
      } else if (isSchemaEnum(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaEnum(schema.items, it, [...path, index]));
        }
      } else if (isSchemaNumber(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaNumber(schema.items, it, [...path, index]));
        }
      } else if (isSchemaObject(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaObject(schema.items, it, [...path, index]));
        }
      } else if (isSchemaString(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaString(schema.items, it, [...path, index]));
        }
      }
    }
  } else {
    errors.push({ message: `The value should be array`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('maxItems') && (!Array.isArray(data) || data.length > schema.maxItems)) {
    errors.push({ message: `The value can contain maximum ${ schema.maxItems } items`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('minItems') && (!Array.isArray(data) || data.length < schema.minItems)) {
    errors.push({ message: `The value should contain minimum ${ schema.minItems } items`, path: path.join('.') });
  }

  return errors;
}
