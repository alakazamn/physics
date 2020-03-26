import Chunk from '../../shared/chunk';
import Tile from '../engine/tile';
import BoundingBox from '../../shared/boundingbox';
import Player from '../../shared/player';

export default class Renderer {
  public static ZOOM : number = 3;
  private static instance : Renderer;
  private canvas = document.createElement('canvas');
  private lastChunk : Chunk;
  private lastX : number;
  private lastY : number;
  private constructor() {

  }

  public static getInstance() : Renderer {
    if(!Renderer.instance) {
      Renderer.instance = new Renderer();
    }
    return Renderer.instance;
  }

  /*
  * Stuff to do when window loads
  */

  initialize = () => {
    Tile.loadTextures()
    this.canvas.style.position = "fixed";
    this.canvas.style.left = "0px";
    this.canvas.style.top = "0px";
    this.canvas.getContext("2d").imageSmoothingEnabled = false;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    document.body.appendChild(this.canvas);

    // resize the canvas to fill browser window dynamically
   window.addEventListener('resize', () => {
     this.canvas.height = window.innerHeight;
     this.canvas.width = window.innerWidth;
     this.renderLast();
   }, false);

  }
  renderLast = () => {
    this.renderChunk(this.lastChunk, this.lastX, this.lastY);
  }

  //Takes in Chunk and player location (center)
  renderChunk = (c : Chunk, x: number, y: number) => {
    if(!Tile.loaded()) return;
    this.lastChunk = c;
    this.lastX = x;
    this.lastY = y;
    //Camera Bounds checking... camera will stop at the edge of the map.
    let cameraWidth = this.canvas.offsetWidth;
    let cameraHeight = this.canvas.offsetHeight;

    let mapWidth = c.columns() * Tile.WIDTH * Renderer.ZOOM;
    let mapHeight = c.rows() *  Tile.HEIGHT * Renderer.ZOOM;

    var cameraX = x*Renderer.ZOOM; //to pixels
    var cameraY = y*Renderer.ZOOM;  //to pixels

    if(mapWidth > cameraWidth) {
      if(cameraX - (cameraWidth/2) < 0) { //if left bound < 0
        cameraX = (cameraWidth/2); //left bound = 0
      }
      if(cameraX + (cameraWidth/2) > mapWidth) {
        cameraX = mapWidth - (cameraWidth/2);
      }
    } else {
      cameraX = mapWidth / 2;
    }

    if(mapHeight > cameraHeight) {
      if(cameraY - (cameraHeight/2) < 0) {
        cameraY = (cameraHeight/2);
      }
      if(cameraY + (cameraHeight/2) > mapHeight) {
        cameraY = mapHeight - (cameraHeight/2);
      }
    } else {
      cameraY = mapHeight / 2;
    }
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);

    var cam = new BoundingBox(cameraX-(cameraWidth/2), cameraY-(cameraHeight/2), cameraWidth, cameraHeight);
    for(var zz = 0; zz<c.tiles[0][0].length; zz++) {

        for(var yy = Math.floor(cam.y / (Tile.HEIGHT * Renderer.ZOOM))-1; yy<Math.ceil((cam.y+cameraHeight) / (Tile.HEIGHT * Renderer.ZOOM)); yy++) {
          for(var xx = Math.floor(cam.x / (Tile.WIDTH * Renderer.ZOOM))-1; xx<Math.ceil((cam.x+cameraWidth) / (Tile.WIDTH * Renderer.ZOOM)); xx++) {
            if(xx < 0) xx = 0;
            if(yy < 0) yy = 0;
              const relPosX = ((xx*Tile.WIDTH*Renderer.ZOOM)-cam.x);
              let relPosY = ((yy*Tile.HEIGHT*Renderer.ZOOM)-cam.y);
              if(c.tiles[xx][yy][zz] != -1) {
                const img = new Tile(c.tiles[xx][yy][zz]).image();
                if(img.height > Tile.HEIGHT) {
                  relPosY -= ((img.height / (Tile.HEIGHT*Renderer.ZOOM))-1)*Tile.HEIGHT*Renderer.ZOOM;
                }
                this.canvas.getContext("2d").drawImage(img, relPosX, relPosY);
              }
          }
          for(var entity of c.getEntities()) {
            if(zz+1===c.tiles[0][0].length && (entity.y >= yy*Tile.HEIGHT || (entity.y < 0 && yy == 0)) && entity.y < (yy+1)*Tile.HEIGHT) {
              //render the player
              this.canvas.getContext("2d").drawImage(new Tile(Tile.TILES).image(), ((entity.x*Renderer.ZOOM)-(Player.WIDTH*Renderer.ZOOM/2)-cam.x), ((entity.y*Renderer.ZOOM)-(Player.HEIGHT*Renderer.ZOOM/2)-cam.y), Player.WIDTH*Renderer.ZOOM, Player.HEIGHT*Renderer.ZOOM);
            }
          }
          if(zz+1===c.tiles[0][0].length && (y >= yy*Tile.HEIGHT || (y < 0 && yy == 0)) && y < (yy+1)*Tile.HEIGHT) {
            //render the player
            this.canvas.getContext("2d").drawImage(new Tile(Tile.TILES).image(), ((x*Renderer.ZOOM)-(Player.WIDTH*Renderer.ZOOM/2)-cam.x), ((y*Renderer.ZOOM)-(Player.HEIGHT*Renderer.ZOOM/2)-cam.y), Player.WIDTH*Renderer.ZOOM, Player.HEIGHT*Renderer.ZOOM);
          }
      }
    }


  }
  public onScreen = (x : number, y: number, width: number, height: number, zoom : number, camera: BoundingBox) : Boolean => {
    return (zoom*x*width)>(camera.x-(width*zoom)) && (zoom*x*width)<=(camera.x+camera.width) && (zoom*y*height)>(camera.y-(height*zoom)) && (zoom*y*height)<=(camera.y+camera.height);
  }
  public tileOnScreen = (x : number, y: number, zoom : number, camera: BoundingBox) : Boolean => {
    return this.onScreen(x,y,Tile.WIDTH, Tile.HEIGHT, zoom, camera);
  }

  public toggleFullScreen = () => {
    if (!document.fullscreenElement) {
       document.documentElement.requestFullscreen();
   } else {
     if (document.exitFullscreen) {
       document.exitFullscreen();
     }
   }
  }
  /*
  * Stuff to do when window is closing
  */

  end = () => {

  }
}
