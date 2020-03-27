import { IdentityPacket } from "../shared";

export class Identity {

  constructor(public name:String, public id: string) {

  }
  public static fromPacket = (identityPacket : IdentityPacket) : Identity => {
      return new Identity(identityPacket.name, identityPacket.id);
  }
}
