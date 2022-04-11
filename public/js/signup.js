/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const signupBtn = document.querySelector('#signup-btn');

  if (!signupBtn) return;

  signupBtn.addEventListener('click', async function (e) {
    try {
      e.preventDefault();
      const name = document.querySelector('#name-signup').value;
      const email = document.querySelector('#email-signup').value;
      const password = document.querySelector('#password-signup').value;
      const passwordConfirm = document.querySelector(
        '#confirm-password-signup'
      ).value;

      signupBtn.innerText = 'sending...';

      const res = await axios({
        method: 'POST',
        url: `http://127.0.0.1:3000/api/v1/users/signup`,
        data: {
          name,
          email,
          password,
          passwordConfirm,
        },
      });

      signupBtn.innerText = 'sign up';

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } catch (err) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.response.data.message,
        showConfirmButton: false,
        timer: 4000,
      });

      signupBtn.innerText = 'sign up';
    }
  });
});
