/*eslint-disable*/
document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.querySelector('.nav__el--logout');
  if (logoutBtn)
    logoutBtn.addEventListener('click', async (e) => {
      try {
        const res = await axios({
          method: 'PATCH',
          url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });
        // Swal is not loaded, CSP issus
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'success',
        //   title: 'you are logged out successfully!',
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
        alert(res.data.message);
        setTimeout(() => {
          window.location.assign('/');
        }, 1000);
      } catch (err) {
        alert(err.response.data.message);
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'error',
        //   title: 'you are logged out already!',
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
      }
    });
});
