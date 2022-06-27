document.addEventListener("translated", () => {
    const versionEl = $("#app-version");
    const copyrightEl = $("#app-copyright");

    fetch("../manifest.json").then((response)=> {
        return response.json();
    }).then(jsondata => versionEl.text(`NEXXT Tabs™ V${jsondata.version}`));

    let year = new Date().getFullYear();
    copyrightEl.text(`© ${year} - ${year + 1} NoCymer `)
});