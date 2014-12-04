var lo = require('lodash');

exports.userList = function(clients) {
  clients = lo.groupBy(clients, function(client) { return client.user_id; });
  var connectedUsers = [];

  for (key in clients) {
    /*
      use most recent connection. otherwise, you
      see duplicate usernames until heartbeat fires
      and they disconnect. only required for long-polling
    */
    var i = clients[key].length - 1;
    var client = clients[key][i];

    //create collection of active users
    connectedUsers.push({
      socket_id: client.id,
      user_id: client.user_id,
      organization_id: client.organization_id,
      username: client.username,
      groups: client.groups
    });
  }

  return connectedUsers;
};

