function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Vérification des champs email et mot de passe
  if (!email || !password) {
    console.error("Veuillez remplir tous les champs.");
    return;
  }

  const data = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Identifiants incorrects");
      }
    })
    .then((result) => {
      const token = result.token;
      sessionStorage.setItem("authToken", token);

      window.location.href = "/FrontEnd/index.html";
    })
    .catch((error) => {
      console.error("Erreur lors de la connexion:", error.message);
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "Identifiants incorrects";
    });
}

const form = document.querySelector(".form form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  login();
});
