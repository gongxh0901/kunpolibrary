import * as $protobuf from "protobufjs";
import Long = require("long");
export namespace com {

    namespace kunpo {

        namespace proto {

            interface ICommonMessage {
                cmdCode?: (number|null);
                protocolId?: (number|null);
                data?: (Uint8Array|null);
                responseStatus?: (number|null);
                msg?: (string|null);
                msgId?: (number|null);
            }

            class CommonMessage implements ICommonMessage {
                constructor(p?: com.kunpo.proto.ICommonMessage);
                public cmdCode: number;
                public protocolId: number;
                public data: Uint8Array;
                public responseStatus: number;
                public msg: string;
                public msgId: number;
                public static encode(m: com.kunpo.proto.ICommonMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): com.kunpo.proto.CommonMessage;
            }

            namespace test {

                interface IUserInfo {
                    userId?: (number|null);
                    userName?: (string|null);
                    nickName?: (string|null);
                    level?: (number|null);
                    createTime?: (number|null);
                }

                class UserInfo implements IUserInfo {
                    constructor(p?: com.kunpo.proto.test.IUserInfo);
                    public userId: number;
                    public userName: string;
                    public nickName: string;
                    public level: number;
                    public createTime: number;
                    public static encode(m: com.kunpo.proto.test.IUserInfo, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): com.kunpo.proto.test.UserInfo;
                }
            }
        }
    }
}
