const googleAppsContainer = document.querySelector("#google-apps-container");
const googleAppsSwitch = document.querySelector("#google-apps-switch");
const googleAppsButton = document.querySelector("#google-apps-btn");
const googleWrapper = document.querySelector("#google-wrapper");
const googleSites = document.querySelectorAll(".google-app-entry");
const TRANSITION_DURATION = 200; // in ms;
const TRANSITION_DURATION_SHORT = 10; // in ms;

let isGoogleAppsShown = false;
let googleAppsBool;
const googleAppsMenu = new Menu(
    googleAppsContainer,
    "20%",
    "100%",
    "50%",
    TRANSITION_DURATION
);
const googleAppsSwitchBTN = new switchButton(
    googleAppsSwitch,
    "googleApps",
    true,
    () => {
        updateGoogleAppsButton();
    },
    () => {
        googleAppsBool = true;
    },
    () => {
        if (isGoogleAppsShown) {
            googleAppsMenu.hide();
            isGoogleAppsShown = false;
        }
        googleAppsBool = false;
    },
);
googleAppsContainer.style.width = "0%";
googleAppsContainer.style.height = "0%";
googleAppsContainer.style.top = "0%";
googleSites.forEach((e) => {
    e.addEventListener("click", () => {
        window.open(e.id, "_blank");
    })
})
const updateGoogleAppsButton = () => {
    if (googleAppsBool) {
        setTimeout(() => {
            googleWrapper.style.display = "block";
            googleWrapper.style.visibility = "visible";
            setTimeout(() => {
                googleWrapper.style.opacity = "1";
            }, TRANSITION_DURATION_SHORT)
        }, TRANSITION_DURATION_SHORT)
    }
    else {
        googleWrapper.style.opacity = "0";
        setTimeout(() => {
            googleWrapper.style.visibility = "hidden";
            googleWrapper.style.display = "none";
        }, TRANSITION_DURATION)
    }
}
googleAppsButton.addEventListener("click", () => {
    if (isGoogleAppsShown) {
        googleAppsMenu.hide();
    }
    else {
        googleAppsMenu.show();
    }
    isGoogleAppsShown = !isGoogleAppsShown;
})

updateGoogleAppsButton();