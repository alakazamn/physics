import Identity from "./social/identity";
import Entity from "./entity";
import { Direction } from "./direction";

export default class Player extends Entity {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 32;

  constructor(x:number, y:number, identity: Identity) {
    super(x,y,Player.WIDTH,Player.HEIGHT);
  }
}
