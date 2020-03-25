var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var serverVersion = "0.1";

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('login', function(){
      socket.emit('login', [socket.id, serverVersion]);
  });
  socket.on('disconnect', function(){
    console.log('A slime vanished.');
    socket.broadcast.emit('disconnect', socket.id);
  });
  socket.on('slime', function(msg){
    msg[3] = socket.id;
    socket.broadcast.emit('slime', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
