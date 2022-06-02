import { SchemaBuffer, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaBuffer', () => {
  it('should validate the maxLength condition correctly', () => {
    const schema: SchemaBuffer = {
      maxLength: 10,
      type: 'buffer',
    };

    // greater than maxLength
    expect(Validator.validate(schema, Buffer.from('HelloHelloHello'))).toEqual([
      { message: 'The value size should be less than or equal to 10', path: '' },
    ]);
    expect(Validator.validate(schema, Buffer.from('HelloHelloHello'), path)).toEqual([
      { message: 'The value size should be less than or equal to 10', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(Validator.validate(schema, Buffer.from('HelloHello'))).toEqual([]);
    expect(Validator.validate(schema, Buffer.from('HelloHello'), path)).toEqual([]);

    // less than maxLength
    expect(Validator.validate(schema, Buffer.from('Hello'))).toEqual([]);
    expect(Validator.validate(schema, Buffer.from('Hello'), path)).toEqual([]);
  });

  it('should validate the minLength condition correctly', () => {
    const schema: SchemaBuffer = {
      minLength: 10,
      type: 'buffer',
    };

    // greater than minLength
    expect(Validator.validate(schema, Buffer.from('HelloHelloHello'))).toEqual([]);
    expect(Validator.validate(schema, Buffer.from('HelloHelloHello'), path)).toEqual([]);

    // equal to minLength
    expect(Validator.validate(schema, Buffer.from('HelloHello'))).toEqual([]);
    expect(Validator.validate(schema, Buffer.from('HelloHello'), path)).toEqual([]);

    // less than minLength
    expect(Validator.validate(schema, Buffer.from('Hello'))).toEqual([
      { message: 'The value size should be greater than or equal to 10', path: '' },
    ]);
    expect(Validator.validate(schema, Buffer.from('Hello'), path)).toEqual([
      { message: 'The value size should be greater than or equal to 10', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'buffer' }, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate({ type: 'buffer' }, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'buffer' }, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'buffer' }, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'buffer' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'buffer' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'buffer' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'buffer' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'buffer' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'buffer' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'buffer' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'buffer' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaBuffer = {
      nullable: false,
      required: true,
      type: 'buffer',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // buffer
    expect(Validator.validate(schema, Buffer.from('Hello World'))).toEqual([]);
    expect(Validator.validate(schema, Buffer.from('Hello World'), path)).toEqual([]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);
  });
});
