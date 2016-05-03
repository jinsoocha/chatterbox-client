// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages


$(document).ready(function() {
  let app = {
    server: 'https://api.parse.com/1/classes/messages',
    init: function() {
      $('#send').submit(this.handleSubmit);
    },
    send: function(message) {
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify(message)
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
    handleSubmit: function(e) {
      e.preventDefault();
      console.log('Submitting', $('#message').val());
    },
    completedFetch(message) {
      for (let result of message.results) {
        this.addMessage(result);
        console.log(result.text);
      }
    }
  };
  app.init();
  app.fetch();
});