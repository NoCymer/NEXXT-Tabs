document.addEventListener("translated", () => {
    const body = document.querySelector("body");
    const cycleBgSwitch = document.querySelector("#cycle-bg-switch");
    const shuffleSwitch = document.querySelector("#shuffle-bg-switch");
    const deselectAllBtn = document.querySelector("#deselect-all-btn");
    const selectAllBtn = document.querySelector("#select-all-btn");
    const backgroundChoiceContainer = document.querySelector("#background-choice");
    const intervalValueInput = document.querySelector("#cycle-delay-input");
    let backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch"); //Must recall query selector after injecting
    
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
    const showBgSwitchElements = () => {
        backgroundsSwitchElement.forEach((e) => {
            showBackgroundCheckbox(e);
            if (selectedBgsIDsStorage.getValue().includes(Number(e.id))) e.checked = true;
            else e.checked = false;
        })
    }
    const hideBgSwitchElements = () => {
        let idFromRegex = body.style.backgroundImage.match(REGEX_ID_URL)[1];
        cycleBG = false;
        cycleBGStorage.setValue(cycleBG);
        manualBgSelectedStorage.setValue(idFromRegex);
        backgroundsSwitchElement.forEach((i) => {
            if (manualBgSelectedStorage.getValue() == i.id) {
                i.checked = true;
            }
            else {
                i.checked = false;
                hideBackgroundCheckbox(i);
            }
        })
    }
    const allBackgroudnsArrayCreator = () => {
        let arr = [];
        for (i = 0; i <= BACKGROUND_COUNT - 1; i++) arr.push(i);
        return arr;
    }
    
    intervalValueStorage = new Storage("intervalValue", minToMs(2));
    intervalValueInput.value = msToMin(intervalValueStorage.getValue());
    intervalValue = intervalValueStorage.getValue();
    
    arr = allBackgroudnsArrayCreator();
    if(!localStorage.getItem("selectedBgsIDs")){
        backgroundsSwitchElement.forEach((e) => {
            e.checked = true;
        })
    }
    selectedBgsIDsStorage = new Storage("selectedBgsIDs", arr);
    selBackgroundsIDs = selectedBgsIDsStorage.getValue();
    
    bgCycleHistoryStorage = new Storage("bgCycleHistory", []); 
    bgCycleHistory = bgCycleHistoryStorage.getValue();
    
    currentLocalIndexStorage = new Storage("currentIndex", 0);
    currentLocalIndex = currentLocalIndexStorage.getValue();
    
    manualBgSelectedStorage = new Storage("manualBgSelected", 0);
    manualBgSelected = manualBgSelectedStorage.getValue();
    
    cycleBGStorage = new Storage("cycleBG", true);
    cycleBG = cycleBGStorage.getValue();
    
    const setupBackgroundSwitchListeners = (element) => {
        backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch");
        element.addEventListener("click", () => {
            if (cycleBG) {
                if (element.checked) {
                    if (!selBackgroundsIDs.includes(Number(element.id))) {
                        selBackgroundsIDs.push(Number(element.id))
                    }
                }
                else {
                    selBackgroundsIDs.splice(selBackgroundsIDs.indexOf(Number(element.id)), 1);
                }
                selectedBgsIDsStorage.setValue(selBackgroundsIDs);
            }
            else {
                backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch");
                backgroundsSwitchElement.forEach((f) => {
                    if (f !== element) f.checked = false;
                    showBackgroundCheckbox(f);
                })
                if (element.checked) {
                    manualBgSelectedStorage.setValue(element.id);
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
    
    // Works
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
        selBackgroundsIDs = selectedBgsIDsStorage.getValue();
        if (body.style.backgroundImage == 'url("undefined")') {
            body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
        }
        if (cycleBG) {
            intervalValue = intervalValueStorage.getValue();
            bgCycleHistory = bgCycleHistoryStorage.getValue();
            if (bgCycleHistory.length >= 2) {
                bgCycleHistory.splice(0, 1);
            }
            if (shuffle) {
                //cycle by shufle logic
                selBackgroundCount = selBackgroundsIDs.length;
                let rand = Math.ceil(Math.random() * selBackgroundCount - 1);
                currentLocalIndex = rand;
                currentLocalIndexStorage.setValue(selBackgroundsIDs[rand]);
                nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[rand]}.jpg")`;
            }
            else {
                currentLocalIndex = currentLocalIndexStorage.getValue();
                selBackgroundsIDs = selectedBgsIDsStorage.getValue();
                selBackgroundsIDs.sort((a, b) => a - b);
                //if index bypass length of array apply 1st background in array
                if (currentLocalIndex + 1 >= selBackgroundsIDs.length) {
                    currentLocalIndex = 0;//you were  here
                    nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[0]}.jpg")`;
                    currentLocalIndexStorage.setValue(0);
                }
                //goes to the next background
                else {
                    nextBG = `url("../src/assets/backgrounds/${selBackgroundsIDs[currentLocalIndex + 1]}.jpg")`;
                    currentLocalIndexStorage.setValue(currentLocalIndex + 1);
                }
            }
            bgCycleHistory.push(nextBG);
            bgCycleHistoryStorage.setValue(bgCycleHistory);
            body.style.backgroundImage = `${nextBG}`;
        }
        else {
            body.style.backgroundImage = `url("../src/assets/backgrounds/${manualBgSelectedStorage.getValue()}.jpg")`
        }
        if (body.style.backgroundImage == 'url("undefined")') {
            body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
        }
        setTimeout(backgroundChanger, intervalValue);
    }
    
    backgroundsSwitchElement.forEach(element => {
        setupBackgroundSwitchListeners(element);
    });
    
    for (let i = 0; i <= BACKGROUND_COUNT - 1; i++) {
        bgPathArray.push(`${BACKGROUNDS_PATH}/${i}.jpg`);
        createNewBackgroundEntry(i);
    }
    
    let shuffleSwitchBTN = new switchButton(
        shuffleSwitch,
        "shuffle",
        true,
        () => { },
        () => shuffle = true,
        () => shuffle = false
    );
    
    backgroundsSwitchElement = document.querySelectorAll(".background-entry-switch")
    backgroundChanger();
    
    let cycleBgSwitchBTN = new switchButton(
        cycleBgSwitch,
        "cycleBG",
        true,
        () => { },
        () => {
            //g
            selectAllBtn.disabled = false;
            deselectAllBtn.disabled = false;
            cycleBG = true;
            cycleBgSwitch.checked = true;
            showBgSwitchElements();
            shuffleSwitch.disabled = false;
        },
        () => {
            selectAllBtn.disabled = true;
            deselectAllBtn.disabled = true;
            cycleBG = false;
            cycleBgSwitch.checked = false;
            hideBgSwitchElements();
            shuffleSwitch.disabled = true;
        }
    )
    
    backgroundsSwitchElement.forEach((e) => {
        if (cycleBG && selBackgroundsIDs.includes(Number(e.id))) {
            e.checked = true;
        }
    })
    
    selectAllBtn.addEventListener("click", () => {
        backgroundsSwitchElement.forEach((e) => {
            e.checked = true;
            let arr = allBackgroudnsArrayCreator();
            selectedBgsIDsStorage.setValue(arr);
            selBackgroundCount = arr.length;
        })
    })
    deselectAllBtn.addEventListener("click", () => {
        backgroundsSwitchElement.forEach((e) => {
            e.checked = false;
            if (e.id == 0) e.checked = true;
            selectedBgsIDsStorage.setValue([0]);
        })
    })
    cycleBgSwitch.addEventListener("click", () => {
        if (cycleBgSwitch.checked) {
            showBgSwitchElements();
        }
        else {
            hideBgSwitchElements();
        }
    })
    intervalValueInput.addEventListener("input", () => {
        if (intervalValueInput.value <= 0 || isNaN(intervalValueInput.value)) {
            intervalValue = minToMs(1)
        }
        else {
            intervalValue = minToMs(intervalValueInput.value);
        }
        intervalValueStorage.setValue(intervalValue);
    })
    
    const backgroundEntry = document.querySelectorAll(".background-entry");
    fetch("../src/assets/backgrounds/index.json").then((response)=> {
        return response.json();
    }).then((jsondata) => {
        backgroundEntry.forEach((el) => {
            elDiv = el.firstChild;
            elLabelCheckbox = elDiv.firstChild;
            elInput = elLabelCheckbox.firstChild;
            elLabelCheckbox.title = jsondata[elInput.id]["anime"]
        })
    });
})
