// YOUR CODE HERE:

//https://api.parse.com/1/classes/messages
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
      type: 'GET'
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message) {
    let thisMessage = $(`<div><div class="username">${message.username}</div>` +
      `<div class="message">${message.text}</div></div>`);
    $('#chats').append(thisMessage);
    thisMessage.find('.username').click(() => this.addFriend(message.username));
  },
  addRoom: function(roomname) {
    $('#roomSelect').append(`<div>${roomname}</div>`);
  },
  addFriend: function(username) {
    console.log('added Friend: ' + username);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log('Submit');
  }
};