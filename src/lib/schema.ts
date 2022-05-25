export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaBuffer
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaString;

export type SchemaArray = {
  items?: SchemaArray | SchemaBoolean | SchemaEnum | SchemaNumber | SchemaObject | SchemaString;
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
  maxSize?: number;
  mimeTypes?: string[];
  minSize?: number;
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
  // wszystko oprócz SchemaBuffer
  properties?: {
    [name: string]: SchemaArray | SchemaBoolean | SchemaEnum | SchemaNumber | SchemaObject | SchemaString;
  };
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
