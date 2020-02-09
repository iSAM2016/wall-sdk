import { InfoInterface } from './baseInfo';

export interface URLInfoInterface extends InfoInterface {
    message: string;
    oldURL: string;
    newURL: string;
    code: number; // 行为编号
}

export interface XpathInterface extends InfoInterface {
    message: string;
    xpath: string;
    inputValue: string;
    placeholder: string;
    className: string;
    code: number; // 行为编号
}
export interface CustomBehavior extends InfoInterface {
    message: string;
    behaviorType: string;
    behaviorResult: object;
    code: number; // 行为编号
}
