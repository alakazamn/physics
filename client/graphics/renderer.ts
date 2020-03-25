import Chunk from '../../shared/chunk';
import Tile from '../engine/tile';
import BoundingBox from '../../shared/boundingbox';
import Player from '../../shared/player';

export default class Renderer {
  private static MULT : number = 2;
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
    let zoom = Renderer.MULT;
    this.lastChunk = c;
    this.lastX = x;
    this.lastY = y;
    //Camera Bounds checking... camera will stop at the edge of the map.
    let cameraWidth = this.canvas.offsetWidth;
    let cameraHeight = this.canvas.offsetHeight;

    let mapWidth = c.columns() * Tile.WIDTH * zoom;
    let mapHeight = c.rows() *  Tile.HEIGHT * zoom;

    var cameraX = x*zoom; //to pixels
    var cameraY = y*zoom;  //to pixels

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

    for(var xx = Math.floor(cam.x / (Tile.WIDTH * zoom)); xx<Math.ceil((cam.x+cameraWidth) / (Tile.WIDTH * zoom)); xx++) {
      for(var yy = Math.floor(cam.y / (Tile.HEIGHT * zoom)); yy<Math.ceil((cam.y+cameraHeight) / (Tile.HEIGHT * zoom)); yy++) {
        if(this.onScreen(xx, yy, zoom, cam)) {
          const relPosX = ((xx*Tile.WIDTH*zoom)-cam.x);
          const relPosY = ((yy*Tile.HEIGHT*zoom)-cam.y);
          createImageBitmap(new Tile(c.tiles[xx][yy]).image()).then(renderer => {
            this.canvas.getContext("2d").drawImage(renderer, 0, 0, Tile.WIDTH, Tile.HEIGHT, relPosX, relPosY, Tile.WIDTH*zoom, Tile.HEIGHT*zoom);
          }).catch((e)=> {
            console.log(e);
          })
        }
      }
    }
    //render the player
    createImageBitmap(Tile.solid(Player.WIDTH, Player.HEIGHT, 255,255,255)).then(renderer => {
      this.canvas.getContext("2d").drawImage(renderer, 0, 0, Tile.WIDTH, Tile.HEIGHT, ((x*zoom)-(Player.WIDTH*zoom/2)-cam.x), ((y*zoom)-(Player.HEIGHT*zoom/2)-cam.y), Player.WIDTH*zoom, Player.HEIGHT*zoom);
    }).catch((e)=> {
      console.log(e);
    })
  }
  public onScreen = (x : number, y: number, zoom : number, camera: BoundingBox) : Boolean => {
    return (zoom*x*Tile.WIDTH)>(camera.x-(Tile.WIDTH*zoom)) && (zoom*x*Tile.WIDTH)<=(camera.x+camera.width) && (zoom*y*Tile.HEIGHT)>(camera.y-(Tile.HEIGHT*zoom)) && (zoom*y*Tile.HEIGHT)<=(camera.y+camera.height);
  }

  public fullScreen = () => {
    this.canvas.requestFullscreen();
  }
  /*
  * Stuff to do when window is closing
  */

  end = () => {

  }
}
