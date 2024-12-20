document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("passwordConfirm");
    const errorMessage = document.getElementById("errorMessage");

    function validatePassword(password) {
        // 영문/숫자/특수문자 중 2가지 이상 포함, 8자 이상 16자 이하 (공백 제외)
        const hasTwoTypes = /(?=.*[A-Za-z])(?=.*[\d!@#$%^&*])/;
        const lengthValid = password.length >= 8 && password.length <= 16;
        const noSpaces = !/\s/.test(password);

        return hasTwoTypes.test(password) && lengthValid && noSpaces;
    }

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        if (!validatePassword(password)) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "비밀번호 조건을 충족하지 않습니다.";
            return;
        }

        if (password !== passwordConfirm) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "비밀번호가 일치하지 않습니다.";
            return;
        }

        errorMessage.style.display = "none";
        alert("회원가입 성공!");
        window.location.href = "./login.html";
    });
});
