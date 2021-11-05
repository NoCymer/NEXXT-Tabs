const settingsBtn = document.querySelector("#settings-button");
const settingsEl = document.querySelector("#settings-page-wrapper");
let isShown = false;

const toggleSettings = () => {
    if (isShown){
        settingsEl.style.width = "0%";
        settingsEl.style.height = "0%";
        settingsEl.style.top= "0%";
        setTimeout(()=> {
            settingsEl.style.display="none";
            settingsEl.style.visibility="hidden";
        },300)
        isShown = false;
    }
    else if (!isShown){
        settingsEl.style.display="block";
        settingsEl.style.visibility="visible";
        setTimeout(()=> {
            settingsEl.style.width = "40%";
            settingsEl.style.height = "100%";
            settingsEl.style.top= "50%";
        },10)
        
        isShown = true;
    }    
}

settingsBtn.addEventListener("click", () => {
    toggleSettings();
})
