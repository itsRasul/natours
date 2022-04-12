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
      const photoFile = document.getElementById('photo').files[0];
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('photo', photoFile);
      const res = await axios({
        method: 'PATCH',
        url: 'https://natours-rasul.herokuapp.com/api/v1/users/updateMe',
        data: formData,
      });

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      // console.log(err);
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
