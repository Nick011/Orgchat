var require = requirejs.config({
  paths: {
    jquery: 'http://localhost:8000/socket.io/chat/jquery-1.9.1.min',
    lodash: 'http://localhost:8000/socket.io/chat/lodash.min',
    handlebars: 'http://localhost:8000/socket.io/chat/handlebars-runtime',
    templates: 'http://localhost:8000/socket.io/chat/templates',
    chosen: 'http://localhost:8000/socket.io/chat/chosen.jquery.min',
    socketio: 'http://localhost:8000/socket.io/chat/socket.io-0.9.11'
  },
  shim: {
    handlebars: {
      exports: 'Handlebars'
    },
    templates: {
      deps: ['handlebars']
    },
    chosen: {
      deps: ['jquery']
    }
  }
});

require([
  'client',
], function(Client) {
  $.noConflict(true);
  Client.initialize();
});
