import { EventInterface, InfoInterface } from './baseInfo';

export interface XhrInfoInterface extends EventInterface {
    type: 'BEHAVIORXHR' | 'XHRERROR';
    info: InfoInterface;
    url: string;
    method: Function;
    status: number;
    success?: boolean;
    duration?: number;
    statusText?: string;
    responseSize?: string;
    requestDate?: object;
}
