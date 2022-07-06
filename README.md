<div align="center">
<h3>@caviajs/http-contract</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

...

## Usage

### Installation

```shell
npm install @caviajs/http-contract @caviajs/http-client @caviajs/http-exception @caviajs/http-router --save
```

### Configure the interceptor

```typescript
import { HttpContract } from '@caviajs/http-contract';
import { Interceptor } from '@caviajs/http-router';

export const HttpContractInterceptor: Interceptor = HttpContract.setup();
```

### Bind the interceptor

```typescript
httpRouter
  .intercept(HttpContractInterceptor);
```

### Setup contract route

The contract route is needed to provide the specification on the basis of which the contract will be generated.

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

### Setup contract metadata in routes

```typescript
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
      contract: {
        // ...
      },
    },
    method: 'POST',
    path: '/guinea-pigs',
  });
```

##### metadata.contract.name

Name is the **unique** name of the router from which the CLI generates the HTTP client.

```typescript
httpRouter
  .route({
    // ...
    metadata: {
      contract: {
        name: 'createGuineaPig',
      },
    },
  });
```

##### metadata.contract.request.body

...

##### metadata.contract.request.headers

Type: `{ [name: string]: SchemaEnum | SchemaString }`

```typescript
httpRouter
  .route({
    // ...
    metadata: {
      contract: {
        request: {
          headers: {
            'x-example': {
              type: 'string'
            },
          }
        },
      },
    },
  });
```

##### metadata.contract.request.params

Type: `{ [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString }`

```typescript
httpRouter
  .route({
    // ...
    metadata: {
      contract: {
        request: {
          params: {
            example1: {
              type: 'boolean'
            },
            example2: {
              enum: ['foo', 'bar'],
              type: 'enum'
            },
            example3: {
              type: 'number'
            },
            example4: {
              type: 'string'
            },
          }
        },
      },
    },
  });
```

Enforces the value to be a valid string representation of a boolean. Following values are considered as valid booleans
and will be converted to true or false.

* 'true' converts to Boolean(true)
* 'false' converts to Boolean(false)

##### metadata.contract.request.query

Type: `{ [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString }`

...

##### metadata.contract.responses[status].body

##### metadata.contract.responses[status].headers

### Generate a contract based on specification

```shell
generate-contract --url http://localhost:3000/meta/contract --output src/contracts/foo
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
