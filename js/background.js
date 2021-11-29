const body = document.querySelector("body");
const cycleBgSwitch = document.querySelector("#cycle-bg-switch");
const shuffleSwitch = document.querySelector("#shuffle-bg-switch");
const deselectAllBtn = document.querySelector("#deselect-all-btn");
const selectAllBtn = document.querySelector("#select-all-btn");
const backgroundChoiceContainer = document.querySelector("#background-choice");
let backgroundSelectSwitchElements = document.querySelectorAll(".background-entry-switch") //Must recall query selector after hot injecting
let backgroundSelectElements = document.querySelectorAll(".background-entry") //Must recall query selector after hot injecting
const backgroundsPath = '../src/assets/backgrounds';
const bgCount = 62;
let intervalValue = 120000; //default value of 2 minutes
let bgCycleHistory = []; //10 last bgs
let bgPathArray = [];
let selectedBgsIDs = [];
let nextBG;
let shuffle = true;
let cycleBG = true;
let currentIndex = 1;

let tempVar = 1;//debug variable must delete after 
if (localStorage.getItem("selectedBgsIDs")) {
    selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
}
else {
    selectedBgsIDs = [];
}
const addBGSwitchListener = (element) => {
    element.addEventListener("click", () => {
        if (localStorage.getItem("selectedBgsIDs")) {
            selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
        }
        else {
            selectedBgsIDs = [];
        }
        console.log(selectedBgsIDs)
        if (element.checked) {
            console.log(element.id);
            if (!selectedBgsIDs.includes(Number(element.id))) {
                selectedBgsIDs.push(Number(element.id))
            }
        }
        else {
            selectedBgsIDs.splice(selectedBgsIDs.indexOf(Number(element.id)), 1);
        }
        console.log(selectedBgsIDs);
        let jsonArr = JSON.stringify(selectedBgsIDs);
        localStorage.setItem("selectedBgsIDs", jsonArr);
    })
}


backgroundSelectSwitchElements.forEach(element => {
    addBGSwitchListener(element);
});

const createNewBgEntry = (id, imgID) => {
    const newContainer = document.createElement("div");
    newContainer.className = "background-entry";
    const subContainer = document.createElement("div");
    subContainer.className = "standard-checkbox background-checker";
    const checkBoxContainer = document.createElement("label");
    checkBoxContainer.className = "checkbox";
    const spanEl = document.createElement("span");
    spanEl.className = "checkmark";
    const inputEl = (document.createElement("input"));
    inputEl.type = "checkbox";
    inputEl.className = "background-entry-switch";
    inputEl.id = `${id}`;
    checkBoxContainer.appendChild(inputEl);
    checkBoxContainer.appendChild(spanEl);
    subContainer.appendChild(checkBoxContainer);
    newContainer.appendChild(subContainer);
    newContainer.style.background = `linear-gradient(330deg, rgba(244, 123, 255, 0) 0%, rgba(255, 255, 255, 0.561) 100%), url("../src/assets/backgrounds/${imgID}.jpg")`
    newContainer.style.backgroundSize = "contain"
    backgroundChoiceContainer.appendChild(newContainer);
    addBGSwitchListener(inputEl);
}
for (let i = 1; i <= bgCount; i++) {
    bgPathArray.push(`${backgroundsPath}/${i}.jpg`);
    createNewBgEntry(++tempVar, i);
}

// assigns shuffle local storage's value
if (localStorage.getItem("shuffle")) {
    if (JSON.parse(localStorage.getItem("shuffle"))) {
        shuffle = true;
        shuffleSwitch.checked = true;
    }
    else {
        shuffle = false;
        shuffleSwitch.checked = false;
    }
}
//default case if no user prefs
else {
    shuffle = true;
    shuffleSwitch.checked = true;
    localStorage.setItem("shuffle", true);
}

// assigns cycleBG local storage's value
if (localStorage.getItem("cycleBG")) {
    if (JSON.parse(localStorage.getItem("cycleBG"))) {
        cycleBG = true;
        cycleBgSwitch.checked = true;
    }
    else {
        cycleBG = false;
        cycleBgSwitch.checked = false;
    }
}
//default case if no user prefs
else {
    cycleBG = true;
    cycleBgSwitch.checked = true;
    localStorage.setItem("shuffle", true);
}

selectAllBtn.addEventListener("click", () => {
    return;
})
deselectAllBtn.addEventListener("click", () => {
    return;
})
shuffleSwitch.addEventListener("click", () => {
    if (shuffleSwitch.checked) {
        shuffle = true;
        localStorage.setItem("shuffle", true);
    }
    else {
        shuffle = false;
        localStorage.setItem("shuffle", false);
    }
})
cycleBgSwitch.addEventListener("click", () => {
    if (cycleBgSwitch.checked) {
        cycleBG = true;
        localStorage.setItem("cycleBG", true);
    }
    else {
        cycleBG = false;
        localStorage.setItem("cycleBG", false);
    }
})
const backgroundChanger = () => {
    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
    if (cycleBG) {
        if (localStorage.getItem("intervalValue")) {
            intervalValue = localStorage.getItem("intervalValue")
        }
        if (JSON.parse(localStorage.getItem("bgCycleHistory"))) {
            bgCycleHistory = JSON.parse(localStorage.getItem("bgCycleHistory"));
        }
        if (bgCycleHistory.length >= 10) {
            bgCycleHistory.splice(0, 1);
        }
        if (shuffle) {
            let rand = Math.round(Math.random() * bgCount)
            currentIndex = rand;
            nextBG = bgPathArray[rand];
            while (bgCycleHistory.includes(nextBG)) {
                rand = Math.round(Math.random() * bgCount)
                currentIndex = rand;
                nextBG = bgPathArray[rand];
            }
        }
        else {
            nextBG = bgPathArray[++currentIndex];
        }
        bgCycleHistory.push(nextBG);
        localStorage.setItem("bgCycleHistory", JSON.stringify(bgCycleHistory));
        body.style.backgroundImage = `url(${nextBG})`;
    }
    else {
        //CREATE USER SELECTION IMPLEMENTATION
    }

    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
}
backgroundChanger();
setInterval(backgroundChanger, intervalValue)