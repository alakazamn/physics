import { Socket } from "socket.io";

import * as express from 'express';
import { Request, Response } from "express";
import Chunk from "../shared/chunk";
import PlayerJoinEvent from "../shared/event/PlayerJoinEvent";
import Player from "../shared/player";
import Identity from "../shared/social/identity";
import PlayerQuitEvent from "../shared/event/PlayerQuitEvent";

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
import * as uuidv4 from "uuid/v4";
import GameLocation from "../shared/location";
import Town from "./town";
import _ = require("lodash");
import PlayerMoveEvent from "../shared/event/PlayerMoveEvent";
import EntityMoveEvent from "../shared/event/EntityMoveEvent";

var serverVersion = "0.1";

app.get('/', function(req: Request, res: Response){
  res.sendFile(__dirname + '/index.html');
});

app.get('/client.js', function(req: Request, res: Response){
  res.sendFile(__dirname + '/client.js');
});

io.set('authorization', function (handshakeData, callback) {
  // make sure the handshake data looks good
  callback(null, true); // error first, 'authorized' boolean second
});

console.log("Generating a random map...")
var map = randomTown(10, 10);
var spawnLocation = new GameLocation(100, 100, 0, 0);

console.log("Setting up socket...")
io.on('connection', function(socket: Socket){
  var player : Player;
  var id : string;
  console.log('Connection');
  socket.on('login', function(uuid : string) {
      id = uuid;
      var chunk : Chunk;
      console.log("Received login... forwarding login packet")
      if(map.getPlayer(uuid)) {
        player = map.getPlayer(uuid);
        chunk = map.chunks[player.chunkX][player.chunkY];
      } else {
        player = new Player(spawnLocation.getX(),spawnLocation.getY(), new Identity("TODO", uuid)) //TODO
        map.addPlayer(player);

        chunk = map.chunks[spawnLocation.chunkX][spawnLocation.chunkY];
      }
      player.setOnline(true);

      socket.emit('login', player)
      socket.broadcast.emit('event', new PlayerJoinEvent(player, uuid + " joined the server").packet());
      console.log(uuid + " joined the server")

      emitChunk();
  });
  socket.on('event', function(eventPacket : any){
    if(eventPacket.name === "PlayerMoveEvent") {
      var to : GameLocation = GameLocation.fromPacket(eventPacket.to)
      var from : GameLocation = GameLocation.fromPacket(eventPacket.from)
      var player = map.getPlayer(Player.fromPacket(eventPacket.player).getIdentity().id)
      player.setLocation(to);

      socket.broadcast.emit('event', new EntityMoveEvent(player.getEntityID(), to, from).packet());
      //do operations to see if this is allowed
    }
  });
  socket.on('disconnect', function(){
    if(player) {
      player.setOnline(false);
      socket.broadcast.emit('event', new PlayerQuitEvent(player, player.getName() + " left the server").packet());
      console.log(player.getName() + "left the server");

    }
  });

  const emitChunk = () => {
    console.log(map.getOnlinePlayers());
    let players = _.filter(map.getOnlinePlayers(), (elem) => { return elem.chunkX== player.chunkX && elem.chunkY == player.chunkY && elem.getIdentity().id !== player.getIdentity().id });
    var chunk : any = _.cloneDeep(map.chunks[player.chunkX][player.chunkY]);
    var entities = _.cloneDeep(map.chunks[player.chunkX][player.chunkY].getEntities());
    for(player of players) {
      entities.push(player);
    }
    console.log(JSON.stringify(entities));
    chunk.entity = entities;
    console.log(JSON.stringify(chunk));
    socket.emit('chunk', chunk);
  }
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function randomTown(width: number, height: number) : Town {
  const chunkGenerators = [randomChunk]

  var chunks : Chunk[][] = [];
  for(var x = 0; x<width; x++) {
    chunks[x] = [];
    for(var y = 0; y<height; y++) {
      chunks[x][y] = chunkGenerators[Math.floor(Math.random() * chunkGenerators.length)](100,100);
    }
  }
  return new Town(chunks, []);
}
function touching(i : number,  j : number, tiles : number[][]) : number {
    var count = 0;
   if(j != 0)  // to the top
     if(tiles[i][j-1] == 1) count++;
   if(i != 0)
     if(tiles[i-1][j] == 1) count++;
   if(j!=0 && i!=0)
     if(tiles[i-1][j-1] == 1) count++;
   if(i!=tiles.length-1)
       if(tiles[i+1][j] == 1) count+=2;

  if(count == 1) {
    count = 3;
  }
  return count;
}
function randomChunk(width : number, height : number) : Chunk {
  var tiles : number[][][] = [];
  for(var x = 0; x<width; x++) {
    tiles[x] = [];
    for(var y = 0; y<height; y++) {
      tiles[x][y] = [];
      tiles[x][y][0] = Math.floor(Math.random() * 2);

      if(tiles[x][y][0] == 0) {
        tiles[x][y][1] = Math.random() > .5 ? 2 : -1;
      } else {
        tiles[x][y][1] = -1;
      }
    }
  }
  return new Chunk(tiles, []);
}
