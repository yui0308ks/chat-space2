$(function() { 
  var buildHTML = function(message) {
    if ( message.content && message.image) {
      var html = `<div class="main_chat__message_list" data-message-id=${message.id}
        <div class="upper-message">
          <div class="main_chat__up_user">
            ${message.user_name} 
          </div>
          <div class="main_chat__up_data">
            ${message.created_at}
          </div>
        </div>
        <div class="lower-message">
          <p class="lower-message__content">
            ${message.content}
          </p>
          <img src="${message.image}" class="lower-message__image" >
        </div>
      </div>`
    } else if (message.content) {
      var html = `<div class="main_chat__message_list" data-message-id=${message.id}>
        <div class="upper-message">
          <div class="main_chat__up_user">
            ${message.user_name}
          </div>
          <div class="main_chat__up_data">
            ${message.created_at}
          </div>
        </div>
        <div class="lower-message">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </div>
      </div>`
    } else if (message.image) {
      var html = `<div class="main_chat__message_list" data-message-id=${message.id}>
        <div class="upper-message">
          <div class="main_chat__up_user">
            ${message.user_name}
          </div>
          <div class="main_chat__up_data">
            ${message.created_at}
          </div>
        </div>
        <div class="lower-message">
          <img src="${message.image}" class="lower-message__image" >
        </div>
      </div>`
    };
    return html;
  };

  var reloadMessages = function() {
    last_message_id = $('.main_chat__message_list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.main_chat__message2-list').append(insertHTML);
        $('.main_chat__message2-list').animate({ scrollTop: $('.main_chat__message2-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('自動更新に失敗しました');
    });
  };
$('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main_chat__message2-list').append(html); 
      $('.main_chat__message2-list').animate({ scrollTop: $('.main_chat__message2-list')[0].scrollHeight});
      $('form')[0].reset();
      $('.main_chat__btn').prop("disabled", false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
}); 
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});