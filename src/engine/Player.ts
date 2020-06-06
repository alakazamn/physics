import { Entity, EntityType } from "../Engine";

export class Player extends Entity {
  public static readonly WIDTH = 96;
  public static readonly HEIGHT = 96;
  public static readonly METRIC_HEIGHT = 3;
  public static readonly MASS = 62; //kg
  constructor(x:number, y:number, private jumping : boolean = false) {
    super(x,y,Player.WIDTH,Player.HEIGHT, Player.MASS, "player", EntityType.PLAYER);
  }

  setJumping = (jumping : boolean) => {
    this.jumping = jumping;
  }
  getJumping = () => {
    return this.jumping;
  }

}
