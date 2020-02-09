export interface OptionsInterface {
    token: string;
    origin: string; // server 地址
    frequency: number;
    isTest?: boolean;
    uuid?: string; // 设别id
    userId?: string;
    defaultIntegrations?: any;
}
