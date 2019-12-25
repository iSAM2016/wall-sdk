import { InfoInterface } from './baseInfo';

// 自定义错误
export interface CustomErrorInterface extends InfoInterface {
    message: string;
    content: Object;
}
//PromiseError
export interface PromiseErrorInterface extends InfoInterface {
    message: string;
    content: string;
}
// 静态资源错误
export interface SourceErrorInterface extends InfoInterface {
    message: string;
    typeName: string; // 标签内容
    sourceUrl: string; // 静态资源路径
}
