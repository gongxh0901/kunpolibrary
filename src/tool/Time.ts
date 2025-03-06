/**
 * @Author: Gongxh
 * @Date: 2025-03-06
 * @Description: 时间工具
 */

import { game } from "cc";
import { log } from "./log";

/** 时间对象缓存 */
let TimeCache: Date = null;

export class Time {
    /** 游戏系统启动时间戳 */
    private static _osBootTime: number = 0;

    /** 主动设置的网络时间 单位ms */
    private static _netTime: number = 0;

    /** 本地时间与网路时间的偏移量 单位ms */
    private static _netTimeDiff: number = 0;

    /** 获取当前毫秒时间戳 */
    private static _nowTimestamp: () => number;

    /** 获取游戏系统启动时间戳 */
    public static get osBootTime(): number { return this._osBootTime; }

    /** 获取主动设置的网络时间 单位ms */
    public static get netTime(): number { return this._netTime; }

    /** 获取本地时间与网路时间的偏移量 单位ms */
    public static get netTimeDiff(): number { return this._netTimeDiff; }

    /** 获取系统运行时间 */
    public static get runTime(): number { return game.totalTime };


    public static _configBoot(): void {
        this._osBootTime = Date.now();
        log("系统启动时间", this._osBootTime);
        TimeCache = new Date();
        this._nowTimestamp = (): number => {
            return this._osBootTime + this.runTime;
        }
    }

    /**
     * 设置网络时间, 单位ms
     * @param netTime 网络时间
     */
    public static setNetTime(netTime: number): void {
        if (netTime == 0) {
            return;
        }
        this._netTime = netTime;
        const localTime = this._nowTimestamp();
        this._netTimeDiff = this.netTime - localTime;
        log(`设置网络时间: net(${this.formatTime(this.netTime)}), boot(${this.formatTime(this.osBootTime)}), diff(${Math.abs(this.netTimeDiff / 1000)}秒)`);
    }

    /**
     * 获取当前时间 单位ms
     */
    public static now(): number {
        return this._nowTimestamp() + this.netTimeDiff;
    }

    /**
     * 将毫秒转换为秒
     * @param ms 毫秒
     */
    public static msTos(ms: number): number {
        return Math.floor((ms || 0) / 1000);
    }

    /**
     * 将秒转换为毫秒
     */
    public static sToMs(s: number): number {
        return (s || 0) * 1000;
    }

    /**
     * 获取时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间
     */
    public static getTime(timestamp?: number): { year: number, month: number, day: number, hour: number, minute: number, second: number } {
        TimeCache.setTime(timestamp || this.now());
        return {
            year: TimeCache.getFullYear(),
            month: TimeCache.getMonth() + 1,
            day: TimeCache.getDate(),
            hour: TimeCache.getHours(),
            minute: TimeCache.getMinutes(),
            second: TimeCache.getSeconds()
        };
    }

    /**
     * 获取年份
     * @param timestamp 时间戳 (ms)
     * @returns 年份
     */
    public static getYear(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getFullYear();
    }

    /**
     * 获取月份
     * @param timestamp 时间戳 (ms)
     * @returns 月份
     */
    public static getMonth(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getMonth() + 1;
    }

    /**
     * 获取日期
     * @param timestamp 时间戳 (ms)
     * @returns 日期
     */
    public static getDay(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getDate();
    }

    /**
     * 获取小时
     * @param timestamp 时间戳 (ms)
     * @returns 小时
     */
    public static getHour(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getHours();
    }

    /**
     * 获取分钟
     * @param timestamp 时间戳 (ms)
     * @returns 分钟
     */
    public static getMinute(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getMinutes();
    }

    /**
     * 获取秒
     * @param timestamp 时间戳 (ms)
     * @returns 秒
     */
    public static getSecond(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        return TimeCache.getSeconds();
    }

