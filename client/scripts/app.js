// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages


$(document).ready(function() {
  let app = {
    server: 'https://api.parse.com/1/classes/messages',
    init: function() {
      $('#send').submit((e) => this.handleSubmit(e));
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
        roomname: 'main'
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
      let thisMessage = $(`<div class="message-box"><div class="username">${_.escape(message.username)}</div>` +
        `<div class="message">${_.escape(message.text)}</div></div>`);
      $('#chats').append(thisMessage);
      thisMessage.find('.username').click(() => this.addFriend(message.username));
    },
    addRoom: function(roomname) {
      $('#roomSelect').append(`<div>${_.escape(roomname)}</div>`);
    },
    addFriend: function(username) {
      console.log('added Friend: ' + username);
    },
    completedFetch(data) {
      this.clearMessages();
      for (let message of data.results) {
        this.addMessage(message);
      }
    }
  };
  app.init();
  app.fetch();
});