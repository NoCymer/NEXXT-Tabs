const body = document.querySelector("body");
const cycleBgSwitch = document.querySelector("#cycle-bg-switch");
const shuffleSwitch = document.querySelector("#shuffle-bg-switch");
const deselectAllBtn = document.querySelector("#deselect-all-btn");
const selectAllBtn = document.querySelector("#select-all-btn");
const backgroundChoiceContainer = document.querySelector("#background-choice");
const intervalValueInput = document.querySelector("#cycle-delay-input");
let backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch"); //Must recall query selector after hot injecting
let backgroundsElements = document.querySelectorAll(".background-entry"); //Must recall query selector after hot injecting

const BACKGROUNDS_PATH = '../src/assets/backgrounds';
const BACKGROUND_COUNT = 62;
const REGEX_ID_URL = /url\("\.\.\/src\/assets\/backgrounds\/([\d]+).jpg/;
const REGEX_ID_PATH = /\.\.\/src\/assets\/backgrounds\/([\d]+).jpg/;

let intervalValue = 120000; //default value of 2 minutes
let bgCycleHistory = []; //10 last bgs
let bgPathArray = [];
let selBackgroundsIDs = [];
let nextBG;
let shuffle = true;
let selBackgroundCount;
let cycleBG = true;
let currentLocalIndex = 1;

const minToMs = (minutes) => minutes * 60000;
const msToMin = (minutes) => minutes / 60000;
const hideBackgroundCheckbox = (child) => {
    child.parentNode.childNodes.forEach((e) => {
        if (e.nodeName == "SPAN") {
            e.style.backgroundColor = "rgba(0,0,0,0)";
        }
    })
}
const showBackgroundCheckbox = (child) => {
    child.parentNode.childNodes.forEach((z) => {
        if (z.nodeName == "SPAN") {
            z.style.backgroundColor = "";
        }
    })
}
const setupBackgroundSwitchListeners = (element) => {
    backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch");
    element.addEventListener("click", () => {
        if (cycleBG) {
            if (localStorage.getItem("selectedBgsIDs")) {
                selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
            }
            else {
                selBackgroundsIDs = [];
            }
            backgroundsSwitchElement.forEach((e) => {
                if (e.checked) {
                    if (localStorage.getItem("selectedBgsIDs")) {
                        selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
                    }
                    else {
                        selBackgroundsIDs.push(Number(e.id));
                    }
                    if (!selBackgroundsIDs.includes(Number(e.id))) selBackgroundsIDs.push(Number(e.id));
                    localStorage.setItem("selectedBgsIDs", JSON.stringify(selBackgroundsIDs));
                }
            })
            if (element.checked) {
                if (!selBackgroundsIDs.includes(Number(element.id))) {
                    selBackgroundsIDs.push(Number(element.id))
                }
            }
            else {
                selBackgroundsIDs.splice(selBackgroundsIDs.indexOf(Number(element.id)), 1);
            }
            let jsonArr = JSON.stringify(selBackgroundsIDs);
            localStorage.setItem("selectedBgsIDs", jsonArr);
        }
        else {
            backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch");
            backgroundsSwitchElement.forEach((f) => {
                if (f !== element) f.checked = false;
                showBackgroundCheckbox(f);
            })
            if (element.checked) {
                localStorage.setItem("manualBgSelected", element.id);
                body.style.backgroundImage = `url("../src/assets/backgrounds/${element.id}.jpg")`;
                backgroundsSwitchElement.forEach((e) => {
                    if (e !== element) {
                        hideBackgroundCheckbox(e);
                    }
                })
            }
            else {
                element.checked = true;
                backgroundsSwitchElement.forEach((f) => {
                    if (f !== element) {
                        f.checked = false;
                        hideBackgroundCheckbox(f);
                    }
                })
            }
        }
    })
}
const createNewBackgroundEntry = (id) => {
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
    newContainer.style.background = `linear-gradient(330deg, rgba(244, 123, 255, 0) 0%, rgba(255, 255, 255, 0.561) 100%), url("../src/assets/backgrounds/${id}.jpg")`
    newContainer.style.backgroundSize = "contain"
    backgroundChoiceContainer.appendChild(newContainer);
    setupBackgroundSwitchListeners(inputEl);
}
const backgroundChanger = () => {
    if (localStorage.getItem("selectedBgsIDs")) {
        selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
    }
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
        if (bgCycleHistory.length >= 2) {
            bgCycleHistory.splice(0, 1);
        }

        if (shuffle) {
            //cycle by shufle logic
            selBackgroundCount = selBackgroundsIDs.length;
            let rand = Math.ceil(Math.random() * selBackgroundCount - 1);
            currentLocalIndex = rand;
            localStorage.setItem("currentIndex", selBackgroundsIDs[rand]);
            nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[rand]}.jpg")`;
        }
        else {
            if (localStorage.getItem("currentIndex")) {
                currentLocalIndex = localStorage.getItem("currentIndex");
                if (currentLocalIndex == "undefined") currentLocalIndex = 0;
            }
            else currentLocalIndex = 0;
            currentLocalIndex = Number(currentLocalIndex);

            if (localStorage.getItem("selectedBgsIDs")) {
                selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
            }
            else {
                selBackgroundsIDs = [0];
                localStorage.setItem("selectedBgsIDs", JSON.stringify(selBackgroundsIDs));
            }
            selBackgroundsIDs.sort((a, b) => a - b);

            //if index bypass length of array apply 1st background in array
            if (currentLocalIndex + 1 >= selBackgroundsIDs.length) {
                currentLocalIndex = 0;//you were  here
                nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[0]}.jpg")`;
                localStorage.setItem("currentIndex", 0)
            }
            //goes to the next background
            else {
                nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[currentLocalIndex + 1]}.jpg")`;
                localStorage.setItem("currentIndex", (currentLocalIndex + 1));
            }
        }
        bgCycleHistory.push(nextBG);
        localStorage.setItem("bgCycleHistory", JSON.stringify(bgCycleHistory));
        body.style.backgroundImage = `${nextBG}`;
    }

    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
    setTimeout(backgroundChanger, intervalValue);
}

