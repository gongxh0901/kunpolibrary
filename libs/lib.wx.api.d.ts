/**
 * @Author: Gongxh
 * @Date: 2025-03-28
 * @Description: 
 */

declare namespace WechatMiniprogram {
    type IAnyObject = Record<string, any>

    interface ICommonCallBack {
        /**
         * 接口调用成功的回调函数
         */
        success?: () => void;

        /**
         * 接口调用失败的回调函数
         */
        fail?: () => void;

        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: () => void;
    }

    interface ConnectSocketOption extends ICommonCallBack {
        /** 开发者服务器 wss 接口地址 */
        url: string

        /** HTTP Header，Header 中不能设置 Referer */
        header?: IAnyObject

        /** 
         * 需要基础库: '1.4.0'
         * 子协议数组 
         */
        protocols?: string[]

        /** 
         * 需要基础库: '2.4.0'
         * 建立 TCP 连接的时候的 TCP_NODELAY 设置
         */
        tcpNoDelay?: boolean

        /** 
         * 需要基础库: '2.8.0'
         * 是否开启压缩扩展
         */
        perMessageDeflate?: boolean

        /** 
         * 需要基础库: '2.10.0'
         * 超时时间，单位为毫秒
         */
        timeout?: number

        /** 
         * 需要基础库: '2.29.0'
         * 强制使用蜂窝网络发送请求
         */
        forceCellularNetwork?: boolean
    }

    /** 
     * 需要基础库： `2.10.4`
     * 网络请求过程中一些调试信息 
     */
    interface SocketProfile {
        /** 组件准备好使用 SOCKET 建立请求的时间，这发生在检查本地缓存之前 */
        fetchStart: number;
        /** DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等 */
        domainLookupStart: number;
        /** DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等 */
        domainLookupEnd: number;
        /** 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间 */
        connectStart: number;
        /** 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间。注意这里握手结束，包括安全连接建立完成、SOCKS 授权通过 */
        connectEnd: number;
        /** 单次连接的耗时，包括 connect ，tls */
        rtt: number;
        /** 握手耗时 */
        handshakeCost: number;
        /** 上层请求到返回的耗时 */
        cost: number;
    }

    interface SocketSendOption extends ICommonCallBack {
        /** 需要发送的消息 */
        data: string | ArrayBuffer;
    }
    interface SocketCloseOption extends ICommonCallBack {
        /** 
         * 1000（表示正常关闭连接）
         * 关闭代码
         */
        code?: number;
        /** 
         * 关闭原因
         * 这个字符串必须是不长于 123 字节的 UTF-8 文本
         */
        reason?: string;
    }

    interface SocketTask {
        /**
         * 发送消息
         * @param data 需要发送的消息
         */
        send(res: SocketSendOption): void

        /**
         * 关闭 WebSocket 连接
         * @param code 关闭代码
         * @param reason 关闭原因
         */
        close(res: SocketCloseOption): void

        /**
         * 监听 WebSocket 连接打开事件
         * @param listener 
         */
        onOpen(listener: (res: { header: IAnyObject, profile: SocketProfile }) => void): void

        /**
         * 监听 WebSocket 接收到消息事件
         * @param listener 
         * @param res.data 服务器返回的消息
         */
        onMessage(listener: (res: { data: string | ArrayBuffer }) => void): void

        /**
         * 监听 WebSocket 错误事件
         * @param listener 
         * @param res.errMsg 错误信息
         */
        onError(listener: (res: { errMsg: string }) => void): void

        /**
         * 监听 WebSocket 关闭事件
         * @param listener 
         * @param res.code 关闭代码
         * @param res.reason 关闭原因
         */
        onClose(listener: (res: { code: number, reason: string }) => void): void
    }

    interface Wx {
        connectSocket(option: ConnectSocketOption): SocketTask
    }
}

declare const wx: WechatMiniprogram.Wx