// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages


$(document).ready(function() {
  let app = {
    server: 'https://api.parse.com/1/classes/messages',
    rooms: {},
    currentRoom: 'ALL ROOMS',
    friends: {},
    init: function() {
      $('#send').submit((e) => app.handleSubmit(e));
      app.addRoom(app.currentRoom);
      $('#roomSelect').change(() => {
        app.currentRoom = $('#roomSelect option:selected').text();
        app.selectRoom();
      });    
      $('#newroom').click(() => {
        let q = prompt('Add a new room');
        app.addRoom(q);
        app.currentRoom = q;
        $('#roomSelect option:selected').attr('selected', null);
        $(`#roomSelect option[value = ${q}]`).attr('selected', 'selected');
        app.selectRoom();
      });
      app.fetch();
      setInterval(() => {
        app.fetch();
      }, 3000);
    },
    send: function(message) {
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: () => {
          app.fetch();
        },
        error: (data) => console.error('chatterbox: Failed to send message', data)
      });
    },
    handleSubmit: function(e) {
      e.preventDefault();
      app.send({
        username: window.location.search.slice(10),
        text: $('#message').val(),
        roomname: app.currentRoom === 'ALL ROOMS' ? undefined : app.currentRoom
      });
    },
    fetch: function() {
      $.ajax({
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        data: {where: JSON.stringify({
          roomname: app.currentRoom === 'ALL ROOMS' ? undefined : app.currentRoom
        })},
        success: (data) => app.completedFetch(data),
        error: (data) => console.error('chatterbox: Failed to fetch messages', data)
      });
    },
    clearMessages: function() {
      $('#chats').html('');
    },
    addMessage: function(message) {
      let thisMessage = $(`<div class="message-box" data-roomname="${_.escape(message.roomname)}">
        <div class="username" data-username="${_.escape(message.username)}">${_.escape(message.username)}</div>` +
        `<div class="roomname">${_.escape(message.roomname)}</div>` +        
        `<div class="message">${_.escape(message.text)}</div></div>`);
      $('#chats').append(thisMessage);
      thisMessage.find('.username').click(() => app.toggleFriend(message.username));
    },
    addRoom: function(roomname) {
      app.rooms[roomname] = app.rooms[roomname] ||
        $('#roomSelect').append(`<option value=${_.escape(roomname)}>${_.escape(roomname)}</option>`);
    },
    toggleFriend: function(username) {
      if (username !== window.location.search.slice(10)) {
        if (username in app.friends) {
          console.log('removed Friend: ' + username);
          delete app.friends[username];
          $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'normal');
        } else {
          console.log('added Friend: ' + username);
          app.friends[username] = username;
          $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'bold');
        }
      }
    },
    completedFetch(data) {
      app.clearMessages();
      for (let message of data.results) {
        app.addMessage(message);
        app.addRoom(message.roomname);
      }
      app.selectRoom();
      for (username in app.friends) {
        $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'bold');
      }
    },
    selectRoom() {
      if (app.currentRoom === 'ALL ROOMS') {
        $('#chats .message-box').slideDown();  
      } else {
        $(`#chats .message-box:not([data-roomname="${_.escape(app.currentRoom)}"])`).hide();
        $(`#chats .message-box[data-roomname="${_.escape(app.currentRoom)}"]`).slideDown();
      }
    }
  };
  app.init();
});