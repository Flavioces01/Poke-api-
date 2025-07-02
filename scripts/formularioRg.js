document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("FormularioRegistro");
  const nameInput = document.getElementById("Nombre");
  const emailInput = document.getElementById("Correo");
  const passwordInput = document.getElementById("password");
  const cpasswordInput = document.getElementById("cpassword");


  const nameError = document.getElementById("nameerror");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const cpasswordError = document.getElementById("cpasswordError");

  
  const showError = (element, message) => {
    element.textContent = message;
    element.style.display = "block";
  };

  const hideError = (element) => {
    element.textContent = "";
    element.style.display = "none";
  };


  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true; 

    const nameValue = nameInput.value.trim();
    if (nameValue === "") {
      showError(nameError, "El nombre es obligatorio");
      isValid = false;
    } else if (nameValue.length < 3) {
      showError(nameError, "El nombre debe contener al menos 3 caracteres");
      isValid = false;
    } else {
      hideError(nameError);
    }


    const emailValue = emailInput.value.trim();
    if (emailValue === "") {
      showError(emailError, "El correo es obligatorio");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      showError(emailError, "El correo no es válido");
      isValid = false;
    } else {
      hideError(emailError);
    }


    const passwordValue = passwordInput.value.trim();
    if (passwordValue === "") {
      showError(passwordError, "La contraseña es obligatoria");
      isValid = false;
    } else if (passwordValue.length < 6) {
      showError(passwordError, "La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    } else {

      const regexComplejidad = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
      if (!regexComplejidad.test(passwordValue)) {
        showError(
          passwordError,
          "La contraseña debe contener al menos una letra mayúscula, un número y un símbolo"
        );
        isValid = false;
      } else {
        hideError(passwordError);
      }
    }

   
    const cpasswordValue = cpasswordInput.value.trim();
    if (cpasswordValue === "") {
      showError(cpasswordError, "Confirma tu contraseña");
      isValid = false;
    } else if (cpasswordValue !== passwordValue) {
      showError(cpasswordError, "Las contraseñas no coinciden");
      isValid = false;
    } else {
      hideError(cpasswordError);
    }


    if (isValid) {
      console.log("El formulario es válido y se puede enviar.");
      
    } else {
      alert("Existen errores en el formulario.");
    }
  });
});