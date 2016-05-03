// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages


$(document).ready(function() {
  let app = {
    server: 'https://api.parse.com/1/classes/messages',
    rooms: {},
    currentRoom: "",
    init: function() {
      $('#send').submit((e) => this.handleSubmit(e));
      $('#roomSelect').change((e) => this.selectRoom(e));
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
        text: $('#message').val()
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
      let thisMessage = $(`<div class="message-box" data-roomname="${_.escape(message.roomname)}"><div class="username">${_.escape(message.username)}</div>` +
        `<div class="roomname">${_.escape(message.roomname)}</div>` +        
        `<div class="message">${_.escape(message.text)}</div></div>`);
      $('#chats').append(thisMessage);
      thisMessage.find('.username').click(() => this.addFriend(message.username));
    },
    addRoom: function(roomname) {
      this.rooms[roomname] = this.rooms[roomname] ||
        $('#roomSelect').append(`<option>${_.escape(roomname)}</option>`);
    },
    addFriend: function(username) {
      console.log('added Friend: ' + username);
    },
    completedFetch(data) {
      this.clearMessages();
      this.rooms = {};
      this.addRoom('ALL ROOMS');
      for (let message of data.results) {
        this.addMessage(message);
        this.addRoom(message.roomname);
      }
    },
    selectRoom(e) {
      this.currentRoom = $('#roomSelect option:selected').text();
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