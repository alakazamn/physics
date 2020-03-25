export default class BoundingBox {
  public constructor(public x : number, public y: number, public width: number, public height: number) {

  }

  getX = () : number => {
    return this.x;
  }
  getY = () : number => {
    return this.y;
  }

  setX = (x: number) =>{
    this.x = x;
  }
  setY = (y: number) =>{
    this.y = y;
  }
  centerX = () : number =>{
    return (this.width/2) + this.x;
  }
  centerY = () : number => {
    return (this.height/2) + this.y;
  }

  //modifying methods return a new chunk, to be loaded and put onto the server
}
