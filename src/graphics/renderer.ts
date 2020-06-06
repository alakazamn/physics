import Tile from './Tile';
import { Player, Chunk, BoundingBox} from '../Engine';

import * as _ from "lodash";

export default class Renderer {
  public static ZOOM : number = 1;
  private static instance : Renderer;
  private canvas = document.createElement('canvas');
  private lastChunk : Chunk;
  private lastPlayer: Player;
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
    this.renderChunk(this.lastChunk, this.lastPlayer);
  }

  //Takes in Chunk and player location (center)
  renderChunk = (c : Chunk, player : Player) => {
    if(!Tile.loaded()) return;
    if(!c) return;
    this.lastChunk = _.cloneDeep(c);
    this.lastPlayer = _.cloneDeep(player);

    var x = player.centerX();
    var y = player.centerY();

    //Camera Bounds checking... camera will stop at the edge of the map.
    let cameraWidth = this.canvas.offsetWidth;
    let cameraHeight = this.canvas.offsetHeight;

    let mapWidth = Chunk.WIDTH * Tile.WIDTH * Renderer.ZOOM;
    let mapHeight = Chunk.HEIGHT *  Tile.HEIGHT * Renderer.ZOOM;

    var cameraX = x*Renderer.ZOOM; //to pixels
    var cameraY = y-100*Renderer.ZOOM;  //to pixels

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

    let startX = Math.floor(cam.getX() / (1024));
    let endX = Math.ceil((cam.getX()+cameraWidth) / (1024));
    for(var i = startX; i<endX; i++) {  
      if(i < 0) i = 0;
      let bg = 0;
      if(c.biomes[i] == 0 || c.biomes[i] == 5 || c.biomes[i] == 3 || c.biomes[i] == 4) { //grass or liquid
        bg = 0;
      } else if(c.biomes[i] == 1 || c.biomes[i] == 6) { //sand
        bg = 3;
      } else if(c.biomes[i] == 2 || c.biomes[i] == 7) { //ice
        bg = 2;
      }
      let img = new Tile(bg).bg();
      const relPosX = i*img.width-cam.getX();
      let relPosY = (-100-cam.getY());
      this.canvas.getContext("2d").drawImage(img, relPosX, relPosY);
    }
    for(var yy = Math.floor(cam.getY() / (Tile.HEIGHT * Renderer.ZOOM))-1; yy-2<Math.ceil((cam.getY()+cameraHeight) / (Tile.HEIGHT * Renderer.ZOOM)); yy++) {
      for(var xx = Math.floor(cam.getX() / (Tile.WIDTH * Renderer.ZOOM)); xx<Math.ceil((cam.getX()+cameraWidth) / (Tile.WIDTH * Renderer.ZOOM)); xx++) {
        if(xx < 0) xx = 0;
        if(yy < 0) yy = 0;
        if(yy>=c.tiles[xx].length) continue;
          const relPosX = ((xx*Tile.WIDTH*Renderer.ZOOM)-cam.getX());
          let relPosY = ((yy*Tile.HEIGHT*Renderer.ZOOM)-cam.getY());
          if(c.tiles[xx][yy] != -1) {
            const img = new Tile(c.tiles[xx][yy]).image();
            if(img.height > Tile.HEIGHT) {
              relPosY -= ((img.height / (Tile.HEIGHT*Renderer.ZOOM))-1)*Tile.HEIGHT*Renderer.ZOOM;
            }
            this.canvas.getContext("2d").drawImage(img, relPosX, relPosY);
          }
      }
    }

  //render the player
    var frame = 0;
    if(player.getJumping()) {
      frame = 4;
    }
    else if(player.getMoving()) {
      frame = Math.ceil(Math.random()*2);
    }

    this.canvas.getContext("2d").drawImage(new Tile(frame).player(), ((x*Renderer.ZOOM)-(Player.WIDTH*Renderer.ZOOM/2)-cam.getX()), ((y*Renderer.ZOOM)-(Player.HEIGHT*Renderer.ZOOM/2)-cam.getY()), Player.WIDTH*Renderer.ZOOM, Player.HEIGHT*Renderer.ZOOM);

  }
  public onScreen = (x : number, y: number, width: number, height: number, zoom : number, camera: BoundingBox) : Boolean => {
    return (zoom*x*width)>(camera.getX()-(width*zoom)) && (zoom*x*width)<=(camera.getX()+camera.width) && (zoom*y*height)>(camera.getY()-(height*zoom)) && (zoom*y*height)<=(camera.getY()+camera.height);
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
