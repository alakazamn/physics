import Dispatch from "./dispatch";
import { PlayerPacket, PlayerLoginEvent, Player, ChunkEvent, Chunk, GameLocation, EntityMoveEvent, PlayerJoinEvent, PlayerQuitEvent, PlayerMoveEvent } from "../shared";

export default class SocketHandler {
  //modifiable

  private static instance : SocketHandler;
  socket: SocketIOClient.Socket;

  private constructor() {}

  public static getInstance() : SocketHandler {
    if(!SocketHandler.instance) {
      SocketHandler.instance = new SocketHandler();
    }
    return SocketHandler.instance;
  }

  public load() {
    this.socket = io();

    console.log("Setting up socket...");

    var name = prompt("What's your name?");
    this.socket.emit('login', name);
    this.socket.on('login', (playerPacket : PlayerPacket) => {
      Dispatch.fire(new PlayerLoginEvent(Player.fromPacket(playerPacket)));
    });

    this.socket.on('chunk', (chunkPacket: any) => {
      console.log("Downloading chunk...")
      console.log(Chunk.fromPacket(chunkPacket))
      Dispatch.fire(new ChunkEvent(Chunk.fromPacket(chunkPacket)));
    });

    this.socket.on('event', (eventPacket: any) => {
      if(eventPacket.name === "EntityMoveEvent") {
        var to : GameLocation = GameLocation.fromPacket(eventPacket.to)
        var from : GameLocation = GameLocation.fromPacket(eventPacket.from)
        var entity = eventPacket.entityID
        Dispatch.fire(new EntityMoveEvent(entity, to, from));
      }
      else if(eventPacket.name === "PlayerJoinEvent") {
        var player = Player.fromPacket(eventPacket.player);
        var message = eventPacket.joinMessage;
        Dispatch.fire(new PlayerJoinEvent(player, message));
      }
      else if(eventPacket.name === "PlayerQuitEvent") {
        console.log(eventPacket)
        var player = Player.fromPacket(eventPacket.player);
        var message = eventPacket.quitMessage;
        Dispatch.fire(new PlayerQuitEvent(player, message));
      }

      //Dispatch.fire(event);
    });

    Dispatch.addEventListener("PlayerMoveEvent",this.onPlayerMove); //can addPriorityListener if looking to do collisions somewhere else
  }

  onPlayerMove = (e : PlayerMoveEvent) => {
    this.socket.emit('event', e.packet());
  }
}
