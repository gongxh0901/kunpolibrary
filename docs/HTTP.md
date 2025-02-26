## Http模块 

### 特点
  - 封装 XMLHttpRequest
  - 完整的请求响应接口
  - 独立使用简单，一行代码发送一个请求
  - 大型项目，管理简单

### 使用

```typescript
import { HttpManager, IHttpEvent, HttpResponseType } from 'kunpocc';

// 1. 使用回调方式处理响应
const event: IHttpEvent = {
    name: "login",
    onComplete: (response) => {
        console.log('请求成功:', response.data);
    },
    onError: (response) => {
        console.log('请求失败:', response.error);
    }
};

// POST 请求
HttpManager.post(
    "https://api.example.com/login",
    { username: "test", password: "123456" },
    "json",  // 响应类型：'json' | 'text' | 'arraybuffer'
    event,
    ["Content-Type", "application/json"],  // 请求头
    5  // 超时时间（秒）
);

// GET 请求
HttpManager.get(
    "https://api.example.com/users",
    { id: 1 },
    "json",
    event
);

// 2. 使用全局事件方式处理响应
GlobalEvent.add(HttpManager.HttpEvent, (result, response) => {
    if (result === "succeed") {
        console.log('请求成功:', response.data);
    } else {
        console.log('请求失败:', response.error);
    }
}, this);

// 发送请求（不传入 event 参数）
HttpManager.post("https://api.example.com/data", { /* data */ });
```

#### *请求方法*
- `post(url, data, responseType?, event?, headers?, timeout?)`
- `get(url, data, responseType?, event?, headers?, timeout?)`
- `put(url, data, responseType?, event?, headers?, timeout?)`
- `head(url, data, responseType?, event?, headers?, timeout?)`

#### *参数说明*
- `url`: 请求地址
- `data`: 请求数据
- `responseType`: 响应类型（可选，默认 'json'）
  - `'json'`: JSON 格式
  - `'text'`: 文本格式
  - `'arraybuffer'`: 二进制数据
- `event`: 请求事件回调（可选）
- `headers`: 请求头（可选）
- `timeout`: 超时时间，单位秒（可选，0表示不超时）

#### *响应处理*
1. 回调方式（通过 IHttpEvent）：
```typescript
const event: IHttpEvent = {
    name: "自定义名称",
    data?: "自定义数据",  // 可选
    onComplete: (response) => {
        // 成功回调
    },
    onError: (response) => {
        // 失败回调
    }
};
```

2. 全局事件方式：
```typescript
GlobalEvent.add(HttpManager.HttpEvent, (result, response) => {
    // result: "succeed" | "fail"
    // response: IHttpResponse
}, this);
```
