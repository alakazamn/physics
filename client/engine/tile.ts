import Renderer from "../graphics/Renderer";

export default class Tile {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 16;
  public static readonly TILES = 3;
  private static readonly textures : ImageBitmap[] = [];
  private static loadedAll = false;

  public static async loadTextures() : Promise<void> {
  let tileNumber : number = Tile.TILES;
  var promises : Promise<void>[]  = [];
    for(var i = 0; i<tileNumber; i++) {
      const g = i;
      promises[i] = Tile.loadTexture(i.toString()).then((imageData) => {
        createImageBitmap(imageData).then(renderer => { Tile.textures[g] = renderer; })
      })
    }
    //just add the player sprite for now
    promises[i] = Tile.loadTexture("player").then((imageData) => {
      createImageBitmap(imageData).then(renderer => { Tile.textures[Tile.TILES] = renderer; }).catch((e) => { console.log(e);})
    })

    try {
      await Promise.all(promises);
      Tile.loadedAll = true;
    }
    catch (e) {
      console.log(e);
    }
  }
  private static loadTexture(id : string) : Promise<ImageData> {
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

    if(this.id <=Tile.TILES)
      return Tile.textures[this.id];
    return null;
  }
  //https://stackoverflow.com/questions/17591148/converting-data-uri-to-image-data
 private static convertURIToImageData = (URI: string) : Promise<ImageData> => {
  return new Promise(function(resolve, reject) {
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
}
