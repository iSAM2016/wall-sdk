export interface OptionsInterface {
  token: string;
  origin: string; // server 地址
  frequency: number;
  paramEncryption: (any) => any;
  userId?: string;
  defaultIntegrations?: any;
}
