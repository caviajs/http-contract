import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaEnum, ValidationError } from '../../src';
import * as schemaEnum from '../../src/schema-enum';

const HEADER_NAME: string = 'x-cavia';
const HEADER_VALUE: string = 'hello';
const HEADER_SCHEMA: SchemaEnum = { enum: ['hello', 'world'], type: 'enum' };
const PATH: string[] = ['request', 'headers', HEADER_NAME];

describe('SchemaEnum', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaEnum', async () => {
    const validateSchemaEnumSpy = jest.spyOn(schemaEnum, 'validateSchemaEnum');

    let header: any;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          header = request.headers[HEADER_NAME];
        },
        metadata: {
          contract: {
            request: {
              headers: {
                [HEADER_NAME]: HEADER_SCHEMA,
              },
            },
          },
        },
        method: 'POST',
        path: '/',
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    await supertest(httpServer)
      .post('/')
      .set(HEADER_NAME, HEADER_VALUE);

    expect(typeof header).toEqual('string');
    expect(header).toEqual(HEADER_VALUE);

    expect(validateSchemaEnumSpy).toHaveBeenNthCalledWith(1, HEADER_SCHEMA, HEADER_VALUE, PATH);
  });

  it('should return 400 if validateSchemaEnum return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaEnum, 'validateSchemaEnum')
      .mockImplementation(() => errors);

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: () => undefined,
        metadata: {
          contract: {
            request: {
              headers: {
                [HEADER_NAME]: HEADER_SCHEMA,
              },
            },
          },
        },
        method: 'POST',
        path: '/',
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .post('/')
      .set(HEADER_NAME, HEADER_VALUE);

    expect(response.body).toEqual(errors);
    expect(response.statusCode).toEqual(400);
  });
});
