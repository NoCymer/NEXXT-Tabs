document.addEventListener("translated", () => {
    const pSwitch =  document.querySelector("#particles-switch");
    const pDiv = document.querySelector("#particles-js");
    if (!localStorage.getItem("particle")) {
        pSwitch.checked = true;
        localStorage.setItem("particle", true)
    }
    if (JSON.parse(localStorage.getItem("particle"))) {
        pSwitch.checked = true;
    }
    pSwitch.addEventListener("click",()=> {
        if(pSwitch.checked) { 
            localStorage.setItem("particle", true)
            pDiv.style.opacity = 1;
            updateP();
        }
        else if(!pSwitch.checked){
            localStorage.setItem("particle", false)
            pDiv.style.opacity = 0;
            updateP();
        }
    })
    
    updateP();
})