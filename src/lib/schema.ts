export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaBuffer
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaString;

export type SchemaArray = {
  items?: Schema;
  maxItems?: number;
  minItems?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'array';
}

export type SchemaBoolean = {
  nullable?: boolean;
  required?: boolean;
  type: 'boolean';
}

export type SchemaBuffer = {
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'buffer';
}

export type SchemaEnum = {
  enum: (string | number)[];
  nullable?: boolean;
  required?: boolean;
  type: 'enum';
}

export type SchemaNumber = {
  max?: number;
  min?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'number';
}

export type SchemaObject = {
  nullable?: boolean;
  properties?: { [name: string]: Schema; };
  required?: boolean;
  strict?: boolean;
  type: 'object';
}

export type SchemaString = {
  expressions?: RegExp[];
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'string';
}