    /**
     * 获取当天开始时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getDayStartTime(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        TimeCache.setHours(0, 0, 0, 0);
        return TimeCache.getTime();
    }

    /** 
     * 获取当天的结束时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getDayEndTime(timestamp?: number): number {
        return this.getDayStartTime(timestamp) + 86400000;
    }

    /**
     * 获取传入时间是周几
     * @param {number} [time] (ms)
     * @returns {number}
     */
    public static getWeekDay(time?: number): number {
        TimeCache.setTime(time || Time.now());
        return TimeCache.getDay() || 7;
    }

    /**
     * 获取当前周的开始时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getWeekStartTime(timestamp?: number): number {
        return this.getDayStartTime(timestamp - this.getWeekDay(timestamp) * 86400000);
    }

    public static getWeekEndTime(timestamp?: number): number {
        return this.getWeekStartTime(timestamp) + 86400000 * 7;
    }

    /**
     * 获取当前月开始时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getMonthStartTime(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        TimeCache.setDate(1);
        TimeCache.setHours(0, 0, 0, 0);
        return TimeCache.getTime();
    }

    /**
     * 获取当前月结束时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getMonthEndTime(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        TimeCache.setDate(1);
        TimeCache.setHours(0, 0, 0, 0);
        TimeCache.setMonth(TimeCache.getMonth() + 1);
        return TimeCache.getTime();
    }

    /**
     * 获取当前年份开始时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getYearStartTime(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        TimeCache.setMonth(0);
        TimeCache.setDate(1);
        TimeCache.setHours(0, 0, 0, 0);
        return TimeCache.getTime();
    }

    /**
     * 获取当前年份结束时间
     * @param timestamp 时间戳 (ms)
     * @returns 时间戳 (ms)
     */
    public static getYearEndTime(timestamp?: number): number {
        TimeCache.setTime(timestamp || this.now());
        TimeCache.setMonth(0);
        TimeCache.setDate(1);
        TimeCache.setHours(0, 0, 0, 0);
        TimeCache.setFullYear(TimeCache.getFullYear() + 1);
        return TimeCache.getTime();
    }

    /**
     * 获取当前月的天数
     * @param timestamp 时间戳 (ms)
     * @returns 天数
     */
    public static getMonthDays(timestamp?: number): number {
        const monthEndTime = this.getMonthEndTime(timestamp);
        const monthStartTime = this.getMonthStartTime(timestamp);
        return Math.round((monthEndTime - monthStartTime) / 86400000);
    }

    /** 
     * 是否是同一天
     * @param timestamp1 时间戳1 (ms)
     * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
     * @returns 是否是同一天
     */
    public static isSameDay(timestamp1: number, now?: number): boolean {
        now = now || this.now();
        if (now - timestamp1 > 86400000) {
            return false;
        }
        return this.getDayStartTime(timestamp1) === this.getDayStartTime(now);
    }

    /** 
     * 是否是同一周
     * @param timestamp1 时间戳1 (ms)
     * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
     * @returns 是否是同一周
     */
    public static isSameWeek(timestamp1: number, now?: number): boolean {
        now = now || this.now();
        if (now - timestamp1 > 86400000 * 7) {
            return false;
        }
        return this.getWeekStartTime(timestamp1) === this.getWeekStartTime(now);
    }

    /** 
     * 是否是同一月
     * @param timestamp1 时间戳1 (ms)
     * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
     * @returns 是否是同一月
     */
    public static isSameMonth(timestamp1: number, now?: number): boolean {
        now = now || this.now();
        TimeCache.setTime(timestamp1);
        const month1 = TimeCache.getMonth();
        const year1 = TimeCache.getFullYear();
        TimeCache.setTime(now);
        const month2 = TimeCache.getMonth();
        const year2 = TimeCache.getFullYear();
        return month1 === month2 && year1 === year2;
    }

