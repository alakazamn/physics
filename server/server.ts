import { Socket } from "socket.io";
import * as express from 'express';
import { Request, Response } from "express";

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//import * as uuidv4 from "uuid/v4";
import Town from "./town";
import { GameLocation, Player, Chunk, Identity, PlayerJoinEvent, EntityMoveEvent, PlayerQuitEvent } from "./shared";

import * as _ from "lodash";

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
io.on('connection', function(socket){
  console.log('Connection');
  socket.on('login', function(uuid : string) {
      var chunk : Chunk;
      console.log("Received login... forwarding login packet")
      if(map.getPlayer(uuid)) {
        socket.player = map.getPlayer(uuid);
        chunk = map.chunks[socket.player.chunkX][socket.player.chunkY];
      } else {
        socket.player = new Player(spawnLocation.getX(),spawnLocation.getY(), new Identity("TODO", uuid)) //TODO
        map.addPlayer(socket.player);

        chunk = map.chunks[spawnLocation.chunkX][spawnLocation.chunkY];
      }
      socket.player.setOnline(true);

      socket.emit('login', socket.player)
      socket.broadcast.emit('event', new PlayerJoinEvent(socket.player, uuid + " joined the server").packet());
      console.log(uuid + " joined the server")

      emitChunk();
  });
  socket.on('event', function(eventPacket : any){
    if(eventPacket.name === "PlayerMoveEvent") {
      var to : GameLocation = GameLocation.fromPacket(eventPacket.to)
      var from : GameLocation = GameLocation.fromPacket(eventPacket.from)
      var p = map.getPlayer(Player.fromPacket(eventPacket.player).getIdentity().id)
      if(!p) return

      p.setLocation(to);
      socket.broadcast.emit('event', new EntityMoveEvent(p.getEntityID(), to, from).packet());
      //do operations to see if this is allowed
    }
  });
  socket.on('disconnect', function(){
      if(!socket.player) return;
      socket.player.setOnline(false);
      socket.broadcast.emit('event', new PlayerQuitEvent(socket.player, socket.player.getEntityID() + " left the server").packet());
      console.log(socket.player.getName() + " left the server");
  });

  const emitChunk = () => {
    console.log(map.getOnlinePlayers());
    let players = _.filter(map.getOnlinePlayers(), (elem) => { return elem.chunkX== socket.player.chunkX && elem.chunkY == socket.player.chunkY && elem.getIdentity().id !== socket.player.getIdentity().id });
    var chunk : any = _.cloneDeep(map.chunks[socket.player.chunkX][socket.player.chunkY]);
    var entities = _.cloneDeep(map.chunks[socket.player.chunkX][socket.player.chunkY].getEntities());
    for(var player of players) {
      entities.push(player);
    }
    chunk.entity = entities;
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
