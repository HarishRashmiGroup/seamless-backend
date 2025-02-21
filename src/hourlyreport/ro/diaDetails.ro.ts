export class DiaDetailsRO {
    diameter: number;
    nos: number;
    length: number;
    thickness: number;
    constructor({ diameter, nos, length, thickness }: { diameter: number, nos: number; length: number, thickness: number }) {
        this.diameter = diameter;
        this.nos = nos;
        this.thickness = thickness;
        this.length = length
    }
}