// controller for groups
var lo = require('lodash')
  , uuid = require('node-uuid')
  , utils = require('../lib/utils');


exports.create = function(io, socket, req) {
  //find peer socket
  var peers = io.sockets.clients(socket.organization_room);
  var peer = lo.find(peers, function(p) { return p.id == req.socket_id; });
  var groupId = 'group-' + uuid.v4();

  socket.join(groupId);
  peer.join(groupId);

  var clients = utils.userList(io.sockets.clients(groupId));

  var res = {
    group_id: groupId,
    users: clients,
    rejoin: false
  };

  io.sockets.in(groupId).emit('group_users', res);
};


exports.invite = function(io, socket, req) {
  
  var groupId = req.group_id
    , socketIds = req.socket_ids
    , res = {
        group_id: groupId,
        rejoin: false
      };

  var peers = io.sockets.clients(socket.organization_room);
  var invitedSockets = lo.filter(peers, function(p) { return socketIds.indexOf(p.id) >= 0; });

  invitedSockets.forEach(function(sock) {
    sock.join(groupId);
    res.users = utils.userList(io.sockets.clients(groupId));
    res.message = sock.username + ' has joined the chat.';
    io.sockets.in(groupId).emit('group_users', res);
    io.sockets.in(groupId).emit('group_message', res);
  });
};


exports.rejoin = function(io, socket) {
  /* 
    check for groups a client may have been 
    a part of on a previous page and subscribe
    them to the same group.
  */
  var groups = io.sockets.manager.rooms;
  for (var groupId in groups) {
    groupId = groupId.slice(1);
    if (groupId.indexOf('org') < 0 && groupId) {
      var clients = utils.userList(io.sockets.clients(groupId));
      var userIds = lo.pluck(clients, 'user_id');

      if (userIds.indexOf(socket.user_id) >= 0 && userIds.length > 1) {
        socket.join(groupId);
        var res = {
          users: utils.userList(clients),
          group_id: groupId,
          rejoin: true
        };
        socket.emit('group_users', res);
      }
    }
  }

  return socket.groups;
};


exports.leave = function(io, socket, req) {
  var groupId = req.group_id;

  socket.leave(groupId);

  var groupUsers = utils.userList(io.sockets.clients(groupId));
  var res = {
    users: groupUsers,
    group_id: groupId,
    rejoin: false,
    message: socket.username + ' has left the group.'
  };

  var rejoined = (lo.pluck(groupUsers, 'user_id').indexOf(socket.user_id) >= 0);

  if (!rejoined) {
    socket.broadcast.to(groupId).emit('group_message', res);
    socket.broadcast.to(groupId).emit('group_users', res);
  }
};
