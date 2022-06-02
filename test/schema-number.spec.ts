import { SchemaNumber, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaNumber', () => {
  it('should validate the max condition correctly', () => {
    const schema: SchemaNumber = {
      max: 10,
      type: 'number',
    };

    // greater than max
    expect(Validator.validate(schema, 15)).toEqual([
      { message: 'The value should be less than or equal to 10', path: '' },
    ]);
    expect(Validator.validate(schema, 15, path)).toEqual([
      { message: 'The value should be less than or equal to 10', path: 'foo.bar' },
    ]);

    // equal to max
    expect(Validator.validate(schema, 10)).toEqual([]);
    expect(Validator.validate(schema, 10, path)).toEqual([]);

    // less than max
    expect(Validator.validate(schema, 5)).toEqual([]);
    expect(Validator.validate(schema, 5, path)).toEqual([]);
  });

  it('should validate the min condition correctly', () => {
    const schema: SchemaNumber = {
      min: 10,
      type: 'number',
    };

    // greater than min
    expect(Validator.validate(schema, 15)).toEqual([]);
    expect(Validator.validate(schema, 15, path)).toEqual([]);

    // equal to min
    expect(Validator.validate(schema, 10)).toEqual([]);
    expect(Validator.validate(schema, 10, path)).toEqual([]);

    // less than min
    expect(Validator.validate(schema, 5)).toEqual([
      { message: 'The value should be greater than or equal to 10', path: '' },
    ]);
    expect(Validator.validate(schema, 5, path)).toEqual([
      { message: 'The value should be greater than or equal to 10', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'number' }, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate({ type: 'number' }, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'number' }, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'number' }, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'number' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'number' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'number' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'number' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'number' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'number' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'number' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'number' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be number', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaNumber = {
      nullable: false,
      required: true,
      type: 'number',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([]);
    expect(Validator.validate(schema, 1245, path)).toEqual([]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // buffer
    expect(Validator.validate(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);
  });
});
