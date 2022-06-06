export type SchemaString = {
  expressions?: RegExp[];
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'string';
}
