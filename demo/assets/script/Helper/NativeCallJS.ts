/**
 * @Author: Gongxh
 * @Date: 2025-03-22
 * @Description: 
 */

function KunpoNativeCallJsHandler(jsonString: string) {
    console.log("KunpoNativeCallJsHandler", jsonString);
    // let json = JSON.parse(jsonString);
    // let functionName = json.function;
    // let args = json.args;
    // let func = _global[functionName];
    // if (func) {
    //     func(...args);
    // }
}


let _global = globalThis || window || global;
(_global as any)["KunpoNativeCallJsHandler"] = KunpoNativeCallJsHandler;