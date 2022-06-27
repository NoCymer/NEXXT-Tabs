const localStorageMigrationDict = {
    "manualBgSelected" : "background-static-id",
    "newScheduleFeatureShowed" : "last-version-showcased-string",
    "language" : "language-string",

    "bookmark" : "bookmark-activated-boolean",
    "bookmarkNewPage" : "bookmark-new-page-boolean",
    "bookmarks" : "bookmark-list",

    "searchEngine" : "search-engine-string", 
    "googleApps" : "google-apps-activated-boolean",
    "particle" : "particles-activated-boolean",

    "countdown" : "countdown-activated-boolean",
    "ctLabel" : "countdown-label-string",
    "ctPosition": "",
    "ctDateTime" : "countdown-datetime",

    "currentIndex" : "background-id-current-integer",
    "cycleBG" : "background-cycle-boolean",
    "shuffle" : "background-shuffle-boolean",
    "selectedBgsIDs" : "background-id-selected-array",
    "bgCycleHistory" : "background-id-cycle-history-array",
    "intervalValue" : "background-cycle-interval-integer",

    "scheduleBool" : "schedule-activated-boolean",
    "schedule" : "schedule-weekday-entries-array",
    "scheduleLastUpdate" : "schedule-last-update-integer",
    

};

let tempStorage = { };

localStorage.removeItem("newUser")

for (const key in localStorageMigrationDict) {
    let tempStorageObject = new Storage(key, "undefined");
    if(tempStorageObject.getValue() == "undefined") {  
        localStorage.removeItem(key);
        continue;
    };
    switch(key){
        case "particle":
            //Using this storage as a check if the client is a new user
            new Storage("last-version-showcased-string", "1.3.3");
            break;
        case "schedule":
            tempStorage[key] = "";
            break;
        case "ctPosition" :
            const pos = JSON.parse(localStorage.getItem(key));
            const upperSelectionStorage = new Storage("display-upper-selection", "none");
            const lowerSelectionStorage = new Storage("display-lower-selection", "none");
            pos == 0 ? upperSelectionStorage.setValue("countdown") : "";
            pos == 1 ? lowerSelectionStorage.setValue("countdown"): "";
            break;
        case "searchEngine" :
            const intToStringSearchEngine = {
                0 : "google",
                1 : "duckduckgo",
                2 : "ecosia",
                3 : "qwant",
            };
            tempStorage[key] =intToStringSearchEngine[tempStorageObject.getValue()];
            break;
        case "bgCycleHistory" : 
            tempStorage[key] = [];
            break;
        case "intervalValue" : 
            const unitStorage = new Storage("background-cycle-interval-unit-string", "sec")
            let valueInSeconds = tempStorageObject.getValue() / 1000;
            unitStorage.setValue(valueInSeconds >= 60 ? "min" : "sec");
            tempStorage[key] = valueInSeconds >= 60 ? valueInSeconds / 60 : valueInSeconds;

            break;

        default:
            tempStorage[key] = tempStorageObject.getValue();
            break;
        }
    localStorage.removeItem(key);
}

for (const key in tempStorage) {
    localStorage.setItem(localStorageMigrationDict[key], JSON.stringify(tempStorage[key]));
}

document.dispatchEvent(new Event("migration-complete"));