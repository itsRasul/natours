/*eslint-disable*/

document.addEventListener('DOMContentLoaded', function () {
  const likeBtn = document.querySelector('.like-btn');
  const likeIcon = document.querySelector('.like-icon');

  if (!likeBtn) return;

  const tourId = likeBtn.dataset.tour;

  likeBtn.addEventListener('click', async () => {
    try {
      const res = await axios({
        method: 'POST',
        url: `http://127.0.0.1:3000/api/v1/likes`,
        data: {
          tour: tourId,
        },
      });
      likeIcon.setAttribute('src', '/img/icons/heart.png');
      // likeIcon.src = `/img/icons/heart.png`;
    } catch (err) {
      alert('unsuccess');
    }
  });
});
