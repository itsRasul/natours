/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const reviewBtn = document.querySelector('.review-send-btn');
  if (!reviewBtn) return;

  reviewBtn.addEventListener('click', async function (e) {
    try {
      e.preventDefault();
      const ratingReview = document.querySelector('.rating-review').value;
      const review = document.querySelector('#review-content').value;
      const tourId = reviewBtn.dataset.tourId;
      const userId = reviewBtn.dataset.userId;
      const res = await axios({
        method: 'POST',
        url: 'https://natours-rasul.herokuapp.com/api/v1/reviews',
        data: {
          review,
          rating: ratingReview,
          tour: tourId,
          user: userId,
        },
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  });
});
