var cluster = require('cluster')
  , http = require('http')
  , sio = require('socket.io')
  , lo = require('lodash')
  , redis = require('redis')
  , RedisStore = sio.RedisStore
  , organization = require('./controllers/organization')
  , chat = require('./controllers/chat')
  , group = require('./controllers/group')
  , util = require('util')
  , argv = require('yargs').argv
  , port = argv.port || process.env.PORT || 8000
  , DEV = argv.dev || process.env.DEV || false;

//else it's a worker process, boot up a server
var httpServer = http.createServer().listen(port)
  , io = sio.listen(httpServer);

//configure redis
var redisOptions = {
  port: argv.redis_port || 6379, 
  hostname: argv.redis_host || '127.0.0.1', 
  password: argv.redis_password || ''
};

var pub = redis.createClient(redisOptions.port, redisOptions.hostname);
pub.auth(redisOptions.password);
var sub = redis.createClient(redisOptions.port, redisOptions.hostname);
sub.auth(redisOptions.password);
var client = redis.createClient(redisOptions.port, redisOptions.hostname);
client.auth(redisOptions.password);


// configure socket.io
io.configure(function() {
  //create redis connection, set options
  var redisStore = new RedisStore({redis: redis,
                                   redisPub: pub,
                                   redisSub: sub,
                                   redisClient: client});

  io.set('store', redisStore);
  io.set('transports', ['xhr-polling']);
  io.set('close timeout', 30);
  io.set('hearbeat timeout', 28);
  io.set('hearbeat interval', 15);
  io.set("polling duration", 10);
  io.set('log level', 0);


  if (DEV) {
    require('./lib/dev_static').static(io);
  }
  else {
    require('./lib/prod_static').static(io);
  }

});


//socket.io routing
io.sockets.on('connection', function(socket) {
  //on connection, call connect and pass a dict
  //ex {username: (username), user_id: (uid) organization_id: (orgid)}
  socket.on('connect', function(req) {
    // append user attributes to the socket obj
    for (var i in req) {
      socket[i] = req[i];
    }

    socket.organization_room = 'org-' + req.organization_id;
    organization.connect(io, socket, req);

    // rejoin groups after page navigate or refresh
    group.rejoin(io, socket);
  });

  //handle user disconnect
  socket.on('disconnect', function() {
    if (!lo.isUndefined(socket.username)) {
      organization.disconnect(io, this);
    }
  });

  //handle post routes
  socket.on('post_group', function(req) {
    chat.group(io, socket, req);
  });

  socket.on('create_group', function(req) {
    group.create(io, socket, req);
  });

  socket.on('invite_group', function(req) {
    group.invite(io, socket, req);
  });

  socket.on('leave_group', function(req) {
    group.leave(io, socket, req);
  });

});
