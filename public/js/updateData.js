/*eslint-disable*/

// const { default: Swal } = require('sweetalert2');

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form.form-user-data');
  const updateDataBtn = document.querySelector('.btn--update-user-data');

  if (!form || !updateDataBtn) return;

  const updateData = async (e) => {
    try {
      e.preventDefault();
      const name = document.querySelector('input[name="name"]').value;
      const email = document.querySelector('input[name="email"]').value;

      const res = await axios({
        method: 'PATCH',
        url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
        data: {
          name,
          email,
        },
      });

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        window.location.reload(true);
      }, 1500);
    } catch (err) {
      console.log(err);
      // error
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.response.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  updateDataBtn.addEventListener('click', updateData);
});
