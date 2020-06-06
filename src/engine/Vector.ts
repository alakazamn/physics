export class Vector  {
    constructor(private readonly x:number, private readonly y:number) {

    }

    public getX() {
        return this.x;
    }
    public getY() {
        return this.y;
    }
    
    public plusVec = (vec: Vector) : Vector =>{
        return new Vector(this.x+vec.x, this.y + vec.y);
    }

    public div = (scal: number) : Vector =>{
        return new Vector(this.x/scal, this.y/scal);
    }

    public mult = (scal: number) : Vector =>{
        return new Vector(this.x*scal, this.y*scal);
    }

    public setX = (x: number) : Vector =>{
        return new Vector(x, this.y);
    }

    public plusX = (x: number) : Vector =>{
        return new Vector(this.x+x, this.y);
    }

    public setY = (y: number) : Vector  =>{
        return new Vector(this.x, y);
    }
    
    public plusY = (y: number) : Vector =>{
        return new Vector(this.x, this.y+y);
    }


    public getAngle() {
        return Math.atan(this.y / this.x)
    }
    public getMagnitude() {
        return Math.sqrt(Math.pow(this.y,2) + Math.pow(this.x,2))
    }
  }