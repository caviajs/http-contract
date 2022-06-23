import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../../../src';

it('should convert request stream to object', async () => {
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
              contentSchema: { type: 'object' },
              contentType: 'application/x-www-form-urlencoded',
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

  const res = await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('foo=bar&foz=baz');

  expect(typeof body).toEqual('object');
  expect(body).toEqual({ foo: 'bar', foz: 'baz' });
});
