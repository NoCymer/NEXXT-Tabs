const countdownSwitch = document.querySelector("#ct-switch");
const countdownPosition = document.querySelector("#countdown-position");
const countdownDate = document.querySelector("#date");
const countdownLabel = document.querySelector("#lbl");
const countdownContainerTop = document.querySelector("#countdownContainerTop");
const countdownContainerBottom = document.querySelector("#countdownContainerBottom");
const timerFadeDuration = "200"; //ms
const setPosition = (posIndex) => {
    switch(Number(posIndex)) {
        case 0:
            //top
            countdownContainerTop.style.display = "block";
            setTimeout(() => {           
                countdownContainerTop.style.opacity = "1";
                countdownContainerBottom.style.opacity = "0";
            }, 1);      
            setTimeout(() => {           
                countdownContainerBottom.style.display = "none";
            }, timerFadeDuration);           
            break;
        case 1:
            //bottom
            countdownContainerBottom.style.display = "block";    
            setTimeout(() => {           
                countdownContainerTop.style.opacity = "0";
                countdownContainerBottom.style.opacity = "1";
            }, 1);   
            setTimeout(() => {           
                countdownContainerTop.style.display = "none";
            }, timerFadeDuration);
            break;
    }
}
let countdownElements = document.querySelectorAll(".ct-sub-entry-hidden");

if(localStorage.getItem('ctDate')){
    countdownDate.value = localStorage.getItem('ctDate');
}

if(localStorage.getItem('ctLabel')){
    countdownLabel.value = localStorage.getItem('ctLabel');
}
if(JSON.parse(localStorage.getItem("countdown"))) {
    countdownElements.forEach((e)=>{
        e.style.display="flex";
    })
    countdownSwitch.checked = true;
    if(localStorage.getItem('ctPosition')){
        countdownPosition.value = Number(localStorage.getItem('ctPosition'));
        setPosition(countdownPosition.value);
    }
    else{
        //default case
        setPosition(0);
    }
}
else {
    countdownElements.forEach((e)=>{
        e.style.display="none";
    })
    countdownSwitch.checked = false;
}


countdownSwitch.addEventListener("click",()=> {
    if(countdownSwitch.checked) {
        countdownElements.forEach((e)=>{
            e.style.display="flex";
        })
        if(localStorage.getItem('ctPosition')){
            countdownPosition.value = Number(localStorage.getItem('ctPosition'));
            setPosition(countdownPosition.value);
        }
        else{
            //default case
            setPosition(0);
        }
        localStorage.setItem("countdown", true);
    }
    else if(!countdownSwitch.checked){
        countdownElements.forEach((e)=>{
            e.style.display="none";
        })
        countdownContainerTop.style.opacity = "0";
        countdownContainerBottom.style.opacity = "0";
        setTimeout(() => {           
            countdownContainerTop.style.display = "none";
            countdownContainerTop.style.display = "none";
        }, timerFadeDuration);
        localStorage.setItem("countdown", false);
    }
})



const setNewLabel = (label)  => {
    document.getElementById("labelT").textContent = label;
    document.getElementById("labelT").innerText = label;

    document.getElementById("labelB").textContent = label;
    document.getElementById("labelB").innerText = label;
}

countdownDate.addEventListener("input",() => {
    localStorage.setItem('ctDate', countdownDate.value);
    checkForDateLabel();
    
})

countdownLabel.addEventListener("input",() => {
    setNewLabel(countdownLabel.value);
    localStorage.setItem('ctLabel', countdownLabel.value);
})

countdownPosition.onchange = () => {
    localStorage.setItem("ctPosition",countdownPosition.value);
    setPosition(countdownPosition.value);
}