    /**
     * 是否是同一年
     * @param timestamp1 时间戳1 (ms)
     * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
     * @returns 是否是同一年
     */
    public static isSameYear(timestamp1: number, now?: number): boolean {
        now = now || this.now();
        // 直接比较年份，避免使用天数计算可能出现的边界错误
        TimeCache.setTime(timestamp1);
        const year1 = TimeCache.getFullYear();
        TimeCache.setTime(now);
        const year2 = TimeCache.getFullYear();
        return year1 === year2;
    }

    /**
     * 格式化时间 格式: xxxx-xx-xx HH:MM:SS
     * @param timestamp 时间戳 (ms)
     */
    public static formatTime(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}-${TimeCache.getMonth() + 1}-${TimeCache.getDate()} ${TimeCache.getHours()}:${TimeCache.getMinutes()}:${TimeCache.getSeconds()}`;
    }

    /**
     * 格式化时间 格式: xxxx年xx月xx日 HH:MM:SS
     * @param timestamp 时间戳 (ms)
     */
    public static formatTimeChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}年${TimeCache.getMonth() + 1}月${TimeCache.getDate()}日 ${TimeCache.getHours()}:${TimeCache.getMinutes()}:${TimeCache.getSeconds()}`;
    }

    /**
     * 格式化时间 格式: xxxx-xx-xx hh:mm
     * @param timestamp 时间戳 (ms)
     */
    public static formatYMDHM(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}-${TimeCache.getMonth() + 1}-${TimeCache.getDate()} ${TimeCache.getHours()}:${TimeCache.getMinutes()}`;
    }

    /**
     * 格式化时间 格式: xxxx年xx月xx日 h时m分
     * @param timestamp 时间戳 (ms)
     */
    public static formatYMDHMChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}年${TimeCache.getMonth() + 1}月${TimeCache.getDate()}日 ${TimeCache.getHours()}时${TimeCache.getMinutes()}分`;
    }

    /**
     * 格式化时间 格式: xxxx-xx-xx
     * @param timestamp 时间戳 (ms)
     */
    public static formatYMD(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}-${TimeCache.getMonth() + 1}-${TimeCache.getDate()}`;
    }

    /**
     * 格式化时间 格式: xxxx年xx月xx日
     * @param timestamp 时间戳 (ms)
     */
    public static formatYMDChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getFullYear()}年${TimeCache.getMonth() + 1}月${TimeCache.getDate()}日`;
    }

    /**
     * 格式化时间 格式: xx-xx h:m:s
     * @param timestamp 时间戳 (ms)
     */
    public static formatMDHMS(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getMonth() + 1}-${TimeCache.getDate()} ${TimeCache.getHours()}:${TimeCache.getMinutes()}:${TimeCache.getSeconds()}`;
    }

    /**
     * 格式化时间 格式: xx月xx日 h时m分s秒
     * @param timestamp 时间戳 (ms)
     */
    public static formatMDHMSChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getMonth() + 1}月${TimeCache.getDate()}日 ${TimeCache.getHours()}时${TimeCache.getMinutes()}分${TimeCache.getSeconds()}秒`;
    }

    /**
     * 格式化时间 格式: xx-xx
     * @param timestamp 时间戳 (ms)
     */
    public static formatMD(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getMonth() + 1}-${TimeCache.getDate()}`;
    }

    /**
     * 格式化时间 格式: xx月xx日
     * @param timestamp 时间戳 (ms)
     */
    public static formatMDChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getMonth() + 1}月${TimeCache.getDate()}日`;
    }

    /**
     * 格式化时间 格式: hh:mm
     * @param timestamp 时间戳 (ms)
     */
    public static formatHM(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getHours()}:${TimeCache.getMinutes()}`;
    }

    /**
     * 格式化时间 格式: h时m分
     * @param timestamp 时间戳 (ms)
     */
    public static formatHMChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getHours()}时${TimeCache.getMinutes()}分`;
    }

    /**
     * 格式化时间 格式: hh:mm:ss
     * @param timestamp 时间戳 (ms)
     */
    public static formatHMS(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getHours()}:${TimeCache.getMinutes()}:${TimeCache.getSeconds()}`;
    }

    /**
     * 格式化时间 格式: h时m分s秒
     * @param timestamp 时间戳 (ms)
     */
    public static formatHMSChinese(timestamp: number): string {
        TimeCache.setTime(timestamp);
        return `${TimeCache.getHours()}时${TimeCache.getMinutes()}分${TimeCache.getSeconds()}秒`;
    }

    /**
     * 智能格式化时间 格式 >1天(x天x小时x分x秒) >1小时(xx小时x分x秒) 1分钟(xx分x秒) 1秒(xx秒)
     * @param time 时间 (s)
     */
    public static formatSmart(time: number): string {
        const curTime = Math.floor(time < 0 ? 0 : time);
        const day = Math.floor(curTime / 86400);
        const hour = Math.floor((curTime % 86400) / 3600);
        const minute = Math.floor((curTime % 3600) / 60);
        const second = curTime % 60;
        if (day > 0) {
            return `${day}天${hour}小时${minute}分${second}秒`;
        } else if (hour > 0) {
            return `${hour}小时${minute}分${second}秒`;
        } else if (minute > 0) {
            return `${minute}分${second}秒`;
        } else {
            return `${second}秒`;
        }
    }

    /**
     * 智能格式化时间 格式 >1天(x天x小时) >1小时(xx小时xx分) 1分钟(xx分xx秒) 1秒(xx秒)
     * @param time 时间 (s)
     */
    public static formatSmartSimple(time: number): string {
        const curTime = Math.floor(time < 0 ? 0 : time);
        if (curTime > 86400) {
            const day = Math.floor(curTime / 86400);
            const hour = Math.ceil((curTime % 86400) / 3600);
            return `${day}天${hour}小时`;
        } else if (curTime > 3600) {
            const hour = Math.floor(curTime / 3600);
            const minute = Math.ceil((curTime % 3600) / 60);
            return `${hour}小时${minute}分`;
        } else if (curTime > 60) {
            const minute = Math.floor(curTime / 60);
            const second = Math.ceil(curTime % 60);
            return `${minute}分${second}秒`;
        } else {
            return `${curTime}秒`;
        }
    }

    /**
     * 格式化倒计时 格式: xx:xx:xx
     * @param time 时间 (s)
     */
    public static formatToHour(time: number): string {
        const curTime = time < 0 ? 0 : time;
        const timeNum = Math.floor(curTime);
        const hour = Math.floor(timeNum / 3600);
        const minute = Math.floor((timeNum % 3600) / 60);
        const seconds = timeNum % 60;
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
        const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${hourStr}:${minuteStr}:${secondsStr}`;
    }

    /**
     * 格式化倒计时 格式: xx小时xx分xx秒
     * @param time 时间 (s)
     */
    public static formatToHourChinese(time: number): string {
        const curTime = time < 0 ? 0 : time;
        const timeNum = Math.floor(curTime);
        const hour = Math.floor(timeNum / 3600);
        const minute = Math.floor((timeNum % 3600) / 60);
        const seconds = timeNum % 60;
        return `${hour}小时${minute}分${seconds}秒`;
    }

    /**
     * 格式化倒计时 格式: xx:xx
     * @param time 时间 (s)
     */
    public static formatToMinute(time: number): string {
        const curTime = time < 0 ? 0 : time;
        const timeNum = Math.floor(curTime);
        const minute = Math.floor(timeNum / 60);
        const seconds = timeNum % 60;
        const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minuteStr}:${secondsStr}`;
    }

    /**
     * 格式化倒计时 格式: xx分xx秒
     * @param time 时间 (s)
     */
    public static formatToMinuteChinese(time: number): string {
        return this.formatToMinute(time).replace(/:/g, "分") + "秒";
    }
}