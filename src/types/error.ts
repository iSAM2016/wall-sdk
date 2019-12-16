export interface errorInterface {
  content?: string;
  errorMessage?: string;
  scriptURI?: string;
  lineNumber?: number;
  columnNumber?: number;
  errorObj?: any;
  col?: number;
  row?: number;
  name?: string;
  message?: string;
  _errorMessage?: string | Event; // 标准信息
  _scriptURI?: string | Event;
  _lineNumber?: number | Event;
  _columnNumber?: number | Event;
  type?: string;
  resourceUrl?: string;
}
