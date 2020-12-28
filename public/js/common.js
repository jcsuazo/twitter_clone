// TEXTAREA HAS A VALUE ENABLE SUBMIT BUTTON
$('#postTextarea').keyup((event) => {
  let texbox = $(event.target);
  let value = texbox.val().trim();

  let submitButton = $('#submitPostButton');
  if (submitButton.length == 0) return alert('No submit button found');
  if (value == '') {
    submitButton.prop('disabled', true);
    return;
  }

  submitButton.prop('disabled', false);
});

//SUBMIT POST TEXT AREA

$('#submitPostButton').click((event) => {
  let button = $(event.target);
  let texbox = $('#postTextarea');

  let data = {
    content: texbox.val(),
  };

  $.post('/api/posts', data, (postData) => {
    let html = createPostHtml(postData);
    $('.postsContainer').prepend(html);
    texbox.val('');
    button.prop('disabled', true);
  });
});

function createPostHtml(postData) {
  const {
    postedBy: { profilePic, username, firstName, lastName, createdAt },
    content,
  } = postData;
  const time = timeDifference(new Date(), new Date(createdAt));
  return `
    <div class='post'>
      <div class='mainContentContainer'>
        <div class='userImageContainer'>
          <img src='${profilePic}' />
        </div>
        <div class='postContenteContainer'>
          <div class='header'>
            <a href='/profile/${username}' class='displayName'>${firstName} ${lastName}</a>
            <span class='username'>@${username}</span>
            <span class='date'>${time}</span>
          </div>
          <div class='postBody'>
            <span>${content}</span>
          </div>
          <div class='postFooter'>
            <div class='postButtonContainer'>
              <button>
                <i class='far fa-comment'></i>
              </button>
            </div>
            <div class='postButtonContainer'>
              <button>
                <i class='fas fa-retweet'></i>
              </button>
            </div>
            <div class='postButtonContainer'>
              <button>
                <i class='far fa-heart'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>  
  `;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    // if (elapsed / 1000 < 30) return 'Just now';

    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}
