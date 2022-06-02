import { RoutePath, HttpRouter, Specification } from '@caviajs/http-router';

export function setupContractRoute(httpRouter: HttpRouter, path: RoutePath = '/meta/contract'): void {
  httpRouter.route({ handler: (): Specification => httpRouter.specification, method: 'GET', path: path });
}
