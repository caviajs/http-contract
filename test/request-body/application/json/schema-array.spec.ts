import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../../../src';

it('should convert request stream to array', async () => {
  let body: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (request) => {
        body = request.body;
      },
      metadata: {
        contract: {
          request: {
            body: {
              'application/json': { type: 'array' },
            },
          }
        }
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('[1,2,4,5]');

  expect(Array.isArray(body)).toEqual(true);
  expect(body).toEqual([1, 2, 4, 5]);
});