
exports.static = function(io) {
  //serve static js files
  io.static.add('/chat/client.js', {file: 'public/js/client.js'});
  io.static.add('/chat/main.js', {file: 'public/js/main.js'});
  io.static.add('/chat/main-built.js', {file: 'public/js/main-built.js'});
  io.static.add('/chat/lodash.min.js', {file: 'public/js/lodash.min.js'});
  io.static.add('/chat/require-2.1.5.min.js', {file: 'public/js/require-2.1.5.min.js'});
  io.static.add('/chat/socket.io-0.9.11.js', {file: 'public/js/socket.io-0.9.11.js'});
  io.static.add('/chat/jquery-1.9.1.min.js', {file: 'public/js/jquery-1.9.1.min.js'});
  io.static.add('/chat/handlebars-runtime.js', {file: 'public/js/handlebars-runtime.js'});
  io.static.add('/chat/templates.js', {file: 'public/js/templates.js'});
  io.static.add('/chat/chosen.jquery.min.js', {file: 'public/js/chosen.jquery.min.js'});

  //serve demo
  io.static.add('/chat/demo', {
    mime: {
      type: 'text/html',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'tests/local.html'}
  );
  
  //serve static css files
  io.static.add('/chat/style.css', {
    mime: {
      type: 'text/css',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/css/style.css'}
  );
  io.static.add('/chat/theme.css', {
    mime: {
      type: 'text/css',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/css/theme.css'}
  );
  io.static.add('/chat/theme-1.css', {
    mime: {
      type: 'text/css',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/css/theme-1.css', }
  );

  //serve sprite
  io.static.add('/chat/img/chosen-sprite.png', {
    mime: {
      type: 'image/png',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/img/chosen-sprite.png'}
  );
  io.static.add('/chat/img/chosen-sprite@2x.png', {
    mime: {
      type: 'image/png',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/img/chosen-sprite@2x.png'}
  );

  // server notification sound
  io.static.add('/chat/sound/ding.wav', {
    mime: {
      type: 'audio/wav',
      gzip: true,
    },
    file: 'public/sound/ding.wav'}
  );

};
