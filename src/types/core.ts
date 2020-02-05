import { EventInterface, OptionsInterface, EngineInterface } from '../types';

export interface ApplicationInterface {
    (): AppInterface;
}

export interface AppInterface {
    (event: EventInterface): void;
    options: OptionsInterface;
    routes: Array<MiddleOptionsInterface>;
    init(options: OptionsInterface): void;
    use(handler: MiddleHandlerInterface): void;
    listen(instance: Array<EngineInterface>): void;
    createCustomErrorEvent(message: string, content: Object): void; // 自定义错误
    createCustomBehaviorEvent(
        behaviorType: string,
        behaviorResult: object,
        message: string
    );
}
export interface MiddleOptionsInterface {
    method: string;
    pathname: string;
    handler: MiddleHandlerInterface;
}

export interface MiddleHandlerInterface {
    (event: EventInterface, next: NextInterface, error?: string): void;
}
export interface NextInterface {
    (error?: string): void;
}

export interface NodeInterface {
    next: null | Object;
    key: string;
}
