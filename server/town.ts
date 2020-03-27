import * as _ from "lodash";
import { Chunk, Player } from "./shared";

export default class Town {
  public constructor(public chunks : Chunk[][], public players : Player[]) {

  }
  public addPlayer(player : Player) {
    this.players.push(player);
  }
  public getPlayer(playerID : string) {
    let index = _.findIndex(this.players, (a) => { return a.getIdentity().id === playerID})
    if(index === -1) return null;
    else return this.players[index];
  }
  public getOnlinePlayers() : Player[] {
    return _.filter(this.players, (a) => { return a.isOnline() === true})
  }
  public replaceChunk = (x:number, y:number, chunk:Chunk) => {
    this.chunks[x][y] = chunk;
  }
  public rows = () : number => {
    return this.chunks.length;
  }
  public columns = () : number => {
    return this.chunks[0].length;
  }

}
