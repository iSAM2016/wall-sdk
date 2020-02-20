export interface OptionsInterface {
    project_id: number; // 项目id
    origin: string; // server 地址
    frequency: number;
    isTest?: boolean;
    uuid?: string; // 设别id
    userId?: string;
    defaultIntegrations?: any;
}
