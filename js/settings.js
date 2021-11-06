const settingsBtn = document.querySelector("#settings-button");
const settingsEl = document.querySelector("#settings-page-wrapper");
const generalNavBtn = document.querySelector("#general-nav-button");
const backgroundNavBtn = document.querySelector("#background-nav-button");
const infoNavBtn = document.querySelector("#info-nav-button");
const generalPage = document.querySelector("#general-page");
const backgroundPage = document.querySelector("#background-page");
const infoPage = document.querySelector("#info-page");

let pageIndex = 0;
let isShown = false;
let displaysObj = {};

Array.from(settingsEl.children).forEach(element => {
    displaysObj[element.id] = element.style.display;
    element.style.display="none";
    element.style.visibility="hidden";
});
generalPage.style.display="none";
backgroundPage.style.display="none";
infoPage.style.display="none";

generalPage.style.visibility="hidden";
backgroundPage.style.visibility="hidden";
infoPage.style.visibility="hidden";
const setSettingsPage = (index) => {
    switch (index){
        case 0:
            generalNavBtn.style.borderBottom="#ffffff solid 1px";
            backgroundNavBtn.style.borderBottom="";
            infoNavBtn.style.borderBottom="";

            generalPage.style.display="block";
            backgroundPage.style.display="none";
            infoPage.style.display="none";

            generalPage.style.visibility="visible";
            backgroundPage.style.visibility="hidden";
            infoPage.style.visibility="hidden";
            break;
        case 1:
            generalNavBtn.style.borderBottom="";
            backgroundNavBtn.style.borderBottom="#ffffff solid 1px";
            infoNavBtn.style.borderBottom="";

            generalPage.style.display="none";
            backgroundPage.style.display="block";
            infoPage.style.display="none";

            generalPage.style.visibility="hidden";
            backgroundPage.style.visibility="visible";
            infoPage.style.visibility="hidden";
            break;
        case 2:
            generalNavBtn.style.borderBottom="";
            backgroundNavBtn.style.borderBottom="";
            infoNavBtn.style.borderBottom="#ffffff solid 1px";

            generalPage.style.display="none";
            backgroundPage.style.display="none";
            infoPage.style.display="block";

            generalPage.style.visibility="hidden";
            backgroundPage.style.visibility="hidden";
            infoPage.style.visibility="visible";
            break;
    }
}


const toggleSettings = () => {
    if (isShown){
        settingsEl.style.width = "0%";
        settingsEl.style.height = "0%";
        settingsEl.style.top= "0%";
        searchBar.style.width = "38%";
        Array.from(settingsEl.children).forEach(element => {
            element.style.display="none";
            element.style.visibility="hidden";
        });
        setTimeout(()=> {
            settingsEl.style.display="none";
            settingsEl.style.visibility="hidden";
            
        },300)   
        settingsBtn.style.transform="rotate(90deg)";
        isShown = false;
    }
    else if (!isShown){
        settingsEl.style.display="block";
        settingsEl.style.visibility="visible";
        searchBar.style.width = "34%";
        setTimeout(()=> {
            Array.from(settingsEl.children).forEach(element => {
                element.style.display=displaysObj[element.id];
                element.style.visibility="visible";
            });
            setSettingsPage(pageIndex);
        },200)
        setTimeout(()=> {
            settingsEl.style.width = "32%";
            settingsEl.style.height = "100%";
            settingsEl.style.top= "50%";
            settingsBtn.style.transform="rotate(0deg)";
        },10)
        isShown = true;
        
    }    
}

settingsBtn.addEventListener("click", () => {
    toggleSettings();
    
})

generalNavBtn.addEventListener("click", () => {
    pageIndex = 0;
    setSettingsPage(pageIndex);
})
backgroundNavBtn.addEventListener("click", () => {
    pageIndex = 1;
    setSettingsPage(pageIndex);
})
infoNavBtn.addEventListener("click", () => {
    pageIndex = 2;
    setSettingsPage(pageIndex);
})

