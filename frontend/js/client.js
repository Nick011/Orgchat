define([
  'jquery',
  'lodash',
  'socketio',
  'handlebars',
  'chosen',
  'templates'
], function ($, _, socket, Handlebars, chosen, templates) {

  var initialize = function() {

    //var ROOT = '//orgchat.herokuapp.com';
    var ROOT = '//localhost:8000';

    //load css.
    (function() {
      var basePath = ROOT + '/socket.io/chat/theme';
      var customTheme = basePath + '-' + CHAT_CONNECTION.organization_id + '.css';
      var baseTheme = basePath + '.css';

      $('head')
        .append('<link rel="stylesheet" type="text/css" href="' + ROOT + '/socket.io/chat/style.css" />')
        .append('<link rel="stylesheet" type="text/css" href="' + baseTheme + '" />')
        .append('<link rel="stylesheet" type="text/css" href="' + customTheme + '" />');

    }());

    //inject chat containers
    $(CHAT_CONNECTION.container).html('<div class="chat_users_container"></div>');
    $('body').append('<div class="chat_convos_container"></div>');

    /*
    use this option to enable instant disconnect.
    var socket = io.connect('http://localhost:8000', {'sync disconnect on unload' : true});
    */

    var socket = io.connect(ROOT);

    //establish connection
    socket.emit('connect', CHAT_CONNECTION);

    var users = [];

    //listen for socket responses
    //user list
    (function() {
      var template = Handlebars.templates['users'];
      var selectTemplate = Handlebars.templates['find'];

      socket.on('users', function(res) {
        users = [];
        for (var i in res.users) {
          if (res.users[i].user_id != CHAT_CONNECTION.user_id) {
            users.push(res.users[i]);
          }
        }
        var usersHtml = template({users: users, root: ROOT});
        $('.chat_users_container').html(usersHtml);
        $('.chat_add_users').each(function() {
          var self = $(this);
          self
            .find('.chzn-container')
            .remove();

          self
            .find('select')
            .removeClass('chzn-done')
            .attr('id', '')
            .html(selectTemplate({users: users})).chosen();
        });
      });
    }());


    //handle browser events to post to server
    //create new chat / update group
    (function() {
      $('.chat_users_container').on('click', 'li', function() {
        var req = {
          socket_id: $(this).attr('id')
        };

        var currentPair = false;

        //check for current 1:1 group with this user.
        $('.chat_group_users').each(function() {
          var self = $(this);
          var memberSocketIds = [];
          
          self.find('li').each(function() {
            memberSocketIds.push($(this).attr('data-socket-id'));
          });

          if (_.indexOf(memberSocketIds, req.socket_id) >= 0) {
            if (memberSocketIds.length <= 2) {
              currentPair = true;
              self
                .next('.chat_convo_messages')
                .show()
                .closest('.chat_convo_body')
                .show()
                .prev('header')
                .find('.chat_controls')
                .children()
                .show();

              self
                .siblings('.chat_new_message_container')
                .find('textarea')
                .focus();
            }
          }
        });

        if (!currentPair) {
          socket.emit('create_group', req);
        }
      });

      var template = Handlebars.templates['convo'];
      var memberTemplate = Handlebars.templates['members'];
      var selectTemplate = Handlebars.templates['find'];
      var messageTemplate = Handlebars.templates['message'];

      function closeWindow(chatWindow) {
        var msgContainer = chatWindow.find('.chat_convo_messages');
        var msg = 'There are no users left in this chat. Closing window...';
        msgContainer.append(messageTemplate({message: msg}));

        setTimeout(function() {
          chatWindow.remove();
        }, 3000);
      }

      socket.on('group_users', function(res) {
        var groupId = res.group_id;
        var currentChatWindow = $('#' + groupId);
        if (currentChatWindow.length) {
          if (res.users.length < 2) {
            closeWindow(currentChatWindow);
          }
        }
        else {
          var convoHtml = template(res);
          $('.chat_convos_container')
            .append(convoHtml)
            .children()
            .last()
            .find('.chat_new_message')
            .focus();

          if (res.rejoin) {
            $('.chat_convo_body, .chat_convo_messages, .chat_controls > i:not(.chat_close)').hide();
          }
        }

        currentChatWindow = $('#' + groupId);
        currentChatWindow.find('.chat_title').html(_.pluck(res.users, 'username').join(', '));
        currentChatWindow.find('.chat_group_users').html(memberTemplate(res));
        currentChatWindow.find('select').html(selectTemplate({users: users})).chosen()
      });
    }());

    //send message to group
    (function() {
      $('.chat_convos_container').on('keyup', '.chat_new_message', function(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
          var self = $(this);
          var req = {
            group_id: self.parent('form').attr('data-group-id'),
            message: self.val()
          };

          socket.emit('post_group', req);
          self.val('').focus();
        }
      })
      .on('submit', 'form', function(e) {
        e.preventDefault();
      });
    }());
    

    //render new message
    (function() {
      var template = Handlebars.templates['message'];
      var original = document.title;
      var timerRunning = false;
      var winFocus = true;
      var timer;

      function notifyDing() {
        var audio = document.getElementById('audiotag1');
        audio.load();
        audio.play();
      }

      $(window)
        .focus(function() {
          clearInterval(timer);
          timerRunning = false;
          document.title = original;
          winFocus = true;
        })
        .blur(function() {
          winFocus = false;
        });
      
      socket.on('group_message', function(res) {

        var chatContainer = $('#' + res.group_id)
          , chatDisplay = chatContainer.find('.chat_convo_body').css('display')
          , msgContainer = chatContainer.find('.chat_convo_messages')
          , msgHtml = template(res);

        if (chatDisplay === 'none') {
          chatContainer.find('header').addClass('chat_notify');
        }
        
        function linkify(text) {  
          var urlRegex =/(\b(http|https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;  
          return text.replace(urlRegex, function(url) {  
            return '<a target="new" href="' + url + '">' + url + '</a>';  
          });  
        }
          
        msgContainer
          .append(linkify(msgHtml))
          .scrollTop(msgContainer[0].scrollHeight);
        
        //window notifications  
        if (!winFocus) {
          if (!timerRunning) {
            timer = window.setInterval(function() {
              document.title = (document.title == "New Message!") ? original : "New Message!";
            }, 1000);
            timerRunning = true;
          }
          notifyDing();
        }
          
      });
    }());

    //chat window controlls
    (function() {
      $('.chat_convos_container')
        .on('click', '.chat_close', function() {
          // remove a chat window
          var self = $(this);
          var groupId = self.parent('.chat_controls').attr('data-group-id');
          socket.emit('leave_group', {group_id: groupId});
          self.closest('.chat_convo_wrap').remove();
        })
        .on('click', '.chat_title', function() {
          // hide/show chat window
          $(this)
            .next('.chat_controls')
            .children('.chat_add_users, .chat_group_members')
            .toggle()
            .closest('header')
            .removeClass('chat_notify')
            .next('.chat_convo_body')
            .slideToggle('fast')
            .children('.chat_find_users, .chat_group_users')
            .hide()
            .next('.chat_convo_messages')
            .slideToggle('fast');
        })
        .on('click', '.chat_convo_wrap', function() {
          //set focus on window
          $(this)
            .find('.chat_new_message:not(.chat_find_users)')
            .focus();
        })
        .on('click', '.chat_add_users', function() {
          // hide/show options box
          $(this)
            .closest('header')
            .next('.chat_convo_body')
            .find('.chat_find_users')
            .slideToggle('fast');
        })
        .on('click', '.chat_group_members', function() {
          //hide/show groups members
          $(this)
            .closest('header')
            .next('.chat_convo_body')
            .find('.chat_group_users')
            .slideToggle('fast');
        })
        .on('submit', '.chat_add_users', function(e) {
          // add users to group
          e.preventDefault();
          var self = $(this);
          var req = {
            group_id: self.closest('.chat_convo_wrap').attr('id'),
            socket_ids: self.find('select').val()
          };

          if (req.socket_ids) {
            socket.emit('invite_group', req);
            self
              .find('.chzn-select')
              .val('')
              .trigger("liszt:updated")
              .closest('.chat_find_users')
              .slideUp();
          }
        });
    }());

  };

  return {
    initialize: initialize
  };
});
