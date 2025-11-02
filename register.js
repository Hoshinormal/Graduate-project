const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorMsg = document.getElementById('errorMsg');
    const submitBtn = document.getElementById('submitBtn');

    function checkPasswords() {
      if (confirmPassword.value === "") {
        errorMsg.textContent = "";
        submitBtn.disabled = true;
        return;
      }
      if (password.value === confirmPassword.value) {
        errorMsg.textContent = "";
        submitBtn.disabled = false;
      } else {
        errorMsg.textContent = "兩次輸入的密碼不一致！";
        submitBtn.disabled = true;
      }
    }

    password.addEventListener('input', checkPasswords);
    confirmPassword.addEventListener('input', checkPasswords);