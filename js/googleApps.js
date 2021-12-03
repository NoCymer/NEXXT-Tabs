const googleAppsContainer = document.querySelector("google-apps-container");
const googleAppsSwitch = document.querySelector("google-apps-switch");
const googleAppsButton = document.querySelector("google-apps-btn");
const TRANSITION_DURATION = 500; // in ms;
const TRANSITION_DURATION_SHORT = 10; // in ms;

let isGoogleAppsShown = false;
let googleAppsBool;

if (localStorage.getItem("googleApps")) {
    googleAppsBool = JSON.parse(localStorage.getItem("googleApps"));
    googleAppsSwitch.checked = googleAppsBool;
}
else {
    googleAppsBool = true;
    localStorage.setItem("googleApps", true);
}

const hideGoogleApps = () => {
    setTimeout(() => {
        googleAppsContainer.style//here
    }, TRANSITION_DURATION)
}

const showGoogleApps = () => {
    setTimeout(() => {

    }, TRANSITION_DURATION_SHORT)
}

googleAppsSwitch.addEventListener("click", () => {
    if (googleAppsSwitch.checked) {
        googleAppsBool = true;
    }
    else {
        googleAppsBool = false;
    }
    localStorage.setItem("googleApps", googleAppsBool);
})

googleAppsButton.addEventListener("click", () => {
    if (isGoogleAppsShown) {
        hideGoogleApps();
    }
    else {
        showGoogleApps();
    }
})
