export class DiaDetailsRO {
    diameter: number;
    nos: number;
    length: number;
    thickness: number;
    outputDiameter: number | null;
    outputThickness: number | null;
    outputLength: number | null;
    constructor({ diameter, nos, length, thickness, outputDiameter, outputThickness, outputLength }:
        { diameter: number, nos: number; length: number, thickness: number, outputDiameter: number | null, outputThickness: number | null, outputLength: number | null }) {
        this.diameter = diameter;
        this.nos = nos;
        this.thickness = thickness;
        this.length = length;
        this.outputDiameter = outputDiameter ?? undefined;
        this.outputLength = outputLength ?? undefined;
        this.outputThickness = outputThickness ?? undefined;
    }
}