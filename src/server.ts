import { Socket } from "socket.io";

import * as express from 'express';
import { Request, Response } from "express";
import Chunk from "../shared/chunk";

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket: Socket){
  console.log('Connection');
  socket.on('login', function(){
      socket.emit('chunk', randomChunk(100, 100));
  });
  socket.on('disconnect', function(){
    console.log('Quit.');
    //socket.broadcast.emit('disconnect', socket.id);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function randomChunk(width : number, height : number) : Chunk {
  var tiles : number[][] = [];
  for(var x = 0; x<width; x++) {
    tiles[x] = [];
    for(var y = 0; y<height; y++) {
      tiles[x][y] = Math.round(Math.random());
    }
  }
  return new Chunk(tiles, []);
}
