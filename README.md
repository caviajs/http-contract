<div align="center">
<h3>@caviajs/http-contract</h3>
<p>a micro framework for node.js</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-contract @caviajs/http-client @caviajs/http-exception @caviajs/http-router --save
```

<div align="center">
<h4>Setup contract interceptor</h4>
<div><span>The contract is responsible for parsing, coercion and validation the payload of the request.</span></div>
</div>

```typescript
import { HttpContract } from '@caviajs/http-contract';
import { Interceptor } from '@caviajs/http-router';

export const HttpContractInterceptor: Interceptor = HttpContract.setup();
```

```typescript
// ...
httpRouter
  .intercept(HttpContractInterceptor);
// ...
```

<div align="center">
<h4>Setup contract route</h4>
<span>The contract route is needed to provide the specification on the basis of which the contract will be generated.</span>
</div>

```typescript
// ...
httpRouter
  .route({
    handler: () => httpRouter.specification,
    method: 'GET',
    path: '/meta/contract',
  });
// ...
```

<div align="center">
<h4>Setup contract schema in routes</h4>
</div>

```typescript
// ...
httpRouter
  .route({
    handler: (request, response) => {
      // request.body
      // request.headers
      // request.params
      // request.query

      // ...
    },
    metadata: {
      name: 'createGuineaPig',
      request: {
        body: {
          contentSchema: {
            type: 'string',
          },
          contentType: 'text/plain',
        },
        headers: { /* ... */ },
        params: { /* ... */ },
        query: { /* ... */ },
      },
      responses: {
        201: {
          body: {
            contentSchema: {
              type: 'string',
            },
            contentType: 'text/plain',
          },
          headers: { /* ... */ },
        },
      },
    },
    method: 'POST',
    path: '/guinea-pigs',
  });
// ...
```

<div align="center">
<h4>Generate a contract based on specification</h4>
</div>

```shell
generate-contract --url http://localhost:3000/meta/contract --output src/contracts/foo
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
