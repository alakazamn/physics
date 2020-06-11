import Tile from './Tile';
import { Player, Chunk, BoundingBox} from '../engine/Engine';

import * as _ from "lodash";

/* 
  Nitty-gritty drawing code
  I wouldn't read this if I were you...
  it's gross and math-based to an irritating degree... 
  
  Took many hours of troubleshooting and tweaking
  to the point where it takes me a long time to understand it 
  when I re-read, and I wrote it... 
*/

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
    
   
    for(var bg = 0; bg<5; bg++) {
      let camX = (cam.getX() * bg * 0.1);
      let startX = Math.floor(camX / (2500));
      let endX = Math.ceil((camX+cameraWidth) / (2500));
      for(var i = startX; i<endX; i++) {  
        if(i < 0) i = 0;
        let img = new Tile(bg).bg();
        const relPosX = i*img.width-camX - (camX * bg * 0.1);
        let relPosY = (-100-cam.getY());
        this.canvas.getContext("2d").drawImage(img, relPosX, relPosY);
      }
    }
    for(var yy = Math.floor(cam.getY() / (Tile.HEIGHT * Renderer.ZOOM))-1; yy-2<Math.ceil((cam.getY()+cameraHeight) / (Tile.HEIGHT * Renderer.ZOOM)); yy++) {
      for(var xx = Math.floor(cam.getX() / (Tile.WIDTH * Renderer.ZOOM)); xx<Math.ceil((cam.getX()+cameraWidth) / (Tile.WIDTH * Renderer.ZOOM)); xx++) {
        if(xx < 0) xx = 0;
        if(yy < 0) yy = 0;
        if(yy>=c.tiles[xx].length) continue;
          const relPosX = ((xx*Tile.WIDTH*Renderer.ZOOM)-cam.getX());
          let relPosY = ((yy*Tile.HEIGHT*Renderer.ZOOM)-cam.getY());

          if(!c.tiles[xx][yy]) continue;
          var tile = -1;
          if(!this.hasLeft(c, xx, yy) && this.hasRight(c,xx,yy) && !this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy)) {
            tile = 0;
          } 
          else if(this.hasLeft(c, xx, yy) && this.hasRight(c,xx,yy) && !this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy)) {
            tile = 1;
          } 
          else if(this.hasLeft(c, xx, yy) && !this.hasRight(c,xx,yy) && !this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy)) {
            tile = 2;
          }  
          else if(!this.hasLeft(c, xx, yy) && this.hasRight(c,xx,yy) && this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy)) {
            tile = 3;
          }
          else if(this.hasLeft(c, xx, yy) && !this.hasRight(c,xx,yy) && this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy)) {
            tile = 4;
          } else if(this.hasLeft(c, xx, yy) && this.hasRight(c,xx,yy) && this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy) && !this.hasTopRightCorner(c,xx,yy)) {
            tile = 6;
          } else if(this.hasLeft(c, xx, yy) && this.hasRight(c,xx,yy) && this.hasTop(c,xx,yy) && this.hasBottom(c,xx,yy) && !this.hasTopLeftCorner(c,xx,yy)) {
            tile = 7;
          } else {
            tile = 5;
          }
          if(tile != -1) {
            const img = new Tile(tile).image();
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
    
    if(this.debugOn) {
      let ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#000";
      player.getForces().forEach((force) => {
        let smallerForce = force.div(Renderer.ZOOM*3);
        ctx.beginPath();
        ctx.moveTo(((x*Renderer.ZOOM)-cam.getX()), ((y*Renderer.ZOOM)-cam.getY()));
        ctx.lineTo(((x*Renderer.ZOOM)-cam.getX())+smallerForce.getX(), ((y*Renderer.ZOOM)-cam.getY())+smallerForce.getY());
        ctx.stroke();

        this.drawArrowhead(ctx, 
          {
            x: (x*Renderer.ZOOM)-cam.getX(), 
            y: (y*Renderer.ZOOM)-cam.getY()
          },
          {
            x: (x*Renderer.ZOOM)-cam.getX()+smallerForce.getX(), 
            y: (y*Renderer.ZOOM)-cam.getY()+smallerForce.getY() 
          }, 10)

      })
    } else {
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#FFF";
      ctx.font = '15px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
      ctx.fillText("Press F3 to see free body diagrams", this.canvas.width - 300, this.canvas.height - 30);
      ctx.fillStyle = "#000";
    }
  }


  hasLeft(c : Chunk, x : number, y: number) {
    return (c.tiles[x-1] && c.tiles[x-1][y]) || x-1 < 0;
  }
  hasRight(c : Chunk, x : number, y: number) {
    return (c.tiles[x+1] && c.tiles[x+1][y]) || x+1 > c.tiles.length;
  }
  hasTop(c : Chunk, x : number, y: number) {
    return c.tiles[x][y-1]|| y-1 < 0;
  }
  hasBottom(c : Chunk, x : number, y: number) {
    return c.tiles[x][y+1] || y+1 >= c.tiles[x].length;
  }
  hasTopRightCorner(c : Chunk, x : number, y: number) {
    return c.tiles[x+1][y-1];
  }
  hasTopLeftCorner(c : Chunk, x : number, y: number) {
    if(x-1 < 0 || y-1 < 0) return true;
    return c.tiles[x-1][y-1];
  }
 /**
   * Draw an arrowhead on a line on an HTML5 canvas.
   *
   * Based almost entirely off of http://stackoverflow.com/a/36805543/281460 with some modifications
   * for readability and ease of use.
   *
   * @param context The drawing context on which to put the arrowhead.
   * @param from A point, specified as an object with 'x' and 'y' properties, where the arrow starts
   *             (not the arrowhead, the arrow itself).
   * @param to   A point, specified as an object with 'x' and 'y' properties, where the arrow ends
   *             (not the arrowhead, the arrow itself).
   * @param radius The radius of the arrowhead. This controls how "thick" the arrowhead looks.
   */
  //Took this from here:
  drawArrowhead = (context, from, to, radius) => {
    var x_center = to.x;
    var y_center = to.y;

    var angle;
    var x;
    var y;

    context.beginPath();

    angle = Math.atan2(to.y - from.y, to.x - from.x)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1.0/3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1.0/3.0) * (2 * Math.PI)
    x = radius *Math.cos(angle) + x_center;
    y = radius *Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
  }

  public onScreen = (x : number, y: number, width: number, height: number, zoom : number, camera: BoundingBox) : Boolean => {
    return (zoom*x*width)>(camera.getX()-(width*zoom)) && (zoom*x*width)<=(camera.getX()+camera.width) && (zoom*y*height)>(camera.getY()-(height*zoom)) && (zoom*y*height)<=(camera.getY()+camera.height);
  }
  public tileOnScreen = (x : number, y: number, zoom : number, camera: BoundingBox) : Boolean => {
    return this.onScreen(x,y,Tile.WIDTH, Tile.HEIGHT, zoom, camera);
  }

  private debugOn = false;
  public toggleDebug = () => {
    this.debugOn = !this.debugOn;
  }
  /*
  * Stuff to do when window is closing
  */

  end = () => {

  }
}
