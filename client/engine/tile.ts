import Renderer from "../graphics/Renderer";

export default class Tile {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 16;
  private static readonly TILES = 2;
  private static readonly textures : ImageBitmap[] = [];
  private static loadedAll = false;

  public static async loadTextures() : Promise<void> {
  let tileNumber : number = Tile.TILES;
  var promises : Promise<void>[]  = [];
    for(var i = 0; i<tileNumber; i++) {
      const g = i;
      promises[i] = Tile.loadTexture(i).then((imageData) => {
        createImageBitmap(imageData).then(renderer => { Tile.textures[g] = renderer; })
      })
    }
    try {
      await Promise.all(promises);
      Tile.loadedAll = true;
    }
    catch (e) {
      console.log(e);
    }
  }
  private static loadTexture(id : Number) : Promise<ImageData> {
      try {
        const url = require('../../dist/tiles/'+id+'.png')
        return this.convertURIToImageData(url);
      } catch (e) {
        return Promise.reject(e);
      }
  }
  public constructor(private id : number) {
  }
  public static loaded = () : Boolean => {
    return Tile.loadedAll;
  }
  image = () : ImageBitmap => {
    if(this.id <Tile.TILES)
      return Tile.textures[this.id];
    return null;
  }
  //https://stackoverflow.com/questions/17591148/converting-data-uri-to-image-data
 private static convertURIToImageData = (URI: string) : Promise<ImageData> => {
  return new Promise(function(resolve, reject) {
    console.log("running");
    if (URI == null) return reject();
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
    image.addEventListener('load', () => {
      canvas.width = image.width*Renderer.ZOOM;
      canvas.height = image.height*Renderer.ZOOM;
      canvas.getContext("2d").imageSmoothingEnabled = false;
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width*Renderer.ZOOM, image.height*Renderer.ZOOM);
      return resolve(context.getImageData(0, 0, image.width*Renderer.ZOOM,  image.height*Renderer.ZOOM));
    }, false);
    image.src = URI;
  });
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
