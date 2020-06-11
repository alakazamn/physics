import { PhysicalObject } from "./Engine";

/*
  Represents the player, which is just a physical object with a constant
  WIDTH, HEIGHT, and MASS.

  Plus, we store whether or not the player is moving and jumping, so
  we can change the sprite (picture) for each state
*/

export class Player extends PhysicalObject {
  public static readonly WIDTH = 96;
  public static readonly HEIGHT = 96;
  public static readonly METRIC_HEIGHT = 3;
  public static MASS = 62; //kg

  constructor(x:number, y:number, private moving = false, private jumping : boolean = false) {
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
}