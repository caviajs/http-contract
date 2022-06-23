import { HttpRouter } from '@caviajs/http-router';
import { HttpContract } from '../../src';
import http from 'http';
import supertest from 'supertest';

it('should convert boolean string to a boolean ("true")', async () => {
  let included: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (req) => {
        included = req.params.included;
      },
      metadata: {
        contract: {
          request: {
            params: {
              included: {
                type: 'boolean',
              },
            },
          },
        },
      },
      method: 'POST',
      path: '/:included',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .post('/true');

  expect(included).toEqual(true);
  expect(typeof included).toBe('boolean');
});

it('should convert boolean string to a boolean ("false")', async () => {
  let included: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (req) => {
        included = req.params.included;
      },
      metadata: {
        contract: {
          request: {
            params: {
              included: {
                type: 'boolean',
              },
            },
          },
        },
      },
      method: 'POST',
      path: '/:included',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const res = await supertest(httpServer)
    .post('/false');

  expect(included).toEqual(false);
  expect(typeof included).toBe('boolean');
});
