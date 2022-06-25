import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaBoolean, ValidationError } from '../../src';
import * as schemaBoolean from '../../src/schema-boolean';

const DATASET: any[] = [
  ['true', true],
  ['false', false],
];
const PARAM_NAME: string = 'id';
const PARAM_SCHEMA: SchemaBoolean = { type: 'boolean' };
const PATH: string[] = ['request', 'params', PARAM_NAME];

describe('SchemaBoolean', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to boolean and then call validateSchemaBoolean', async () => {
    const validateSchemaBooleanSpy = jest.spyOn(schemaBoolean, 'validateSchemaBoolean');

    for (const [DATA_AS_STRING, DATA_AS_BOOLEAN] of DATASET) {
      let param: any;

      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: (request) => {
            param = request.params[PARAM_NAME];
          },
          metadata: {
            contract: {
              request: {
                params: {
                  [PARAM_NAME]: PARAM_SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/:id?',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      await supertest(httpServer)
        .post(`/${ DATA_AS_STRING }`);

      expect(typeof param).toEqual('boolean');
      expect(param).toEqual(DATA_AS_BOOLEAN);

      expect(validateSchemaBooleanSpy).toHaveBeenNthCalledWith(1, PARAM_SCHEMA, DATA_AS_BOOLEAN, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaBoolean return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaBoolean, 'validateSchemaBoolean')
      .mockImplementation(() => errors);

    for (const [DATA_AS_STRING] of DATASET) {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: () => undefined,
          metadata: {
            contract: {
              request: {
                params: {
                  [PARAM_NAME]: PARAM_SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/:id?',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const response = await supertest(httpServer)
        .post(`/${ DATA_AS_STRING }`);

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);

      jest.clearAllMocks();
    }
  });
});
