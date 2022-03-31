// import Swal from 'sweetalert2';
// const Swal = require('sweetalert2');
/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#login-form');
  // this module is only for login page, if form is not exist, it means we are another route, so don't run it
  if (!form) return;

  const login = async (email, password) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password,
        },
      });
      console.log('success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      // alert(res.data.message);
      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } catch (err) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.response.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      // alert(err.response.data.message);
    }
  };

  if (form)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      login(email, password);
    });
});
