import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaBoolean, ValidationError } from '../../src';
import * as schemaBoolean from '../../src/schema-boolean';

const QUERY_NAME: string = 'id';
const QUERY_VALUES: any[] = [
  ['true', true],
  ['false', false],
];
const QUERY_SCHEMA: SchemaBoolean = { type: 'boolean' };
const PATH: string[] = ['request', 'query', QUERY_NAME];

describe('SchemaBoolean', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to boolean and then call validateSchemaBoolean', async () => {
    const validateSchemaBooleanSpy = jest.spyOn(schemaBoolean, 'validateSchemaBoolean');

    for (const [QUERY_VALUE_AS_STRING, QUERY_VALUE_AS_BOOLEAN] of QUERY_VALUES) {
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
        .query({ [QUERY_NAME]: QUERY_VALUE_AS_STRING });

      expect(typeof query).toEqual('boolean');
      expect(query).toEqual(QUERY_VALUE_AS_BOOLEAN);

      expect(validateSchemaBooleanSpy).toHaveBeenNthCalledWith(1, QUERY_SCHEMA, QUERY_VALUE_AS_BOOLEAN, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaBoolean return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaBoolean, 'validateSchemaBoolean')
      .mockImplementation(() => errors);

    for (const [QUERY_VALUE_AS_STRING] of QUERY_VALUES) {
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
        .query({ [QUERY_NAME]: QUERY_VALUE_AS_STRING });

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);

      jest.clearAllMocks();
    }
  });
});
