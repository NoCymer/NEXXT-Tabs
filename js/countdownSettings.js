const countdownSwitch = document.querySelector("#ct-switch");
const countdownPosition = document.querySelector("#countdown-position");
const countdownDateTime = document.querySelector("#datetime");
const countdownLabel = document.querySelector("#lbl");
const countdownContainerTop = document.querySelector("#countdownContainerTop");
const countdownContainerBottom = document.querySelector("#countdownContainerBottom");
const TIMER_FADE_DURATION = "200"; //ms
const setPosition = (posIndex) => {
    switch (Number(posIndex)) {
        case 0:
            //top
            countdownContainerTop.style.display = "block";
            setTimeout(() => {
                countdownContainerTop.style.opacity = "1";
                countdownContainerBottom.style.opacity = "0";
            }, 1);
            setTimeout(() => {
                countdownContainerBottom.style.display = "none";
            }, TIMER_FADE_DURATION);
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
            }, TIMER_FADE_DURATION);
            break;
    }
}
let countdownElements = document.querySelectorAll(".ct-sub-entry-hidden");

if (localStorage.getItem('ctDateTime')) {
    countdownDateTime.value = localStorage.getItem('ctDateTime');
}

if (localStorage.getItem('ctLabel')) {
    countdownLabel.value = localStorage.getItem('ctLabel');
}
let ctSwitch = new switchButton(
    countdownSwitch,
    "countdown",
    false,
    () => { },
    () => {
        countdownElements.forEach((e) => {
            e.style.display = "flex";
        })
        if (localStorage.getItem('ctPosition')) {
            countdownPosition.value = Number(localStorage.getItem('ctPosition'));
            setPosition(countdownPosition.value);
        }
        else {
            //default case
            setPosition(0);
        }
    },
    () => {
        countdownElements.forEach((e) => {
            e.style.display = "none";
        })
        countdownContainerTop.style.opacity = "0";
        countdownContainerBottom.style.opacity = "0";
        setTimeout(() => {
            countdownContainerTop.style.display = "none";
            countdownContainerTop.style.display = "none";
        }, TIMER_FADE_DURATION);
    });
const setNewLabel = (label) => {
    document.getElementById("labelT").textContent = label;
    document.getElementById("labelT").innerText = label;

    document.getElementById("labelB").textContent = label;
    document.getElementById("labelB").innerText = label;
}

countdownDateTime.addEventListener("input", () => {
    localStorage.setItem('ctDateTime', countdownDateTime.value);
    checkForDateLabel();
})
 
countdownLabel.addEventListener("input", () => {
    setNewLabel(countdownLabel.value);
    localStorage.setItem('ctLabel', countdownLabel.value);
})

countdownPosition.onchange = () => {
    localStorage.setItem("ctPosition", countdownPosition.value);
    setPosition(countdownPosition.value);
}

