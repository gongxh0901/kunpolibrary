/**
 * @Author: Gongxh
 * @Date: 2025-08-19
 * @Description: 
 */

import { kunpo } from "../../header";

export class Level extends kunpo.DataBase {

    private _levelid: number = 1;
    private _storey: number = 0;
    private _ispassed: boolean = false;
    private _data: { min: number, max: number } = { min: 1, max: 100 };

    constructor() {
        super();
    }

    public get levelid() { return this._levelid; }
    public set levelid(lv: number) { this._levelid = lv; }

    public get storey() { return this._storey; }
    public set storey(storey: number) { this._storey = storey; }

    public get ispassed() { return this._ispassed; }
    public set ispassed(bool: boolean) { this._ispassed = bool; }

    public get data(): { min: number, max: number } { return this._data; }
    public set data(data: { min: number, max: number }) { this._data = data; }

    public init(data: any) {
        this.data = { min: data.min, max: data.max };

        this.refreshMin(data.min);
        this.refreshMax(data.max);

        this.ispassed = data.ispassed;
        this.levelid = data.levelid;
        this.storey = data.storey;
    }

    public refreshLevel(lv: number) {
        this.levelid = lv;
    }

    public refreshStorey(storey: number) {
        this.storey = storey;
    }

    public refreshBool(bool: boolean) {
        this.ispassed = bool;
    }

    public refreshMin(min: number) {
        this.data.min = min;
    }

    public refreshMax(max: number) {
        this.data.max = max;
    }
}