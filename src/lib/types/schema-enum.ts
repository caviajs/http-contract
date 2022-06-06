export type SchemaEnum = {
  enum: (string | number)[];
  nullable?: boolean;
  required?: boolean;
  type: 'enum';
}
