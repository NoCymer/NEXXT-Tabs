const googleAppsContainer = document.querySelector("#google-apps-container");
const googleAppsSwitch = document.querySelector("#google-apps-switch");
const googleAppsButton = document.querySelector("#google-apps-btn");
const googleWrapper = document.querySelector("#google-wrapper");
const googleSites = document.querySelectorAll(".google-app-entry");
const TRANSITION_DURATION = 200; // in ms;
const TRANSITION_DURATION_SHORT = 10; // in ms;

let isGoogleAppsShown = false;
let googleAppsBool;
let displaysObjGoogle = [];

if (localStorage.getItem("googleApps")) {
    googleAppsBool = JSON.parse(localStorage.getItem("googleApps"));
    googleAppsSwitch.checked = googleAppsBool;
}
else {
    googleAppsBool = true;
    localStorage.setItem("googleApps", true);
    googleAppsSwitch.checked = true;
}
googleAppsContainer.style.width = "0%";
googleAppsContainer.style.height = "0%";
googleAppsContainer.style.top = "0%";
Array.from(googleAppsContainer.children).forEach(element => {
    displaysObjGoogle[element.id] = element.style.display;
    element.style.display = "none";
    element.style.visibility = "hidden";
});
googleSites.forEach((e) => {
    e.addEventListener("click",()=>{
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
    else{
        googleWrapper.style.opacity = "0";   
        setTimeout(() => {
            googleWrapper.style.visibility = "hidden";   
            googleWrapper.style.display = "none";
        }, TRANSITION_DURATION)
    }
}
const hideGoogleApps = () => {
    googleAppsContainer.style.width = "0%";
    googleAppsContainer.style.height = "0%";
    googleAppsContainer.style.top = "0%";
    Array.from(googleAppsContainer.children).forEach(element => {
        element.style.display = "none";
        element.style.visibility = "hidden";
    });
    setTimeout(() => {
        googleAppsContainer.style.display = "none";
        googleAppsContainer.style.visibility = "hidden";   
    }, TRANSITION_DURATION)
}
const showGoogleApps = () => {
    googleAppsContainer.style.display = "block";
    googleAppsContainer.style.visibility = "visible";
    setTimeout(() => { 
        Array.from(googleAppsContainer.children).forEach(element => {
            element.style.display = displaysObjGoogle[element.id];
            element.style.visibility = "visible";
        });
    }, TRANSITION_DURATION)
    setTimeout(() => {
        googleAppsContainer.style.width = "20%";
        googleAppsContainer.style.height = "100%";
        googleAppsContainer.style.top = "50%";
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
    updateGoogleAppsButton();
})

googleAppsButton.addEventListener("click", () => {
    if (isGoogleAppsShown) {
        hideGoogleApps();
        isGoogleAppsShown = false;
    }
    else {
        showGoogleApps();
        isGoogleAppsShown = true;
    }
})

updateGoogleAppsButton();