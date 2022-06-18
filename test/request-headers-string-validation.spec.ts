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

it('should validate the expressions condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        headers: {
          'x-cavia': {
            expressions: [
              /^[A-Z]/,
              /[A-Z]$/,
            ],
            type: 'string',
          },
        },
      },
    },
  });

  // valid
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'FoO');

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
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }

  // invalid
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'foo');

    expect(response.body).toEqual([
      { message: 'The value should match a regular expression /^[A-Z]/', path: 'request.headers.x-cavia' },
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});

it('should validate the maxLength condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        headers: {
          'x-cavia': {
            maxLength: 10,
            type: 'string',
          },
        },
      },
    },
  });

  // longer than maxLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'HelloHelloHello');

    expect(response.body).toEqual([
      { message: 'The value must be shorter than or equal to 10 characters', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }

  // equal to maxLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'HelloHello');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // shorter than maxLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'Hello');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }
});

it('should validate the minLength condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        headers: {
          'x-cavia': {
            minLength: 10,
            type: 'string',
          },
        },
      },
    },
  });

  // longer than minLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'HelloHelloHello');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // equal to minLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'HelloHello');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // shorter than minLength
  {
    const response = await supertest(httpServer)
      .post('/')
      .set('X-Cavia', 'Hello');

    expect(response.body).toEqual([
      { message: 'The value must be longer than or equal to 10 characters', path: 'request.headers.x-cavia' },
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
              type: 'string',
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
              required: false,
              type: 'string',
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
              required: true,
              type: 'string',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual([
      { message: 'The value is required', path: 'request.headers.x-cavia' },
      { message: 'The value should be string', path: 'request.headers.x-cavia' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});
