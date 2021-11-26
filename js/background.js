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
selectAllBtn.addEventListener("click", () => {
    return;
})
const backgroundChanger = () => {
    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
    if (localStorage.getItem("intervalValue")) {
        intervalValue = localStorage.getItem("intervalValue")
    }
    if (JSON.parse(localStorage.getItem("bgCycleHistory"))) {
        bgCycleHistory = JSON.parse(localStorage.getItem("bgCycleHistory"));
    }
    if (bgCycleHistory.length >= 10) {
        bgCycleHistory.splice(0, 1);
    }
    nextBG = bgPathArray[Math.round(Math.random() * bgCount)];
    while (bgCycleHistory.includes(nextBG)) {
        nextBG = bgPathArray[Math.round(Math.random() * bgCount)];
    }
    bgCycleHistory.push(nextBG);
    localStorage.setItem("bgCycleHistory", JSON.stringify(bgCycleHistory));
    body.style.backgroundImage = `url(${nextBG})`;
    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
}
backgroundChanger();
setInterval(backgroundChanger, intervalValue)