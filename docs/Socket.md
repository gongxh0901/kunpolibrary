## socket网络模块

* 目的抹平小游戏平台和原生平台的使用差异

  `各个小游戏平台都是自己封装的socket 和 浏览器标准的websocket在用法上有一定的差异`



#### 使用

```typescript
import { Socket } from "kunpocc";

// 创建一个连接
let url = "wss:xxxxxxxx"
let socket = new Socket(url, { binaryType: "arraybuffer" });

// 监听连接open事件
socket.onopen = () => {
		log("连接成功");
}

// 监听收到服务端的消息
socket.onmessage = (data: string | ArrayBuffer) => {
    log("收到消息", data);
}

// 监听连接关闭的事件
socket.onclose = (code: number, reason: string) => {
		log("连接关闭", code, reason);
    socket = null;
}

// 发送字符串消息
socket.send("发送给服务端的消息");

// 发送二进制数据 一般都是使用ProtoBuf，具体使用可参考Demo
socket.sendBuffer(buffer);

// 主动断开连接
socket.close(3001, "主动断开连接");
```



