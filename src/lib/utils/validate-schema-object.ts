import { SchemaObject } from '../types/schema-object';
import { ValidationError } from '../types/validation-error';
import { getSchemaRequired } from './get-schema-required';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaStrict } from './get-schema-strict';
import { isSchemaArray } from './is-schema-array';
import { isSchemaBoolean } from './is-schema-boolean';
import { isSchemaEnum } from './is-schema-enum';
import { isSchemaNumber } from './is-schema-number';
import { isSchemaObject } from './is-schema-object';
import { isSchemaString } from './is-schema-string';
import { validateSchemaArray } from './validate-schema-array';
import { validateSchemaBoolean } from './validate-schema-boolean';
import { validateSchemaEnum } from './validate-schema-enum';
import { validateSchemaNumber } from './validate-schema-number';
import { validateSchemaString } from './validate-schema-string';

export function validateSchemaObject(schema: SchemaObject, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data) && !Buffer.isBuffer(data)) {
    if (getSchemaStrict(schema) === true) {
      for (const propertyName of Object.keys(data)) {
        if ((schema.properties || {}).hasOwnProperty(propertyName) === false) {
          errors.push({ message: `The following property is not allowed: ${ propertyName }`, path: path.join('.') });
        }
      }
    }
  } else {
    errors.push({ message: `The value should be object`, path: path.join('.') });
  }

  for (const [propertyName, propertySchema] of Object.entries(schema.properties || {})) {
    if (isSchemaArray(propertySchema)) {
      errors.push(...validateSchemaArray(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaBoolean(propertySchema)) {
      errors.push(...validateSchemaBoolean(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaEnum(propertySchema)) {
      errors.push(...validateSchemaEnum(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaNumber(propertySchema)) {
      errors.push(...validateSchemaNumber(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaObject(propertySchema)) {
      errors.push(...validateSchemaObject(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaString(propertySchema)) {
      errors.push(...validateSchemaString(propertySchema, data?.[propertyName], [...path, propertyName]));
    }
  }

  return errors;
}
