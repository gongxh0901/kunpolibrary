/**
 * @Author: Gongxh
 * @Date: 2025-04-12
 * @Description: 
 */


import { fgui, kunpo } from "../../header";
const { uiclass, uiprop, uiclick } = kunpo._uidecorator;

let IsInitAds = false;
let AdId = "";

let IsInitPay = false;

// private static readonly wechat_ads_id: string = "adunit-c9b71a32c0fb3d3d";
// private static readonly byte_ads_id: string = "592b3kadh11b27p317";
// private static readonly aliy_ads_id: string = "ad_tiny_2021004170666283_202410082200196957";

@uiclass("Window", "MiniGame", "MiniGameWindow")
export class MiniGameWindow extends kunpo.Window {
    @uiprop btn_close: fgui.GButton;
    @uiprop lab_adid: fgui.GTextInput;
    @uiprop lab_payQuantity: fgui.GTextInput;

    protected onInit(): void {
        this.adapterType = kunpo.AdapterType.Bang;
        this.type = kunpo.WindowType.HideAll;
    }

    protected onShow(userdata?: any): void {
        kunpo.log("MiniGameWindow onShow:", userdata);
        this.lab_adid.text = "592b3kadh11b27p317";

        if (IsInitAds) {
            this.lab_adid.text = AdId;
            this.lab_adid.touchable = false;
        }
    }

    protected onClose(): void {
        kunpo.log("CloseAllWindow onClose");
    }

    @uiclick
    private onClickBtnClose(): void {
        kunpo.WindowManager.closeWindow(this.name);
    }

    @uiclick
    private onClickBtnInitAds(): void {
        if (!IsInitAds) {
            if (this.lab_adid.text) {
                kunpo.MiniHelper.ad().init(this.lab_adid.text);
                IsInitAds = true;

                kunpo.MiniHelper.ad().showAds({
                    success: () => {
                        kunpo.log("广告显示成功");
                    },
                    fail: (errCode, errMsg) => {
                        kunpo.log("广告显示失败", errCode, errMsg);
                    }
                });
            }
        } else {
            kunpo.MiniHelper.ad().showAds({
                success: () => {
                    kunpo.log("广告显示成功");
                },
                fail: (errCode, errMsg) => {
                    kunpo.log("广告显示失败", errCode, errMsg);
                }
            });
        }
    }
    @uiclick
    private onClickBtnPay(): void {
        if (!IsInitPay) {
            let payQuantity = parseInt(this.lab_payQuantity.text);
            if (isNaN(payQuantity) || payQuantity <= 0) {
                kunpo.log("请输入正确的值");
                return;
            } else {
                console.log("初始化支付", payQuantity);
                kunpo.MiniHelper.pay().init("1450135093", payQuantity);
                IsInitPay = true;
            }
            kunpo.MiniHelper.pay().pay({
                rmb: 1,
                orderId: `order_${kunpo.Time.now()}`,
                shopId: "1234",
                shopName: "测试商品",
                extraInfo: {
                    "test": "test"
                },
                success: () => {
                    kunpo.log("支付调用成功");
                },
                fail: (res) => {
                    kunpo.log("支付调用失败", res.errCode, res.errMsg);
                }
            });
        } else {
            kunpo.MiniHelper.pay().pay({
                rmb: 1,
                orderId: kunpo.Time.now() + "",
                shopId: "1234",
                shopName: "测试商品",
                extraInfo: {
                    "test": "test"
                },
                success: () => {
                    kunpo.log("支付调用成功");
                },
                fail: (res) => {
                    kunpo.log("支付调用失败", res.errCode, res.errMsg);
                }
            });
        }
    }
}