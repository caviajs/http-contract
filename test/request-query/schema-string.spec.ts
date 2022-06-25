import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaString, ValidationError } from '../../src';
import * as schemaString from '../../src/schema-string';

const QUERY_NAME: string = 'id';
const QUERY_VALUE: string = 'hello';
const QUERY_SCHEMA: SchemaString = { type: 'string' };
const PATH: string[] = ['request', 'query', QUERY_NAME];

describe('SchemaString', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaString', async () => {
    const validateSchemaStringSpy = jest.spyOn(schemaString, 'validateSchemaString');

    let query: any;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          query = request.query[QUERY_NAME];
        },
        metadata: {
          contract: {
            request: {
              query: {
                [QUERY_NAME]: QUERY_SCHEMA,
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
      .post(`/`)
      .query({ [QUERY_NAME]: QUERY_VALUE });

    expect(typeof query).toEqual('string');
    expect(query).toEqual(QUERY_VALUE);

    expect(validateSchemaStringSpy).toHaveBeenNthCalledWith(1, QUERY_SCHEMA, QUERY_VALUE, PATH);
  });

  it('should return 400 if validateSchemaString return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaString, 'validateSchemaString')
      .mockImplementation(() => errors);

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: () => undefined,
        metadata: {
          contract: {
            request: {
              query: {
                [QUERY_NAME]: QUERY_SCHEMA,
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
      .post(`/`)
      .query({ [QUERY_NAME]: QUERY_VALUE });

    expect(response.body).toEqual(errors);
    expect(response.statusCode).toEqual(400);
  });
});