if (localStorage.getItem("intervalValue")) {
    intervalValue = Number(localStorage.getItem("intervalValue"));
    intervalValueInput.value = msToMin(intervalValue);
}

else {
    intervalValue = minToMs(2);
    localStorage.setItem("intervalValue", intervalValue);
    intervalValueInput.value = 2;
}

if (localStorage.getItem("selectedBgsIDs")) {
    selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
}
else {
    selBackgroundsIDs = [];
}

backgroundsSwitchElement.forEach(element => {
    setupBackgroundSwitchListeners(element);
});

for (let i = 0; i <= BACKGROUND_COUNT - 1; i++) {
    bgPathArray.push(`${BACKGROUNDS_PATH}/${i}.jpg`);
    createNewBackgroundEntry(i);
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

let cycleVal = localStorage.getItem("cycleBG")
if (cycleVal) {
    if (JSON.parse(cycleVal)) {
        cycleBG = true;
        cycleBgSwitch.checked = true;
        shuffleSwitch.disabled = false;
    }
    else {
        cycleBG = false;
        cycleBgSwitch.checked = false;
        shuffleSwitch.disabled = true;
    }
}
else {
    cycleBG = true;
    cycleBgSwitch.checked = true;
    shuffleSwitch.disabled = false;
    localStorage.setItem("cycleBG", true);
}


if (localStorage.getItem("selectedBgsIDs")) {
    backgroundsSwitchElement.forEach((e) => {
        selBackgroundsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"))
        if (cycleBG && selBackgroundsIDs.includes(Number(e.id))) {
            e.checked = true;
        }
    })
}
else {
    let arr = []
    for (i = 1; i <= BACKGROUND_COUNT; i++) arr.push(i);
    backgroundsSwitchElement.forEach((e) => {
        e.checked = true;
    })
    localStorage.setItem("selectedBgsIDs", JSON.stringify(arr));
}
backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch")
if (localStorage.getItem("cycleBG")) {
    if (!JSON.parse(localStorage.getItem("cycleBG"))) {
        if (localStorage.getItem("manualBgSelected")) {
            let manualBgSelected = localStorage.getItem("manualBgSelected");
            body.style.backgroundImage = `url("../src/assets/backgrounds/${manualBgSelected}.jpg")`;
            backgroundsSwitchElement.forEach((i) => {
                if (i.id == manualBgSelected) {
                    i.checked = true;
                }
                else {
                    hideBackgroundCheckbox(i);
                }
            })
        }
        else {
            body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")';
            localStorage.setItem("manualBgSelected", 1)
        }
    }
}
backgroundChanger();

selectAllBtn.addEventListener("click", () => {
    backgroundsSwitchElement.forEach((e) => {
        e.checked = true;
        let arr = []
        for (i = 0; i <= BACKGROUND_COUNT - 1; i++) arr.push(i);
        localStorage.setItem("selectedBgsIDs", JSON.stringify(arr));
        selBackgroundCount = arr.length;
    })
})
deselectAllBtn.addEventListener("click", () => {
    backgroundsSwitchElement.forEach((e) => {
        e.checked = false;
        if (e.id == 0) e.checked = true;
        localStorage.setItem("selectedBgsIDs", JSON.stringify([0]));
    })
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
    let idFromRegex = body.style.backgroundImage.match(REGEX_ID_URL)[1];
    let extractedNode;
    if (cycleBgSwitch.checked) {
        cycleBG = true;
        localStorage.setItem("cycleBG", true);
        shuffleSwitch.disabled = false;
        backgroundsSwitchElement.forEach((e) => {
            showBackgroundCheckbox(e);
            if (JSON.parse(localStorage.getItem("selectedBgsIDs")).includes(Number(e.id))) e.checked = true;
        })
        backgroundsSwitchElement.forEach((i) => {
            if (!selBackgroundsIDs.includes(Number(i.id))) {
                i.checked = false;
            }
        })
    }
    else {
        shuffleSwitch.disabled = true;
        cycleBG = false;
        localStorage.setItem("cycleBG", false);
        localStorage.setItem("manualBgSelected", idFromRegex);
        backgroundsSwitchElement.forEach((i) => {
            if (idFromRegex == i.id) {
                extractedNode = i;
                extractedNode.checked = true;
            }
        })
        backgroundsSwitchElement.forEach((e) => {
            if (e !== extractedNode) {
                e.checked = false;
                hideBackgroundCheckbox(e);
            }
        })
    }
})
intervalValueInput.addEventListener("input", () => {
    if (intervalValueInput.value <= 0 || isNaN(intervalValueInput.value)) {
        temp = 1;
        intervalValue = 1
    }
    intervalValue = minToMs(intervalValueInput.value);
    localStorage.setItem("intervalValue", intervalValue);
})
