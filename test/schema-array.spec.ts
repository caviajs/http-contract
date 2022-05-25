import { SchemaArray, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaArray', () => {
  it('should validate the items condition correctly', () => {
    const schema: SchemaArray = {
      items: { type: 'string' },
      type: 'array',
    };

    // valid
    expect(Validator.validate(schema, ['Hello', 'World'])).toEqual([]);
    expect(Validator.validate(schema, ['Hello', 'World'], path)).toEqual([]);

    // invalid
    expect(Validator.validate(schema, ['Hello', 12, 'World', 45])).toEqual([
      { message: 'The value should be string', path: '1' },
      { message: 'The value should be string', path: '3' },
    ]);
    expect(Validator.validate(schema, ['Hello', 12, 'World', 45], path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar.1' },
      { message: 'The value should be string', path: 'foo.bar.3' },
    ]);
  });

  it('should validate the maxItems condition correctly', () => {
    const schema: SchemaArray = {
      maxItems: 2,
      type: 'array',
    };

    // greater than maxLength
    expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'])).toEqual([
      { message: 'The value can contain maximum 2 items', path: '' },
    ]);
    expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([
      { message: 'The value can contain maximum 2 items', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(Validator.validate(schema, ['Hello', 'Hello'])).toEqual([]);
    expect(Validator.validate(schema, ['Hello', 'Hello'], path)).toEqual([]);

    // less than maxLength
    expect(Validator.validate(schema, ['Hello'])).toEqual([]);
    expect(Validator.validate(schema, ['Hello'], path)).toEqual([]);
  });

  it('should validate the minItems condition correctly', () => {
    const schema: SchemaArray = {
      minItems: 2,
      type: 'array',
    };

    // greater than minItems
    expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'])).toEqual([]);
    expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([]);

    // equal to minItems
    expect(Validator.validate(schema, ['Hello', 'Hello'])).toEqual([]);
    expect(Validator.validate(schema, ['Hello', 'Hello'], path)).toEqual([]);

    // less than minItems
    expect(Validator.validate(schema, ['Hello'])).toEqual([
      { message: 'The value should contain minimum 2 items', path: '' },
    ]);
    expect(Validator.validate(schema, ['Hello'], path)).toEqual([
      { message: 'The value should contain minimum 2 items', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'array' }, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate({ type: 'array' }, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'array' }, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'array' }, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'array' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'array' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'array' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'array' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'array' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'array' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'array' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'array' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be array', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaArray = {
      nullable: false,
      required: true,
      type: 'array',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([]);
    expect(Validator.validate(schema, [], path)).toEqual([]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);
  });
});
