import Dispatch from "./Dispatch";

import Core from "./Core";

import { Player, Force, Surface } from "./Engine";
import { EventResult, PlayerStopEvent, PlayerJumpEvent, PhysicsMoveEvent } from "../event/Events";
import Tile from "../graphics/Tile";
import { TickEvent } from "../event/TickEvent";
import { Chunk, Vector } from "./Engine";

/* 
  Handles collisions (normal forces too) and applying velocity-resistive / friction forces 
  The actual logic that computates net force and determines acceleration / velocity is in engine/PhysicalObject.ts
*/

export default class Physics {
  private static instance : Physics;
  public static readonly GRAVITY = 9.8; //m/s
  public static readonly AIR_RESISTANCE = 8; //just a constant

  private constructor() {
    Dispatch.addPriorityListener("PhysicsMoveEvent",this.onPhysicsMove);
    Dispatch.addPriorityListener("PlayerJumpEvent", this.onPlayerJump)
    Dispatch.addPriorityListener("TickEvent",this.onTick);
  }

  public static getInstance() : Physics {
    if(!Physics.instance) {
        Physics.instance = new Physics();
    }
    return Physics.instance;
  }

  onTick = (e : TickEvent) => {
    for(var i = 0; i<e.getTicks(); i++) {
      this.logic(e.getChunk(), e.getPlayer());
    }
  }

  logic = (c : Chunk, p : Player) => {    
    p.tick(); 
    c.getObjects().forEach((e)=> {
      e.tick();
    })
  }

  /*
    Makes the player jump
  */
  onPlayerJump = (e : PlayerJumpEvent) => {
    let chunk = Core.getInstance().currentChunk(); 
    if(this.checkCollision(e.getPlayer().getX(), e.getPlayer().getY()+1,chunk)) { //only allow if on ground
       //unrealistic, but otherwise the game is unplayable...
       //the player needs to be able to jump at least 1m, which
       //in real life is impossible...
      e.getPlayer().applyImpulse(new Force(Math.PI/2, 1500), 0.6);
      e.getPlayer().setJumping(true);
    } else {
      e.setResult(EventResult.DENY)
    }
  }

  /*
    Check if the player is touching a block
  */
  checkCollision(x : number, y: number, chunk : Chunk) : boolean {
    let topX = Math.floor(x/Tile.WIDTH);
    let topY = Math.floor(y/Tile.HEIGHT);
    let bottomX = Math.ceil((x + Player.WIDTH)/Tile.WIDTH);
    let bottomY = Math.ceil((y + Player.HEIGHT)/Tile.HEIGHT);
    for(var xx = topX; xx < bottomX; xx++) {
      for(var yy = topY; yy < bottomY; yy++) {
         if(chunk.tiles[xx][yy] && this.collide(x,y,Player.WIDTH, Player.HEIGHT, xx*Tile.WIDTH, yy*Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT)) return true;
      }
    }
    return false
  }

  //From Mozilla, because I'm lazy... 
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  collide(aX : number, aY : number, aW: number, aH : number, bX : number, bY: number, bW: number, bH: number) {
    return (aX < bX + bW &&
     aX + aW > bX &&
      aY < bY + bH &&
      aY + aH > bY)
  }

  /*
    Called when the velocity of an object causes that object to move
  */
  onPhysicsMove = (e : PhysicsMoveEvent) => {
    let chunk = Core.getInstance().currentChunk(); 

    /*
      This gets a little complicated, but to check for collisions at discrete time intervals, 
      the system has to check for collisions retroactively, so that we don't miss a collision because
      we're only sampling every 1/20th of a second

      Thus, we basically step one pixel at a time in each direction, checking if there's a collision.
    */
    
    let xDT = e.getTo().getX() - e.getFrom().getX();
    let yDT = e.getTo().getY() - e.getFrom().getY();

    //Collision handling for the player and the ground
    let steps = Math.ceil(Math.max(Math.abs(xDT), Math.abs(yDT)))
    if(steps == 0) return;

    let endX = e.getTo().getX();
    let endY = e.getTo().getY();
    if(endX < 0) {
      xDT = 0;
    };
    if(endY < 0) {
      return;
    };

    var x = e.getFrom().getX();
    var y = e.getFrom().getY();
    for(var a = 0; a < steps; a++) {
      if(xDT != 0 && this.checkCollision(x + (xDT / steps),y,chunk)) {
        xDT = 0;
        e.getBody().stopH();
        e.setResult(EventResult.DENY);
        if(e.getBody() instanceof Player) {
          (e.getBody() as Player).setMoving(false);
        }
      }
      if(yDT !=0 && this.checkCollision(x,y + (yDT / steps),chunk)) {
        yDT = 0;
        e.getBody().stopV();
        if(e.getBody() instanceof Player) {
          (e.getBody() as Player).setJumping(false);
        }
        e.setResult(EventResult.DENY);
      } 
      if(xDT == 0 && yDT == 0) {
        break;
      }
      x+= xDT / steps;
      y+= yDT / steps;
    }

    //Apply air resistance in the x direction (I took the air resistance constant and divided it by two, otherwise it was too extreme)
    if(x - e.getFrom().getX() != 0) {
      e.getBody().applyForce(new Force(xDT < 0 ? 0 : Math.PI, Physics.AIR_RESISTANCE/2*Math.pow(e.getBody().getVelocity().getX(),2), true))

      //apply friction
      if(this.checkCollision(e.getBody().getX(), e.getBody().getY()+1,chunk) && Math.abs(e.getBody().getVelocity().getX()) > 0) {
        let bottomX = Math.ceil((e.getBody().getX() + e.getBody().getWidth())/Tile.WIDTH);
        let bottomY = Math.ceil((e.getBody().getY() +  e.getBody().getHeight()+1)/Tile.HEIGHT)-1;
        let friction = new Surface(0).getFriction(); //whatever
        let fF = Math.abs(e.getBody().normalForce().getMagnitude() * friction);
        e.getBody().applyForce(new Force(xDT < 0 ? 0 : Math.PI, fF, true))
      }
    }

    //Apply air resistance in the y direction 
    if(y - e.getFrom().getY() != 0) {
        e.getBody().applyForce(new Force(y - e.getFrom().getY() > 0 ? Math.PI / 2 : 3 * Math.PI / 2, Physics.AIR_RESISTANCE*Math.pow(e.getBody().getVelocity().getY(),2), true))
    }
    e.getBody().setLocation(new Vector(x, y));
    return;
  }

  onPlayerStop = (e : PlayerStopEvent) => {

  }

}

export enum AXIS {
  X, Y
}
