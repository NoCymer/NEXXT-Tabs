let newUser = true;
localStorage.setItem("newUser", true);
if(localStorage.getItem("particle")) {
    localStorage.setItem("newUser", false);
    newUser = false;
}
console.log(newUser)