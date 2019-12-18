export interface ApplicationInterface {
  init: void;
  app(req: any): any;
  use();
}
