/**
 * @Author: Gongxh
 * @Date: 2024-08-06
 * @Description:
 */

import { protocol } from "../header";
import { com } from "./proto/proto";

export interface ProtocolFormat {
    request: number;
    response: number;
    desc: string;
}

export class ProtoInfos {
    public encodeData<T>(protoCode: number, data: string): ArrayBuffer {
        return protocol.CommonMessage.encode({ cmdCode: 0, protocolId: protoCode, responseStatus: 1, msgId: 1, msg: data }).finish();
    }

    /** 前四个字节是长度信息 */
    public decodeData(buffer: Uint8Array | ArrayBufferLike): com.kunpo.proto.CommonMessage {
        let response_buffer = new Uint8Array(buffer);
        return protocol.CommonMessage.decode(response_buffer);
    }
}