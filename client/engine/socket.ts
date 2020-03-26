import Renderer from "../graphics/Renderer";
import Core from "./core";
import Keyboard from "./keyboard";
import GameEvent from "../../shared/event/event";
import { PlayerPacket } from "../../shared/packet/PlayerPacket";
import Player from "../../shared/player";
import PlayerLoginEvent from "../../shared/event/PlayerLoginEvent";
import Identity from "../../shared/social/identity";
import Dispatch from "./dispatch";
import Chunk from "../../shared/chunk";
import { chunk } from "lodash";
import ChunkEvent from "../../shared/event/ChunkEvent";
import PlayerMoveEvent from "../../shared/event/PlayerMoveEvent";
import GameLocation from "../../shared/location";
import EntityMoveEvent from "../../shared/event/EntityMoveEvent";
import PlayerJoinEvent from "../../shared/event/PlayerJoinEvent";
import PlayerQuitEvent from "../../shared/event/PlayerQuitEvent";
const uuidv4 = require("uuid/v4")

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
      console.log("Received server data: " + JSON.stringify(eventPacket))
      if(eventPacket.name === "EntityMoveEvent") {
        var to : GameLocation = GameLocation.fromPacket(eventPacket.to)
        var from : GameLocation = GameLocation.fromPacket(eventPacket.from)
        var entity = eventPacket.entityID
        Dispatch.fire(new EntityMoveEvent(entity, to, from));
      }
      else if(eventPacket.name === "PlayerJoinEvent") {
        var player = Player.fromPacket(eventPacket.player);
        var message = eventPacket.message;
        Dispatch.fire(new PlayerJoinEvent(player, message));
      }
      else if(eventPacket.name === "PlayerQuitEvent") {
        var player = Player.fromPacket(eventPacket.player);
        var message = eventPacket.message;
        Dispatch.fire(new PlayerQuitEvent(player, message));
      }

      //Dispatch.fire(event);
    });

    Dispatch.addEventListener("PlayerMoveEvent",this.onPlayerMove); //can addPriorityListener if looking to do collisions somewhere else
  }

  onPlayerMove = (e : PlayerMoveEvent) => {
    console.log(e.packet());
    this.socket.emit('event', e.packet());
  }
}
