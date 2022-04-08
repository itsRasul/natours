// const { default: Swal } = require('sweetalert2');

/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const bookBtn = document.querySelector('.booking-btn');
  if (!bookBtn) return;

  bookBtn.addEventListener('click', async function () {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/bookings',
        data: {
          tour: bookBtn.dataset.tourId,
          user: bookBtn.dataset.userId,
          price: bookBtn.dataset.price,
        },
      });
      // Swal is not loaded in tour page, SCP issues
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: res.data.message,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });

      alert(res.data.message);
    } catch (err) {
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'error',
      //   title: err.response.data.message,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
      alert(err.response.data.message);
    }
  });
});
