export default class Tile {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 16;
  private imageData : ImageData;

  public constructor(id : number) {
    if(id == 0) {
      this.imageData = Tile.solidTile(0,255,0);
    }
    else if(id == 1) {
      this.imageData = Tile.solidTile(0,0,255);
    }
  }
  image = () : ImageData => {
    return this.imageData;
  }

  private static solidTile(r : number, g : number, b : number) : ImageData {
    return Tile.solid(Tile.WIDTH, Tile.HEIGHT, r,g,b);
  }
  public static solid(width :number, height: number, r : number, g : number, b : number) : ImageData {
    var imageData : Uint8ClampedArray = new Uint8ClampedArray(width*height*4);
    for(var i = 0; i<width*height*4; i+=4) {
      imageData[i] = r;
      imageData[i+1] = g;
      imageData[i+2] = b;
      imageData[i+3] = 255;
    }
    return new ImageData(imageData, width, height);
  }
}
