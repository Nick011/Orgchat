// controller for connecting and disconencting to an org
var utils = require('../lib/utils')
  , group = require('./group');

exports.connect = function(io, socket, req) {
  var org = socket.organization_room;
  socket.join(org);

  var clients = utils.userList(io.sockets.clients(org));
  var res = {
    organization: org,
    users: clients
  };

  io.sockets.in(org).emit('users', res);

};

exports.disconnect = function(io, socket, req) {
  var org = socket.organization_room;
  var groups = io.sockets.manager.roomClients[socket.id];

  //leave all groups
  for (groupId in groups) {
    groupId = groupId.substr(1);
    if (groupId.indexOf('group') >= 0) {
      group.leave(io, socket, {group_id: groupId});
    }
  }

  //leave organization room
  socket.leave(org);
  var clients = utils.userList(io.sockets.clients(org));

  var res = {
    organization: org,
    users: clients
  };
  io.sockets.in(org).emit('users', res);

};
