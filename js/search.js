const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#search-button");
let searchEnigne = 2;

if(localStorage.getItem("searchEngine") != null) {
    searchEnigne = localStorage.getItem("searchEngine");
}
const search = (input) => {
    if(localStorage.getItem("searchEngine") != null) {
        searchEnigne = localStorage.getItem("searchEngine");
    }
    if(input != "" && input != " ") {
        let url = "";
        console.log(searchEnigne)
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

