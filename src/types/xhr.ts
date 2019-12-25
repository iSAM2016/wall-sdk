import { EventInterface, InfoInterface } from "./baseInfo";

export interface XhrInterface extends EventInterface {
  type: "BEHAVIORXHR" | "XHRERROR";
  info: InfoInterface;
}

export interface XhrInfoInterface extends InfoInterface {
  message: string;
  url?: string;
  method?: Function;
  status?: number;
  success?: boolean;
  duration?: number;
  statusText?: string;
  responseSize?: string;
  requestDate?: object;
}

export interface FetchInterface extends EventInterface {
  type: "BEHAVIORFETCH";
  info: {
    message: string;
    status: number;
    duration: number;
    url: string;
    method: string;
  };
}
