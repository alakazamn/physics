import { PhysicalObject } from "./Engine";

/*
  Represents the player, which is just a physical object with a constant
  WIDTH, HEIGHT, and MASS.

  Plus, we store whether or not the player is moving and jumping, so
  we can change the sprite (picture) for each state

  There are some other parameters here that just keep 
  track of where in the animation we are
*/

export class Player extends PhysicalObject {
  public static readonly WIDTH = 48;
  public static readonly HEIGHT = 96;
  public static readonly METRIC_HEIGHT = 3;
  public static MASS = 62; //kg
  private internalFrameState = 0;

  constructor(x:number, y:number, private moving = false, private jumping : boolean = false, private animationState = 0, private frameLimit = 0) {
    super(x,y,Player.WIDTH,Player.HEIGHT, Player.MASS);
  }
  setMoving = (moving : boolean) => {
    this.moving = moving;
  }
  getMoving = () => {
    return this.moving;
  }
  
  setJumping = (jumping : boolean) => {
    this.jumping = jumping;
  }
  getJumping = () => {
    return this.jumping;
  }
  setFrameLimit = (limit : number) => {
    if(this.frameLimit != limit) {
      this.animationState = 0;
    }
    this.frameLimit = limit;
  }
  frame = () => {
    this.internalFrameState++;
    if(this.internalFrameState == 6) {
      this.animationState ++;
      this.internalFrameState = 0;
    }
    if(this.animationState > this.frameLimit) {
      this.animationState = 0;
    }
    return this.animationState;
  }
}