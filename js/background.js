const body = document.querySelector("body");
const cycleBgSwitch = document.querySelector("#cycle-bg-switch");
const shuffleSwitch = document.querySelector("#shuffle-bg-switch");
const deselectAllBtn = document.querySelector("#deselect-all-btn");
const selectAllBtn = document.querySelector("#select-all-btn");
const backgroundChoiceContainer = document.querySelector("#background-choice");
let backgroundSelectSwitchElements = document.querySelectorAll(".background-entry-switch") //Must recall query selector after hot injecting
let backgroundSelectElements = document.querySelectorAll(".background-entry") //Must recall query selector after hot injecting

const BACKGROUNDS_PATH = '../src/assets/backgrounds';
const BACKGROUND_COUNT = 62;
const REGEX = /url\("\.\.\/src\/assets\/backgrounds\/([\d]+).jpg/;
const REGEX_ID = /\.\.\/src\/assets\/backgrounds\/([\d]+).jpg/;

let intervalValue = 120000; //default value of 2 minutes
intervalValue = 3000; // debug line remove after
let bgCycleHistory = []; //10 last bgs
let bgPathArray = [];
let selectedBgsIDs = [];
let nextBG;
let shuffle = true;
let selectedBackgroundCount;
let cycleBG = true;
let currentIndex = 1;


const hideCheckbox = (child) => {
    child.parentNode.childNodes.forEach((e) => {
        if (e.nodeName == "SPAN") {
            e.style.backgroundColor = "rgba(0,0,0,0)";
        }
    })
}
const showCheckbox = (child) => {
    child.parentNode.childNodes.forEach((z) => {
        if (z.nodeName == "SPAN") {
            z.style.backgroundColor = "";
        }
    })
}
const addBGSwitchListener = (element) => {
    backgroundSelectSwitchElements = document.querySelectorAll(".background-entry-switch");
    element.addEventListener("click", () => {
        if (cycleBG) {
            if (localStorage.getItem("selectedBgsIDs")) {
                selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
            }
            else {
                selectedBgsIDs = [];
            }
            backgroundSelectSwitchElements.forEach((e) => {
                if (e.checked) {
                    if (localStorage.getItem("selectedBgsIDs")) {
                        selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
                    }
                    else {
                        selectedBgsIDs.push(Number(e.id));
                    }
                    if (!selectedBgsIDs.includes(Number(e.id))) selectedBgsIDs.push(Number(e.id));
                    localStorage.setItem("selectedBgsIDs", JSON.stringify(selectedBgsIDs));
                }
            })
            if (element.checked) {
                console.log(element.id);
                if (!selectedBgsIDs.includes(Number(element.id))) {
                    selectedBgsIDs.push(Number(element.id))
                }
            }
            else {
                selectedBgsIDs.splice(selectedBgsIDs.indexOf(Number(element.id)), 1);
            }
            let jsonArr = JSON.stringify(selectedBgsIDs);
            localStorage.setItem("selectedBgsIDs", jsonArr);
        }
        else {
            backgroundSelectSwitchElements = document.querySelectorAll(".background-entry-switch");
            backgroundSelectSwitchElements.forEach((f) => {
                if (f !== element) f.checked = false;
                showCheckbox(f);
            })
            if (element.checked) {
                localStorage.setItem("manualBgSelected", element.id);
                body.style.backgroundImage = `url("../src/assets/backgrounds/${element.id}.jpg")`;
                backgroundSelectSwitchElements.forEach((e) => {
                    if (e !== element) {
                        hideCheckbox(e);
                    }
                })
            }
            else {
                element.checked = true;
                backgroundSelectSwitchElements.forEach((f) => {
                    if (f !== element) {
                        f.checked = false;
                        hideCheckbox(f);
                    }
                })
            }
        }
    })
}
const createNewBgEntry = (id) => {
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
    addBGSwitchListener(inputEl);
}
const backgroundChanger = () => {
    if (localStorage.getItem("selectedBgsIDs")) {
        selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
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
            selectedBackgroundCount = selectedBgsIDs.length;
            let rand = Math.ceil(Math.random() * selectedBackgroundCount-1);
            console.log(selectedBgsIDs)
            console.log("rand : " + rand)
            currentIndex = rand;
            localStorage.setItem("currentIndex", selectedBgsIDs[rand]);
            nextBG = `url("../src/assets/backgrounds/${selectedBgsIDs[rand]}.jpg")`;
        }
        else {
            if(localStorage.getItem("currentIndex")) currentIndex = localStorage.getItem("currentIndex");
            else currentIndex = 1
            
            let higher = -1;
            selectedBgsIDs.forEach((e) => {
                if (e > higher) higher = e;
            })
            // cycle by index logic
            console.log(currentIndex)
            console.log(higher)
            if (currentIndex + 1 >= higher) {
                nextBG = `url("../src/assets/backgrounds/${selectedBgsIDs[0]}.jpg")`;
                currentIndex = 0;//you were  here
                
            }
            else {
                console.log("hi")
                currentIndex++;
                nextBG = `url("../src/assets/backgrounds/${selectedBgsIDs[currentIndex]}.jpg")`;
                localStorage.setItem("currentIndex", selectedBgsIDs[currentIndex]);
            }
        }
        bgCycleHistory.push(nextBG);
        localStorage.setItem("bgCycleHistory", JSON.stringify(bgCycleHistory));
        body.style.backgroundImage = `${nextBG}`;
    }
    else {
        //CREATE USER SELECTION IMPLEMENTATION
    }

    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
}

