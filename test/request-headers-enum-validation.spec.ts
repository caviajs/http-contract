import { HttpRouter, RouteMetadata } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../src';

function createServer(routeMetadata: RouteMetadata): http.Server {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: () => undefined,
      metadata: routeMetadata,
      method: 'POST',
      path: '/',
    });

  return http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });
}

it('should validate the enum condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        headers: {
          'x-cavia': {
            enum: ['Hello', 'World'],
            nullable: false,
            required: true,
            type: 'enum',
          },
        },
      },
    },
  });

  // valid
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'Hello');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // valid
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'World');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // invalid
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'Foo');

    expect(response.body).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});

it('should validate the required condition correctly', async () => {
  // required: false (default)
  {
    const httpServer = createServer({
      contract: {
        request: {
          headers: {
            'x-cavia': {
              enum: ['Hello', 'World'],
              type: 'enum',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // required: false
  {
    const httpServer = createServer({
      contract: {
        request: {
          headers: {
            'x-cavia': {
              enum: ['Hello', 'World'],
              required: false,
              type: 'enum',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // required: true
  {
    const httpServer = createServer({
      contract: {
        request: {
          headers: {
            'x-cavia': {
              enum: ['Hello', 'World'],
              required: true,
              type: 'enum',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual([
      { message: 'The value is required', path: 'request.headers.x-cavia' },
      { message: 'The value must be one of the following values: Hello, World', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});
