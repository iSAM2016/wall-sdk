var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Application from './core/wall';
import TryCatch from './integrations/trycatch';
import Behavior from './integrations/behavior';
import Resources from './integrations/resources';
import ListNode from './util/linknode';
import Xhr from './integrations/xhr';
import { auxiliaryInfo, frequency } from './middle';
import * as localForage from 'localforage';
import { debugLogger } from './util';
var wall = Application();
var listnode = new ListNode();
// 添加时间和key和UA(等辅助信息)
wall.use(auxiliaryInfo);
// 对所有的ERROR设置上报频率
wall.use(frequency);
//debugLogger->event
wall.use(function (event, next) {
    debugLogger(event);
    next();
});
//对所有ERROR BEHAVIORC 数据记录
// wall.use(async (event, next) => {
//     if (event.type.includes('BEHAVIOR') || event.type.includes('ERROR')) {
//         await createHead(listnode);
//         let head = await setLocalEvent(event, listnode);
//         await updateEventIds(head as NodeInterface);
//         next();
//     }
//     next();
// });
// 对当前event有upload属性并且为true的 取出历史前四条立即上报
wall.use(function (event, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, resultEvent;
    return __generator(this, function (_a) {
        if (!event.options.isTest) {
            ids = listnode.getFiveNodeKeys();
            resultEvent = ids.reduce(function (mome, id) {
                mome.push(localForage.getItem(id));
                return mome;
            }, []);
            Promise.all(resultEvent)
                .then(function (result) {
                return new Promise(function (resolve, reject) {
                    var reportUrl = wall.options.origin;
                    var img = new Image();
                    img.onload = function () {
                        resolve(result);
                    };
                    img.onerror = function (e) {
                        reject(e);
                    };
                    img.src = event.options.origin + "/data.gif?d=" + encodeURIComponent(JSON.stringify(event));
                });
            })
                .then(function (result) {
                next(); //TODO: 根据业务划分 是否TODO
            })
                .catch(function (err) {
                // 图片加载错误
                // console.log(err);
            });
        }
        else {
            next();
        }
        return [2 /*return*/];
    });
}); });
// 顺序不能更该
wall.listen([
    new TryCatch(wall),
    new Xhr(wall),
    new Behavior(wall),
    new Resources(wall)
]);
window.WALL = wall;
export default wall;
//# sourceMappingURL=index.js.map