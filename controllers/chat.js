//controller for sending chat messages

exports.group = function(io, socket, req) {
  var groupId = req.group_id;
  var res = {
      group_id: groupId,
      username: socket.username,
      message: req.message
    };

  var clients = io.sockets.clients(groupId);

  io.sockets.in(groupId).emit('group_message', res);
};
