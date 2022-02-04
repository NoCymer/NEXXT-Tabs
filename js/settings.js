document.addEventListener("translated", () => {
    const settingsBtn = document.querySelector("#settings-button");
    const settingsEl = document.querySelector("#settings-page-wrapper");
    const generalNavBtn = document.querySelector("#general-nav-button");
    const backgroundNavBtn = document.querySelector("#background-nav-button");
    const infoNavBtn = document.querySelector("#info-nav-button");
    const generalPage = document.querySelector("#general-page");
    const backgroundPage = document.querySelector("#background-page");
    const infoPage = document.querySelector("#info-page");
    const searchBar = document.querySelector("#search-wrapper")
    
    let pageIndex = 0;
    let isShown = false;
    
    generalPage.style.display = "none";
    generalPage.style.visibility = "hidden";
    
    backgroundPage.style.display = "none";
    backgroundPage.style.visibility = "hidden";
    
    infoPage.style.display = "none";
    infoPage.style.visibility = "hidden";
    
    const setSettingsPage = (index) => {
        switch (index) {
            case 0:
                generalNavBtn.style.borderBottom = "#ffffff solid 1px";
                backgroundNavBtn.style.borderBottom = "";
                infoNavBtn.style.borderBottom = "";
    
                generalPage.style.display = "block";
                backgroundPage.style.display = "none";
                infoPage.style.display = "none";
    
                generalPage.style.visibility = "visible";
                backgroundPage.style.visibility = "hidden";
                infoPage.style.visibility = "hidden";
                break;
            case 1:
                generalNavBtn.style.borderBottom = "";
                backgroundNavBtn.style.borderBottom = "#ffffff solid 1px";
                infoNavBtn.style.borderBottom = "";
    
                generalPage.style.display = "none";
                backgroundPage.style.display = "block";
                infoPage.style.display = "none";
    
                generalPage.style.visibility = "hidden";
                backgroundPage.style.visibility = "visible";
                infoPage.style.visibility = "hidden";
                break;
            case 2:
                generalNavBtn.style.borderBottom = "";
                backgroundNavBtn.style.borderBottom = "";
                infoNavBtn.style.borderBottom = "#ffffff solid 1px";
    
                generalPage.style.display = "none";
                backgroundPage.style.display = "none";
                infoPage.style.display = "block";
    
                generalPage.style.visibility = "hidden";
                backgroundPage.style.visibility = "hidden";
                infoPage.style.visibility = "visible";
                break;
        }
    }
    
    const settingsMenu = new Menu(
        settingsEl,
        "38%",
        "100%",
        "50%",
        200
    );
    
    settingsEl.style.width = "0%";
    settingsEl.style.height = "0%";
    settingsEl.style.top = "0%";
    settingsBtn.addEventListener("click", () => {
        if (isShown) {
            settingsMenu.hide();
            searchBar.style.width = "38%";
            settingsBtn.style.transform = "rotate(90deg)";
        }
        else {
            settingsMenu.show();
            searchBar.style.width = "29%";
            settingsBtn.style.transform = "rotate(0deg)";
            setTimeout(() => {setSettingsPage(pageIndex);}, 200)
        }
        isShown = !isShown;
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
})
