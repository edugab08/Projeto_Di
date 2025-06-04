document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    const errorMessage = document.getElementById("error-message");
  
    if (email === "admin@gmail.com" && password === "123456") {
      errorMessage.style.color = "green";
      errorMessage.textContent = "Login bem-sucedido!";
    
      window.location.href="Dashboard.html"
    } else {
      errorMessage.style.color = "red";
      errorMessage.textContent = "Email ou senha incorretos.";
    }
  });
  
  