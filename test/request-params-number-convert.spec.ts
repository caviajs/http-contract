import { HttpRouter } from '@caviajs/http-router';
import { HttpContract } from '../src';
import http from 'http';
import supertest from 'supertest';

it('should convert number string to number', async () => {
  let age: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (req) => {
        age = req.params.age;
      },
      metadata: {
        contract: {
          request: {
            params: {
              age: {
                type: 'number',
              },
            },
          },
        },
      },
      method: 'POST',
      path: '/:age',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .post('/1245');

  expect(age).toEqual(1245);
  expect(typeof age).toBe('number');
});
