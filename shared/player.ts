import { Entity, PlayerPacket, Identity, EntityType } from "./shared";

export class Player extends Entity {
  public static readonly WIDTH = 16;
  public static readonly HEIGHT = 32;

  constructor(x:number, y:number, private identity: Identity, private online: Boolean = true) {
    super(x,y,Player.WIDTH,Player.HEIGHT,identity.id, EntityType.PLAYER);
  }
  isOnline() {
    return this.online;
  }
  setOnline(online : Boolean) {
    this.online = online;
  }
  getName() {
    return this.identity.name;
  }
  getIdentity() {
    return this.identity;
  }
  public static fromPacket = (playerPacket : PlayerPacket) : Player => {
      return new Player(playerPacket.x, playerPacket.y, new Identity(playerPacket.identity.name, playerPacket.identity.id))
  }
}
