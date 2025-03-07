## 时间
添加一系列时间相关的函数

```typescript
/** 获取游戏系统启动时间戳 */
static get osBootTime(): number;
/** 获取主动设置的网络时间 单位ms */
static get netTime(): number;
/** 获取本地时间与网路时间的偏移量 单位ms */
static get netTimeDiff(): number;
/** 获取系统运行时间 */
static get runTime(): number;
/**
 * 设置网络时间, 单位ms
 * @param netTime 网络时间
 */
static setNetTime(netTime: number): void;
/**
 * 获取当前时间 单位ms
 */
static now(): number;
/**
 * 将毫秒转换为秒
 * @param ms 毫秒
 */
static msTos(ms: number): number;
/**
 * 将秒转换为毫秒
 */
static sToMs(s: number): number;
/**
 * 获取时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间
 */
static getTime(timestamp?: number): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
};
/**
 * 获取年份
 * @param timestamp 时间戳 (ms)
 * @returns 年份
 */
static getYear(timestamp?: number): number;
/**
 * 获取月份
 * @param timestamp 时间戳 (ms)
 * @returns 月份
 */
static getMonth(timestamp?: number): number;
/**
 * 获取日期
 * @param timestamp 时间戳 (ms)
 * @returns 日期
 */
static getDay(timestamp?: number): number;
/**
 * 获取小时
 * @param timestamp 时间戳 (ms)
 * @returns 小时
 */
static getHour(timestamp?: number): number;
/**
 * 获取分钟
 * @param timestamp 时间戳 (ms)
 * @returns 分钟
 */
static getMinute(timestamp?: number): number;
/**
 * 获取秒
 * @param timestamp 时间戳 (ms)
 * @returns 秒
 */
static getSecond(timestamp?: number): number;
/**
 * 获取当天开始时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getDayStartTime(timestamp?: number): number;
/**
 * 获取当天的结束时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getDayEndTime(timestamp?: number): number;
/**
 * 获取传入时间是周几
 * @param {number} [time] (ms)
 * @returns {number}
 */
static getWeekDay(time?: number): number;
/**
 * 获取当前周的开始时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getWeekStartTime(timestamp?: number): number;
static getWeekEndTime(timestamp?: number): number;
/**
 * 获取当前月开始时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getMonthStartTime(timestamp?: number): number;
/**
 * 获取当前月结束时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getMonthEndTime(timestamp?: number): number;
/**
 * 获取当前年份开始时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getYearStartTime(timestamp?: number): number;
/**
 * 获取当前年份结束时间
 * @param timestamp 时间戳 (ms)
 * @returns 时间戳 (ms)
 */
static getYearEndTime(timestamp?: number): number;
/**
 * 获取当前月的天数
 * @param timestamp 时间戳 (ms)
 * @returns 天数
 */
static getMonthDays(timestamp?: number): number;
/**
 * 是否是同一天
 * @param timestamp1 时间戳1 (ms)
 * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
 * @returns 是否是同一天
 */
static isSameDay(timestamp1: number, now?: number): boolean;
/**
 * 是否是同一周
 * @param timestamp1 时间戳1 (ms)
 * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
 * @returns 是否是同一周
 */
static isSameWeek(timestamp1: number, now?: number): boolean;
/**
 * 是否是同一月
 * @param timestamp1 时间戳1 (ms)
 * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
 * @returns 是否是同一月
 */
static isSameMonth(timestamp1: number, now?: number): boolean;
/**
 * 是否是同一年
 * @param timestamp1 时间戳1 (ms)
 * @param now 时间戳2 (ms) 如果不传，则和当前时间比较
 * @returns 是否是同一年
 */
static isSameYear(timestamp1: number, now?: number): boolean;
/**
 * 格式化时间 格式: xxxx-xx-xx HH:MM:SS
 * @param timestamp 时间戳 (ms)
 */
static formatTime(timestamp: number): string;
/**
 * 格式化时间 格式: xxxx年xx月xx日 HH:MM:SS
 * @param timestamp 时间戳 (ms)
 */
static formatTimeChinese(timestamp: number): string;
/**
 * 格式化时间 格式: xxxx-xx-xx hh:mm
 * @param timestamp 时间戳 (ms)
 */
static formatYMDHM(timestamp: number): string;
/**
 * 格式化时间 格式: xxxx年xx月xx日 h时m分
 * @param timestamp 时间戳 (ms)
 */
static formatYMDHMChinese(timestamp: number): string;
/**
 * 格式化时间 格式: xxxx-xx-xx
 * @param timestamp 时间戳 (ms)
 */
static formatYMD(timestamp: number): string;
/**
 * 格式化时间 格式: xxxx年xx月xx日
 * @param timestamp 时间戳 (ms)
 */
static formatYMDChinese(timestamp: number): string;
/**
 * 格式化时间 格式: xx-xx h:m:s
 * @param timestamp 时间戳 (ms)
 */
static formatMDHMS(timestamp: number): string;
/**
 * 格式化时间 格式: xx月xx日 h时m分s秒
 * @param timestamp 时间戳 (ms)
 */
static formatMDHMSChinese(timestamp: number): string;
/**
 * 格式化时间 格式: xx-xx
 * @param timestamp 时间戳 (ms)
 */
static formatMD(timestamp: number): string;
/**
 * 格式化时间 格式: xx月xx日
 * @param timestamp 时间戳 (ms)
 */
static formatMDChinese(timestamp: number): string;
/**
 * 格式化时间 格式: hh:mm
 * @param timestamp 时间戳 (ms)
 */
static formatHM(timestamp: number): string;
/**
 * 格式化时间 格式: h时m分
 * @param timestamp 时间戳 (ms)
 */
static formatHMChinese(timestamp: number): string;
/**
 * 格式化时间 格式: hh:mm:ss
 * @param timestamp 时间戳 (ms)
 */
static formatHMS(timestamp: number): string;
/**
 * 格式化时间 格式: h时m分s秒
 * @param timestamp 时间戳 (ms)
 */
static formatHMSChinese(timestamp: number): string;
/**
 * 智能格式化时间 格式 >1天(x天x小时x分x秒) >1小时(xx小时x分x秒) 1分钟(xx分x秒) 1秒(xx秒)
 * @param time 时间 (s)
 */
static formatSmart(time: number): string;
/**
 * 智能格式化时间 格式 >1天(x天x小时) >1小时(xx小时xx分) 1分钟(xx分xx秒) 1秒(xx秒)
 * @param time 时间 (s)
 */
static formatSmartSimple(time: number): string;
/**
 * 格式化倒计时 格式: xx:xx:xx
 * @param time 时间 (s)
 */
static formatToHour(time: number): string;
/**
 * 格式化倒计时 格式: xx小时xx分xx秒
 * @param time 时间 (s)
 */
static formatToHourChinese(time: number): string;
/**
 * 格式化倒计时 格式: xx:xx
 * @param time 时间 (s)
 */
static formatToMinute(time: number): string;
/**
 * 格式化倒计时 格式: xx分xx秒
 * @param time 时间 (s)
 */
static formatToMinuteChinese(time: number): string;
```
