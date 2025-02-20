const MathMin = Math.min;
const MathMax = Math.max;
const MathFloor = Math.floor;
const MathRandom = Math.random;

export class MathTool {
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

    public static rad(angle: number): number {
        return (angle * Math.PI) / 180;
    }

    public static deg(radian: number): number {
        return (radian * 180) / Math.PI;
    }

    public static smooth(num1: number, num2: number, elapsedTime: number, responseTime: number): number {
        let out: number = num1;
        if (elapsedTime > 0) {
            out = out + (num2 - num1) * (elapsedTime / (elapsedTime + responseTime));
        }
        return out;
    }
}