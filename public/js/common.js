// TEXTAREA HAS A VALUE ENABLE SUBMIT BUTTON
$('#postTextarea, #replyTextarea').keyup((event) => {
  let texbox = $(event.target);
  let value = texbox.val().trim();

  let isModal = texbox.parents('.modal').length == 1;

  let submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton');
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

$('#replyModal').on('show.bs.modal', (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostIdFromElement(button);

  $.get(`/api/posts/${postId}`, (results) => {
    outputPosts(results, $('#originalPostContainer'));
  });
});

$('#replyModal').on('hidden.bs.modal', () => {
  $('#originalPostContainer').html('');
});

// ADD A LIKE
$(document).on('click', '.likeButton', (event) => {
  let button = $(event.target);
  let postId = getPostIdFromElement(button);
  if (postId === undefined) return;
  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: 'PUT',
    success: (postData) => {
      button.find('span').text(postData.likes.length || '');
      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    },
  });
});

// ADD A RETWEET
$(document).on('click', '.retweetButton', (event) => {
  let button = $(event.target);
  let postId = getPostIdFromElement(button);
  if (postId === undefined) return;
  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: 'POST',
    success: (postData) => {
      button.find('span').text(postData.retweetUsers.length || '');

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    },
  });
});
//Get post id form the post element
function getPostIdFromElement(element) {
  let isRoot = element.hasClass('post');
  let rootElement = isRoot ? element : element.closest('.post');
  let postId = rootElement.data().id;
  if (postId !== undefined) {
    return postId;
  }
}
function createPostHtml(postData) {
  let isRetweet = postData.retweetData !== undefined;

  let retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  const {
    postedBy: { profilePic, username, firstName, lastName, createdAt },
    content,
  } = postData;

  const time = timeDifference(new Date(), new Date(createdAt));
  const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? 'active'
    : '';
  const retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id,
  )
    ? 'active'
    : '';

  let retweetText = '';
  if (isRetweet) {
    retweetText = `
      <span>
        <i class='fas fa-retweet'></i>
        Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
      </span>
    `;
  }
  return `
    <div class='post' data-id='${postData._id}'>
      <div class='postActionContainer'>
        ${retweetText}
      </div>
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
              <button data-toggle='modal' data-target='#replyModal'>
                <i class='far fa-comment'></i>
              </button>
            </div>
            <div class='postButtonContainer green'>
              <button class='retweetButton ${retweetButtonActiveClass}'>
                <i class='fas fa-retweet'></i>
                <span>${postData.retweetUsers.length || ''}</span>
              </button>
            </div>
            <div class='postButtonContainer red'>
              <button class='likeButton ${likeButtonActiveClass}'>
                <i class='far fa-heart'></i>
                <span>${postData.likes.length || ''}</span>
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
function outputPosts(results, container) {
  container.html('');
  if (!Array.isArray(results)) {
    results = [results];
  }
  if (results.length === 0) {
    container.append("<span class='noResuts'>Nothing to show.</span>");
    return;
  }
  results.forEach((result) => {
    var html = createPostHtml(result);
    container.append(html);
  });
}
