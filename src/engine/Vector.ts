/*
    A Vector type with some basic math functionality defined.
*/
export class Vector  {
    /*
        Construct a Vector with an X component and a Y component
    */
    constructor(private readonly x:number, private readonly y:number) { }

    /*
        Get the direction of the Vector.
    */
    public getAngle() {
        return Math.atan(this.y / this.x)
    }

    /*
        Get the magnitude of the Vector.
    */
    public getMagnitude() {
        return Math.sqrt(Math.pow(this.y,2) + Math.pow(this.x,2))
    }

    /*
        Get the X component of the Vector.
    */
    public getX() {
        return this.x;
    }

    /*
        Set the X component of the Vector.
    */
    public setX = (x: number) : Vector =>{
        return new Vector(x, this.y);
    }

    /*
        Add a scalar to the X component of the Vector.
    */
    public plusX = (x: number) : Vector =>{
        return new Vector(this.x+x, this.y);
    }

    /*
        Round X to the nearest 10th.
    */
    public roundX = () : Vector => {
        return new Vector(Math.round(this.x*10)/10,this.y);
    }
    /*
        Get the Y component of the Vector.
    */
    public getY() {
        return this.y;
    }
    
    /*
        Set the Y component of the Vector.
    */
    public setY = (y: number) : Vector  =>{
        return new Vector(this.x, y);
    }
    
    /*
        Add a scalar to the Y component of the Vector.
    */
    public plusY = (y: number) : Vector =>{
        return new Vector(this.x, this.y+y);
    }

    /*
        Combine two Vectors using addition.
    */
    public plusVec = (vec: Vector) : Vector =>{
        return new Vector(this.x+vec.x, this.y + vec.y);
    }

    /*
        Multiply the Vector by a scalar.
    */
    public mult = (scal: number) : Vector =>{
        return new Vector(this.x*scal, this.y*scal);
    }

    /*
        Divide the Vector by a scalar.
    */
    public div = (scal: number) : Vector =>{
        return new Vector(this.x/scal, this.y/scal);
    }
  }