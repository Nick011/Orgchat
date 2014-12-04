({
  baseUrl: ".",
  paths: {
     // libraries path
    'jquery': 'jquery-1.9.1.min',
    'lodash': 'lodash.min',
    'handlebars': 'handlebars-runtime',
    'templates': 'templates',
    'socketio': 'socket.io-0.9.11',
    'chosen': 'chosen.jquery.min'
  },
  mainConfigFile: 'main.js',
  optimizeAllPluginResources: true,
  name: 'main',
  out: '../../public/js/main-built.js'
})
