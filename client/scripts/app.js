// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages


$(document).ready(function() {
  let app = {
    server: 'https://api.parse.com/1/classes/messages',
    rooms: {},
    currentRoom: 'ALL ROOMS',
    friends: {},
    init: function() {
      $('#send').submit((e) => this.handleSubmit(e));
      this.addRoom(this.currentRoom);
      $('#roomSelect').change(() => {
        this.currentRoom = $('#roomSelect option:selected').text();
        this.selectRoom();
      });    
      $('#newroom').click(() => {
        let q = prompt('Add a new room');
        this.addRoom(q);
        this.currentRoom = q;
        $('#roomSelect option:selected').attr('selected', null);
        $(`#roomSelect option[value = ${q}]`).attr('selected', 'selected');
        this.selectRoom();
      });
    },
    send: function(message) {
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: () => {
          this.fetch();
        },
        error: (data) => console.error('chatterbox: Failed to send message', data)
      });
    },
    handleSubmit: function(e) {
      e.preventDefault();
      this.send({
        username: window.location.search.slice(10),
        text: $('#message').val(),
        roomname: this.currentRoom === 'ALL ROOMS' ? undefined : this.currentRoom
      });
    },
    fetch: function() {
      $.ajax({
        url: this.server,
        type: 'GET',
        contentType: 'application/json',
        success: (data) => this.completedFetch(data),
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
      thisMessage.find('.username').click(() => this.toggleFriend(message.username));
    },
    addRoom: function(roomname) {
      this.rooms[roomname] = this.rooms[roomname] ||
        $('#roomSelect').append(`<option value=${_.escape(roomname)}>${_.escape(roomname)}</option>`);
    },
    toggleFriend: function(username) {
      if (username !== window.location.search.slice(10)) {
        if (username in this.friends) {
          console.log('removed Friend: ' + username);
          delete this.friends[username];
          $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'normal');
        } else {
          console.log('added Friend: ' + username);
          this.friends[username] = username;
          $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'bold');
        }
      }
    },
    completedFetch(data) {
      this.clearMessages();
      for (let message of data.results) {
        this.addMessage(message);
        this.addRoom(message.roomname);
      }
      this.selectRoom();
      for (username in this.friends) {
        $(`.username[data-username="${_.escape(username)}"]`).css('font-weight', 'bold');
      }
    },
    selectRoom() {
      if (this.currentRoom === 'ALL ROOMS') {
        $('#chats .message-box').slideDown();  
      } else {
        $(`#chats .message-box:not([data-roomname="${_.escape(this.currentRoom)}"])`).slideUp();
        $(`#chats .message-box[data-roomname="${_.escape(this.currentRoom)}"]`).slideDown();
      }
    }
  };
  app.init();
  app.fetch();
});