if (localStorage.getItem("selectedBgsIDs")) {
    selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"));
}
else {
    selectedBgsIDs = [];
}

backgroundSelectSwitchElements.forEach(element => {
    addBGSwitchListener(element);
});

for (let i = 1; i <= BACKGROUND_COUNT; i++) {
    bgPathArray.push(`${BACKGROUNDS_PATH}/${i}.jpg`);
    createNewBgEntry(i);
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



selectAllBtn.addEventListener("click", () => {
    backgroundSelectSwitchElements.forEach((e) => {
        e.checked = true;
        let arr = []
        for (i = 1; i <= BACKGROUND_COUNT; i++) arr.push(i);
        console.log(arr)
        localStorage.setItem("selectedBgsIDs", JSON.stringify(arr));
        selectedBackgroundCount = arr.length;
    })
})
deselectAllBtn.addEventListener("click", () => {
    backgroundSelectSwitchElements.forEach((e) => {
        e.checked = false;
        if (e.id == 1) e.checked = true;
        localStorage.setItem("selectedBgsIDs", JSON.stringify([1]));
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
    let idFromRegex = body.style.backgroundImage.match(REGEX)[1];
    if (cycleBgSwitch.checked) {
        cycleBG = true;
        localStorage.setItem("cycleBG", true);
        shuffleSwitch.disabled = false;
        backgroundSelectSwitchElements.forEach((e) => {
            showCheckbox(e);
            if (JSON.parse(localStorage.getItem("selectedBgsIDs")).includes(Number(e.id))) e.checked = true;
        })
        backgroundSelectSwitchElements.forEach((i) => {
            if (idFromRegex == i.id) {
                extractedNode = i;
                extractedNode.checked = false;
            }
        })
    }
    else {
        shuffleSwitch.disabled = true;
        cycleBG = false;
        localStorage.setItem("cycleBG", false);
        let extractedNode;
        localStorage.setItem("manualBgSelected", idFromRegex);
        backgroundSelectSwitchElements.forEach((i) => {
            if (idFromRegex == i.id) {
                extractedNode = i;
                extractedNode.checked = true;
            }
        })
        backgroundSelectSwitchElements.forEach((e) => {
            if (e !== extractedNode) {
                e.checked = false;
                hideCheckbox(e);
            }
        })
    }
})

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
else{
    cycleBG = true;
    cycleBgSwitch.checked = true;
    shuffleSwitch.disabled = false;
    localStorage.setItem("cycleBG", true);
}

backgroundChanger();
if (localStorage.getItem("selectedBgsIDs")) {
    backgroundSelectSwitchElements.forEach((e) => {
        selectedBgsIDs = JSON.parse(localStorage.getItem("selectedBgsIDs"))
        if (cycleBG && selectedBgsIDs.includes(Number(e.id))) {
            e.checked = true;
        }
    })
}
else {//here dumbass
    let arr = []
    for (i = 1; i <= BACKGROUND_COUNT; i++) arr.push(i);
    backgroundSelectSwitchElements.forEach((e) => {
        e.checked = true;
    })
    localStorage.setItem("selectedBgsIDs", JSON.stringify(arr));
}
backgroundSelectSwitchElements = document.querySelectorAll(".background-entry-switch")
if (localStorage.getItem("cycleBG")) {
    if (!JSON.parse(localStorage.getItem("cycleBG"))) {
        if (localStorage.getItem("manualBgSelected")) {
            let manualBgSelected = localStorage.getItem("manualBgSelected");
            body.style.backgroundImage = `url("../src/assets/backgrounds/${manualBgSelected}.jpg")`;
            backgroundSelectSwitchElements.forEach((i) => {
                if (i.id == manualBgSelected) {
                    i.checked = true;
                }
                else {
                    hideCheckbox(i);
                }
            })
        }
        else {
            body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")';
            localStorage.setItem("manualBgSelected", 1)
        }
    }
}
setInterval(backgroundChanger, intervalValue)