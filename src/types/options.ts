export interface OptionsInterface {
    token: string;
    origin: string; // server 地址
    frequency: number;
    isTest?: boolean;
    userId?: string;
    defaultIntegrations?: any;
}
