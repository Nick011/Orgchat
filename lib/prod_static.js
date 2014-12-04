exports.static= function(io) {
  //serve static js files
  io.static.add('/chat/main-built.js', {file: 'public/js/main-built.js'});
  io.static.add('/chat/require-2.1.5.min.js', {file: 'public/js/require-2.1.5.min.js'});

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
  io.static.add('/chat/theme-129.css', {
    mime: {
      type: 'text/css',
      encoding: 'utf8',
      gzip: true,
    },
    file: 'public/css/theme-129.css', }
  );

// serve sprite
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
