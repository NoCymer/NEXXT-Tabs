const searchBar = document.querySelector("#search-wrapper");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#search-button");
const searchEngine = document.querySelector("#search-engine");
let searchEnigne = 0;

if(localStorage.getItem("searchEngine") != null) {
    searchEnigne = Number(localStorage.getItem("searchEngine"));
}
const search = (input) => {
    if(localStorage.getItem("searchEngine") != null) {
        searchEnigne = localStorage.getItem("searchEngine");
    }
    if(input != "" && input != " ") {
        let url = "";
        switch(Number(searchEnigne)) {
            case 0:
                url = `https://www.google.com/search?q=${input}`;
                window.location = url;  
                break;
            case 1:
                url = `https://duckduckgo.com/?q=${input}`;
                window.location = url;  
                break;
            case 2:
                url = `https://www.ecosia.org/search?q=${input}`;
                window.location = url;  
                break;
            case 3:
                url = `https://www.qwant.com/?q=${input}`;
                window.location = url;  
                break;
        }
    }
}

searchButton.addEventListener("click", () => {
    search(searchInput.value);
})
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search(searchInput.value);
})
searchInput.addEventListener("focus", () => {
    searchInput.placeholder = "";
})
searchInput.addEventListener("focusout", () => {
    searchInput.placeholder = "Search";
})
searchEngine.value = searchEnigne;
searchEngine.onchange = () => {
    localStorage.setItem("searchEngine",searchEngine.value);
}