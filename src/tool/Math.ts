const MathMin = Math.min;
const MathMax = Math.max;
const MathFloor = Math.floor;
const MathRandom = Math.random;

export class MathTool {
    /** 限制 value 在 min 和 max 之间 */
    public static clampf(value: number, min: number, max: number): number {
        return MathMin(MathMax(value, min), max);
    }

    /** 随机 min 到 max之间的整数 (包含 min 和 max) */
    public static rand(min: number, max: number): number {
        return MathFloor(MathRandom() * (max - min + 1) + min);
    }

    /** 随机 min 到 max之间的浮点数 (包含 min 和 max) */
    public static randRange(min: number, max: number): number {
        return MathRandom() * (max - min) + min;
    }

    /** 角度转弧度 */
    public static rad(angle: number): number {
        return (angle * Math.PI) / 180;
    }

    /** 弧度转角度 */
    public static deg(radian: number): number {
        return (radian * 180) / Math.PI;
    }

    /** 
     * 平滑过渡
     * @param num1 起始值
     * @param num2 目标值
     * @param elapsedTime 已用时间
     * @param responseTime 响应时间
     * @returns 平滑过渡后的值
     */
    public static smooth(num1: number, num2: number, elapsedTime: number, responseTime: number): number {
        let out: number = num1;
        if (elapsedTime > 0) {
            out = out + (num2 - num1) * (elapsedTime / (elapsedTime + responseTime));
        }
        return out;
    }

    /**
     * 内部使用的辅助方法，用于计算平滑过渡的因子
     * @internal
     */
    public static calculateSmoothFactor(elapsedTime: number, responseTime: number): number {
        return elapsedTime / (elapsedTime + responseTime);
    }

    /**
     * 内部使用的工具方法，不应该在库外部使用
     * @internal
     */
    public static internalRoundToDecimal(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    /**
     * 内部使用的辅助常量
     * @internal
     */
    public static readonly INTERNAL_EPSILON = 0.00001;
}