const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

window.addEventListener("DOMContentLoaded",()=>
console.log("hello"))
signUp.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signIn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

async function signup() {
  try {
    const signupDetails = {
      signupName: signupName.value,
      signupEmail: signupEmail.value,
      signupPassword: signupPassword.value,

    };
    console.log(signupDetails)


    const response = await axios.post("http://localhost:3000/user/signup", signupDetails);
    if(response.status==200){
      alert("user already exist")
    }
    else{
      
      alert("sign up successful");
    }


 } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      alert(errorMessage);
    } else {
      alert("An error occurred. Please try again later.");
    }
  }


}

async function login() {

  try {
    const loginDetails = {
      loginEmail: loginEmail.value,
      loginPassword: loginPassword.value,
    };
    console.log(loginDetails);

    const response = await axios.post("http://localhost:3000/user/login", loginDetails);
    console.log(response)
    alert("Login successful");
    
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('ispremiumuser', response.data.ispremiumuser);

      
    
     window.location.href = "./expense.html";
  } catch (error) {
    console.log(error)
    if (error.response) {
      const errorMessage = error.response.data.message;
      alert(errorMessage);
    } else {
      alert("An error occurred. Please try again later.");
    }
  }
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  login(); // Add event listener for login button click within the function
});

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signup(); // Add event listener for signup button click within the function
});



const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const forgotPasswordEmail = document.getElementById("forgotPasswordEmail");

forgotPasswordLink.addEventListener("click", (event) => {
  event.preventDefault();
  forgotPasswordModal.style.display = "block";
});

closeModalBtn.addEventListener("click", (event) => {
  event.preventDefault();
  forgotPasswordModal.style.display = "none";
});

resetPasswordBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = forgotPasswordEmail.value;
  const obj = { email: email };

  try {
    const response = await axios.post(
      "http://localhost:3000/password/forgotPasswordMail",
      obj
    );

    if (response.status === 200) {
      alert(`Link sent to ${email} to create a new password`);
      forgotPasswordModal.style.display = "none";
    } else {
      alert("Error sending the reset password link.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again later.");
  }
});
