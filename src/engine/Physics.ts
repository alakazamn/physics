import Dispatch from "./Dispatch";

import Core from "./Core";
import { GameState } from "./Core"
import { Player, Force, Surface } from "./Engine";
import { EventResult, PlayerJumpEvent, PhysicsMoveEvent, PlayerDeathEvent } from "../event/Events";
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
    if(Core.getInstance().checkCollision(e.getPlayer().getX(), e.getPlayer().getY()+1,chunk) 
      || e.getPlayer().hasJumps()) { //only allow if on ground
       //unrealistic, but otherwise the game is unplayable...
       //the player needs to be able to jump at least 1m, which
       //in real life is impossible...
      e.getPlayer().applyImpulse(new Force(Math.PI/2, 1500), 0.8);
      e.getPlayer().setJumping(true);
      e.getPlayer().subJumps();
    } else {
      e.setResult(EventResult.DENY)
    }
  }

  /*
    Called when the velocity of an object causes that object to move
  */
  onPhysicsMove = (e : PhysicsMoveEvent) => {

    //if the user is dead, disallow left/right movement
    if(Core.getInstance().currentState() == GameState.DEATH) {
      e.getBody().setLocation(new Vector(e.getFrom().getX(), e.getTo().getY()));
      return;
    }

    let chunk = Core.getInstance().currentChunk(); 


    /*
      Collision handling for the player and the ground


      This gets a little complicated, but to check for collisions at discrete time intervals, 
      the system has to check for collisions retroactively, so that we don't miss a collision because
      we're only sampling every 1/20th of a second

      Thus, we basically step one unit at a time in each direction, checking if there's a collision.
    */
    
    let xDT = e.getTo().getX() - e.getFrom().getX();
    let yDT = e.getTo().getY() - e.getFrom().getY();

    // At smallest, the steps should be at a 1:1 with pixels
    // I thought of this like the thing in chem where you have to
    // come up with a formula from masses, and you divide until you get
    // whole numbers 
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
      if(xDT != 0 && Core.getInstance().checkCollision(x + (xDT / steps),y,chunk)) {
        xDT = 0;
        //If the player rams into a wall, mark them dead
        e.getBody().clearForces();
        e.getBody().applyImpulse(new Force(Math.PI/2, 1500),0.5); //death animation
        Dispatch.fire(new PlayerDeathEvent(e.getBody() as Player));
        //e.getBody().stopH();
        e.setResult(EventResult.DENY);
        if(e.getBody() instanceof Player) {
          (e.getBody() as Player).setMoving(false);
          (e.getBody() as Player).setJumping(true); //death animation
        }
      }
      if(yDT !=0 && Core.getInstance().checkCollision(x,y + (yDT / steps),chunk)) {
        yDT = 0;
        e.getBody().stopV();
        if(e.getBody() instanceof Player) {
          (e.getBody() as Player).setJumping(false);
          (e.getBody() as Player).resetJumps();
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
      if(Core.getInstance().checkCollision(e.getBody().getX(), e.getBody().getY()+1,chunk) && Math.abs(e.getBody().getVelocity().getX()) > 0) {
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

    if(e.getBody() instanceof Player && y > Chunk.HEIGHT  * Tile.HEIGHT) { //if the player falls into the void, mark them dead.
      e.getBody().clearForces();
      e.getBody().applyImpulse(new Force(Math.PI/2, 1500),0.5); //death animation
      Dispatch.fire(new PlayerDeathEvent(e.getBody() as Player)); 
      (e.getBody() as Player).setJumping(true); //death animation
    }
    return;
  }

}

export enum AXIS {
  X, Y
}
