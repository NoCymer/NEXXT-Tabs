document.addEventListener("translated", () => {
    const navigationForm = $("#navigation-bar");
    const navigationInput = $("#search-bar");
    const navigationButton = $("#navigation-bar span");
    
    const search = (input) => {
        input = input.trim();
        if(input === "") return;
        const searchEngineStorage = new Storage("search-engine-string", "google");
    
        switch(searchEngineStorage.getValue()) {
            case "google": 
                window.location = `https://google.com/search?q=${input}`;
                break;
            case "duckduckgo": 
                window.location = `https://duckduckgo.com/?q=${input}`;
                break;
            case "qwant": 
                window.location = `https://qwant.com/?q=${input}`;
                break;
            case "ecosia": 
                window.location = `https://ecosia.org/search?q=${input}`;
                break;
        }  
    }
    
    navigationForm.on("submit", function(e) {
        e.preventDefault();
        e.stopPropagation();
        search(navigationInput[0].value);
    })
    
    navigationButton.click(function() {
        search(navigationInput[0].value);
    })
});
