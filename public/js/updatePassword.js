/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const changePassForm = document.querySelector('.form-user-password');

  if (!changePassForm) return;

  const ChangePasswordBtn = document.querySelector(
    '.btn--save-change-password'
  );
  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const currentPassword = document.querySelector('#password-current').value;
      const password = document.querySelector('#password').value;
      const passwordConfirm = document.querySelector('#password-confirm').value;

      ChangePasswordBtn.textContent = 'Updating...';
      const res = await axios({
        method: 'PATCH',
        url: 'http://127.0.0.1:3000/api/v1/users/updateMyPassword',
        data: {
          passwordConfirm,
          password,
          currentPassword,
        },
      });
      ChangePasswordBtn.textContent = 'Save password';
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      document.querySelector('#password-current').value = '';
      document.querySelector('#password').value = '';
      document.querySelector('#password-confirm').value = '';
    } catch (err) {
      console.log(err);
      // error
      ChangePasswordBtn.textContent = 'Save password';
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.response.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };
  ChangePasswordBtn.addEventListener('click', changePassword);
});
