const countdownSwitch = document.querySelector("#ct-switch");
const countdownPosition = document.querySelector("#countdown-position");
const countdownDate = document.querySelector("#date");
const countdownLabel = document.querySelector("#lbl");
const countdownContainerTop = document.querySelector("#countdownContainerTop");
const countdownContainerBottom = document.querySelector("#countdownContainerBottom");
const setPosition = (posIndex) => {
    switch(Number(posIndex)) {
        case 0:
            //top
            countdownContainerTop.style.display = "block";
            countdownContainerBottom.style.display = "none";
            break;
        case 1:
            //bottom
            countdownContainerTop.style.display = "none";
            countdownContainerBottom.style.display = "block";
            break;
    }
}


if(localStorage.getItem('ctDate')){
    countdownDate.value = localStorage.getItem('ctDate');
}

if(localStorage.getItem('ctLabel')){
    countdownLabel.value = localStorage.getItem('ctLabel');
}
if(JSON.parse(localStorage.getItem("countdown"))) {
    if(localStorage.getItem('ctPosition')){
        countdownPosition.value = Number(localStorage.getItem('ctPosition'));
        setPosition(countdownPosition.value);
    }
    else{
        //default case
        setPosition(1);
    }
}
let countdownElements = document.querySelectorAll(".ct-sub-entry-hidden");
if (JSON.parse(localStorage.getItem("countdown"))) {
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
        setPosition(1);
    }
}
else{
    countdownElements.forEach((e)=>{
        e.style.display="none";
    })
    countdownContainerTop.style.display = "none";
    countdownContainerBottom.style.display = "none";
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
            setPosition(1);
        }
        localStorage.setItem("countdown", true);
    }
    else if(!countdownSwitch.checked){
        countdownElements.forEach((e)=>{
            e.style.display="none";
        })
        countdownContainerTop.style.display = "none";
        countdownContainerBottom.style.display = "none";
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
    console.log(countdownDate.value)
    localStorage.setItem('ctDate', countdownDate.value);
    checkForDateLabel();
    
})

countdownLabel.addEventListener("input",() => {
    console.log(countdownLabel.value)
    setNewLabel(countdownLabel.value);
    localStorage.setItem('ctLabel', countdownLabel.value);
})

countdownPosition.onchange = () => {
    console.log(countdownPosition.value)
    localStorage.setItem("ctPosition",countdownPosition.value);
    setPosition(countdownPosition.value);
}

