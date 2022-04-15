/*eslint-disable*/

document.addEventListener('DOMContentLoaded', function () {
  const likeBtn = document.querySelector('.like-btn');
  const likeIcon = document.querySelector('.like-icon');

  if (!likeBtn) return;

  const tourId = likeBtn.dataset.tour;

  likeBtn.addEventListener('click', async () => {
    // we should check if likeBtn attr data-liked is true or false
    // if it's true => user liked this tour before and we should delete his like and send delete http req
    // if it's false = user has not liked this tour and we should send post http req

    // when user like a tour we have to change data-liked attr on likeBtn to true
    // and when a user delete his like we change data-liked attr on likeBtn to false
    if (likeBtn.dataset.liked == 'true') {
      // user wants to delete his like, so send a delete http req to API
      try {
        const res = await axios({
          method: 'DELETE',
          url: `https://natours-rasul.herokuapp.com/api/v1/tours/${tourId}/likes/deleteMyLike`,
          data: {
            tour: tourId,
          },
        });
        likeIcon.setAttribute('src', '/img/icons/heart.png');
        likeBtn.dataset.liked = 'false';
      } catch (err) {
        alert('unsuccess.');
      }
    } else if (likeBtn.dataset.liked == 'false') {
      // user wants to like this tour, so send post http req to API
      try {
        const res = await axios({
          method: 'POST',
          url: `https://natours-rasul.herokuapp.com/api/v1/likes`,
          data: {
            tour: tourId,
          },
        });
        likeIcon.setAttribute('src', '/img/icons/heart.png');
        likeBtn.dataset.liked = 'true';
      } catch (err) {
        alert('you liked this tour before.');
      }
    }
  });

  const isLiked = () => (likeBtn.dataset.liked === 'true' ? 'true' : 'false');
});
