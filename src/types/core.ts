import {
  BaseInfoInterface,
  OptionsInterface,
  EngineInterface
} from "@app/types";

export interface ApplicationInterface {
  (): AppInterface;
}

export interface AppInterface {
  (event: BaseInfoInterface): void;
  options: OptionsInterface;
  routes: Array<MiddleOptionsInterface>;
  init(options: OptionsInterface): void;
  use(handler: MiddleHandlerInterface): void;
  listen(instance: Array<EngineInterface>): void;
  createCustomEvent(message: Object): void; // 自定义错误
}
export interface MiddleOptionsInterface {
  method: string;
  pathname: string;
  handler: MiddleHandlerInterface;
}

export interface MiddleHandlerInterface {
  (event: BaseInfoInterface, next: NextInterface, error?: string): void;
}
export interface NextInterface {
  (error?: string): void;
}

export interface NodeInterface {
  next: null | Object;
  key: string;
}
