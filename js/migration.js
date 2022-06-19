const localStorageMigrationDict = {
    "manualBgSelected" : "background-static-id",
    "newScheduleFeatureShowed" : "last-version-showcased-string",
    "language" : "language-string",

    "bookmark" : "bookmark-activated-boolean",
    "bookmarkNewPage" : "bookmark-new-page-boolean",
    "bookmarks" : "bookmark-list",

    "searchEngine" : "search-engine-string", //needs manual migration  int -> string
    "googleApps" : "google-apps-activated-boolean",
    "particle" : "particle-activated-boolean",

    "countdown" : "countdown-activated-boolean",
    "ctLabel" : "countdown-label-string",
    "ctDateTime" : "countdown-datetime",

    "currentIndex" : "background-current-index-integer",
    "cycleBG" : "background-cycle-boolean",
    "shuffle" : "background-shuffle-boolean",
    "selectedBgsIDs" : "background-selected-array",
    "bgCycleHistory" : "background-cycle-history-array",
    "intervalValue" : "background-cycle-interval-integer",

    "scheduleBool" : "schedule-activated-boolean",
    "schedule" : "schedule-weekday-entries-array",
    "scheduleLastUpdate" : "schedule-last-update-integer",
    

};

let tempStorage = { };

window.addEventListener("load", () => {
    localStorage.removeItem("newUser")
    for (const key in localStorageMigrationDict) {
        try {
            tempStorage[key] = JSON.parse(localStorage.getItem(key));
        }
        catch {
            tempStorage[key] = JSON.parse(`"${localStorage.getItem(key)}"`);
        }
        localStorage.removeItem(key);
    }

    for (const key in tempStorage) {
        localStorage.setItem(localStorageMigrationDict[key], tempStorage[key]);
    }
})