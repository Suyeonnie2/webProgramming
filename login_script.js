document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email && password) {
                console.log("로그인 성공");
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "./index.html";
            } else {
                alert("ID와 비밀번호를 입력해주세요.");
            }
        });
    }
});
