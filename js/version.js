const versionEl = document.querySelector("#app-version");
fetch("../manifest.json").then((response)=> {
    return response.json();
}).then(jsondata => versionEl.textContent = `v${jsondata.version}`);