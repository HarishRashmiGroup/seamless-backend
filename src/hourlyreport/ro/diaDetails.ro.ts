export class DiaDetailsRO {
    diameter: number;
    od: number;
    length: number;
    thickness: number;
    constructor({ diameter, od, length, thickness }: { diameter: number, od: number; length: number, thickness: number }) {
        this.diameter = diameter;
        this.od = od;
        this.thickness = thickness;
        this.length = length
    }
}