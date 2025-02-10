export class DiaDetailsRO {
    diameter: number;
    length: number;
    thickness: number;
    constructor({ diameter, length, thickness }: { diameter: number, length: number, thickness: number }) {
        this.diameter = diameter;
        this.thickness = thickness;
        this.length = length
    }
}