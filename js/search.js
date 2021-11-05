const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#search-button");

const search = (input) => {
    if(input != "" && input != " ") {
            url = `https://www.google.com/search?q=${input}`;
            window.location = url;  
    }
}

searchButton.addEventListener("click", () => {
    search(searchInput.value);
})
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search(searchInput.value);
})

