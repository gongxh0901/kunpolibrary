/**
 * @Author: Gongxh
 * @Date: 2025-04-11
 * @Description: 微信广告
 */

import { warn } from "../../kunpocc";
import { MiniErrorCode } from "../header";
import { IMiniRewardAds } from "../interface/IMiniAds";

export class WechatAds implements IMiniRewardAds {
    private _adUnitId: string = "";
    private _video_ad: WechatMiniprogram.RewardedVideoAd = null;

    /**
     * 广告成功回调
     */
    private _success: () => void;
    /**
     * 广告失败回调
     */
    private _fail: (errCode: number, errMsg: string) => void;

    public init(adUnitId: string): void {
        this._adUnitId = adUnitId;
    }

    /**
     * 显示广告
     */
    public showAds(res: { success: () => void, fail: (errCode: number, errMsg: string) => void }): void {
        if (this._adUnitId === "") {
            warn(MiniErrorCode.AD_NOT_INIT.msg);
            res.fail(MiniErrorCode.AD_NOT_INIT.code, MiniErrorCode.AD_NOT_INIT.msg);
            return;
        }
        this._success = res.success;
        this._fail = res.fail;

        if (!this._video_ad) {
            this._video_ad = this.createVideoAd();
        }
        this._video_ad.load().then(() => {
            this._video_ad.show();
        }).catch((res: { errMsg: string; errNo: number }) => {
            warn(`广告加载失败 errCode:${res.errNo} errMsg:${res.errMsg}`);
            this._fail(res.errNo, res.errMsg);
            this.reset();
        });
    }

    private createVideoAd(): WechatMiniprogram.RewardedVideoAd {
        let videoAd = wx.createRewardedVideoAd({ adUnitId: this._adUnitId });
        /** 激励视频错误事件的监听函数 */
        videoAd.onError((res: WechatMiniprogram.RewardedVideoAdOnErrorListenerResult) => {
            warn(`激励视频广告 onError:${res.errCode}:${res.errMsg}`);
            this._fail(res.errCode, res.errMsg);
            this.reset();
        });
        videoAd.onClose((res: WechatMiniprogram.RewardedVideoAdOnCloseListenerResult) => {
            if ((res && res.isEnded) || res === undefined) {
                /** 广告播放完成 */
                this?._success();
            } else {
                /** 中途退出，不发放奖励 */
                this?._fail(MiniErrorCode.AD_EXIT.code, MiniErrorCode.AD_EXIT.msg);
            }
            this.reset();
        });
        return videoAd;
    }

    /** 防止多次回调 */
    private reset(): void {
        this._success = null;
        this._fail = null;
    }
}