export default class Tile {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 16;
  private static readonly TILES = 2;
  private static readonly textures : ImageData[] = [];
  private static loadedAll = false;

  public static loadTextures() : Promise<void> {
  let tileNumber : number = Tile.TILES;
  var promises : Promise<void>[]  = [];
    for(var i = 0; i<tileNumber; i++) {
      const g = i;
      promises[i] = Tile.loadTexture(i).then((imageData) => {
        Tile.textures[g] = imageData;
      })
    }
    return Promise.all(promises).then(() => {
      Tile.loadedAll = true;
    }).catch((e) => {
        console.log(e);
    })
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
  image = () : ImageData => {
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
      console.log("okay");
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return resolve(context.getImageData(0, 0, canvas.width, canvas.height));
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
