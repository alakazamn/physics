import Identity from "./social/identity";
import Entity from "./entity";
import { Direction } from "./direction";

export default class Player extends Entity {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 32;

  private WALK_SPEED = 16;
  constructor(x:number, y:number, identity: Identity) {
    super(x,y,Player.WIDTH,Player.HEIGHT);
  }

  walk = (direction : Direction) => {
    if(direction == Direction.LEFT) {
      this.setX(this.getX()-this.WALK_SPEED);
    } else if(direction == Direction.RIGHT) {
      this.setX(this.getX()+this.WALK_SPEED);
    } else if(direction == Direction.UP) {
      this.setY(this.getY()-this.WALK_SPEED);
    } else if(direction == Direction.DOWN) {
      this.setY(this.getY()+this.WALK_SPEED);
    }
  }
}
