export interface OptionsInterface {
  token: string;
  frequency: number;
  paramEncryption: (any) => any;
  userId?: number;
  defaultIntegrations?: any;
}
