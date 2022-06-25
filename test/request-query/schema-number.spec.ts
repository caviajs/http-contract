import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaNumber, ValidationError } from '../../src';
import * as schemaNumber from '../../src/schema-number';

const QUERY_NAME: string = 'id';
const QUERY_VALUE: number = 1245;
const QUERY_SCHEMA: SchemaNumber = { type: 'number' };
const PATH: string[] = ['request', 'query', QUERY_NAME];

describe('SchemaNumber', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to number and then call validateSchemaNumber', async () => {
    const validateSchemaNumberSpy = jest.spyOn(schemaNumber, 'validateSchemaNumber');

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

    expect(typeof query).toEqual('number');
    expect(query).toEqual(QUERY_VALUE);

    expect(validateSchemaNumberSpy).toHaveBeenNthCalledWith(1, QUERY_SCHEMA, QUERY_VALUE, PATH);
  });

  it('should return 400 if validateSchemaNumber return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaNumber, 'validateSchemaNumber')
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
