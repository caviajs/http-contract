import { SchemaArray, SchemaBuffer, SchemaBoolean, SchemaEnum, SchemaNumber, SchemaObject, SchemaString, Schema } from './schema';

const DEFAULT_NULLABLE: boolean = false;
const DEFAULT_REQUIRED: boolean = false;
const DEFAULT_STRICT: boolean = false;

export function getSchemaNullable(schema: Schema): boolean {
  return schema.hasOwnProperty('nullable') ? schema.nullable : DEFAULT_NULLABLE;
}

export function getSchemaRequired(schema: Schema): boolean {
  return schema.hasOwnProperty('required') ? schema.required : DEFAULT_REQUIRED;
}

export function getSchemaStrict(schema: SchemaObject): boolean {
  return schema.hasOwnProperty('strict') ? schema.strict : DEFAULT_STRICT;
}

export function isSchemaArray(schema: any): schema is SchemaArray {
  return schema?.type === 'array';
}

export function isSchemaBoolean(schema: any): schema is SchemaBoolean {
  return schema?.type === 'boolean';
}

export function isSchemaBuffer(schema: any): schema is SchemaBuffer {
  return schema?.type === 'buffer';
}

export function isSchemaEnum(schema: any): schema is SchemaEnum {
  return schema?.type === 'enum';
}

export function isSchemaNumber(schema: any): schema is SchemaNumber {
  return schema?.type === 'number';
}

export function isSchemaObject(schema: any): schema is SchemaObject {
  return schema?.type === 'object';
}

export function isSchemaString(schema: any): schema is SchemaString {
  return schema?.type === 'string';
}

export class Validator {
  public static validate(schema: Schema, data: any, path: string[] = []): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isSchemaArray(schema)) {
      errors.push(...this.validateSchemaArray(schema, data, path));
    } else if (isSchemaBuffer(schema)) {
      errors.push(...this.validateSchemaBuffer(schema, data, path));
    } else if (isSchemaBoolean(schema)) {
      errors.push(...this.validateSchemaBoolean(schema, data, path));
    } else if (isSchemaEnum(schema)) {
      errors.push(...this.validateSchemaEnum(schema, data, path));
    } else if (isSchemaNumber(schema)) {
      errors.push(...this.validateSchemaNumber(schema, data, path));
    } else if (isSchemaObject(schema)) {
      errors.push(...this.validateSchemaObject(schema, data, path));
    } else if (isSchemaString(schema)) {
      errors.push(...this.validateSchemaString(schema, data, path));
    }

    return errors;
  }

  protected static validateSchemaArray(schema: SchemaArray, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (Array.isArray(data)) {
      if (schema.items) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...this.validate(schema.items, it, [...path, index]));
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

  protected static validateSchemaBoolean(schema: SchemaBoolean, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'boolean') {
      errors.push({ message: `The value should be boolean`, path: path.join('.') });
    }

    return errors;
  }

  protected static validateSchemaBuffer(schema: SchemaBuffer, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (Buffer.isBuffer(data) === false) {
      errors.push({ message: `The value should be buffer`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('maxSize') && (Buffer.isBuffer(data) === false || data?.length > schema.maxSize)) {
      errors.push({ message: `The value size should be less than or equal to ${ schema.maxSize }`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('minSize') && (Buffer.isBuffer(data) === false || data?.length < schema.minSize)) {
      errors.push({ message: `The value size should be greater than or equal to ${ schema.minSize }`, path: path.join('.') });
    }

    return errors;
  }

  protected static validateSchemaEnum(schema: SchemaEnum, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (schema.enum.includes(data) === false) {
      errors.push({ message: `The value must be one of the following values: ${ schema.enum.join(', ') }`, path: path.join('.') });
    }

    return errors;
  }

  protected static validateSchemaNumber(schema: SchemaNumber, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'number' || isNaN(data)) {
      errors.push({ message: `The value should be number`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('max') && (typeof data !== 'number' || data > schema.max)) {
      errors.push({ message: `The value should be less than or equal to ${ schema.max }`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('min') && (typeof data !== 'number' || data < schema.min)) {
      errors.push({ message: `The value should be greater than or equal to ${ schema.min }`, path: path.join('.') });
    }

    return errors;
  }

  protected static validateSchemaObject(schema: SchemaObject, data: any, path: string[]): ValidationError[] {
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
      errors.push(...this.validate(propertySchema, data?.[propertyName], [...path, propertyName]));
    }

    return errors;
  }

  protected static validateSchemaString(schema: SchemaString, data: any, path: string[]): ValidationError[] {
    if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (getSchemaRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'string') {
      errors.push({ message: `The value should be string`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('expressions')) {
      for (const expression of schema.expressions) {
        if (typeof data !== 'string' || expression.test(data) === false) {
          errors.push({ message: `The value should match a regular expression ${ expression }`, path: path.join('.') });
        }
      }
    }

    if (schema.hasOwnProperty('maxLength') && (typeof data !== 'string' || data.length > schema.maxLength)) {
      errors.push({ message: `The value must be shorter than or equal to ${ schema.maxLength } characters`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('minLength') && (typeof data !== 'string' || data.length < schema.minLength)) {
      errors.push({ message: `The value must be longer than or equal to ${ schema.minLength } characters`, path: path.join('.') });
    }

    return errors;
  }
}

export interface ValidationError {
  message: string;
  path: string;
}
