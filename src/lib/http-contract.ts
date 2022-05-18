import { RoutePath, HttpRouter, Specification } from '@caviajs/http-router';

export class HttpContract {
  public static setup(path: RoutePath, httpRouter: HttpRouter): void {
    httpRouter.route({ handler: (): Specification => httpRouter.specification, method: 'GET', path: path });
  }
}
