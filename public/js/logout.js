/*eslint-disable*/
const header = document.querySelector('header.header');
const logoutBtn = header.querySelector('.nav__el--logout');
if (logoutBtn)
  logoutBtn.addEventListener('click', async (e) => {
    try {
      const res = await axios({
        method: 'PATCH',
        url: 'http://127.0.0.1:3000/api/v1/users/logout',
      });

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'you are logged out successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        window.location.assign('/');
      }, 1000);
    } catch (err) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'you are logged out already!',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
