const bookmarkWrapper = document.querySelector("#bookmark-wrapper");
let bookmarks = document.querySelectorAll(".bookmark");
const addBookmark = document.querySelector("#add-bookmark");
const addBookmarkWrapperWrapper = document.querySelector("#add-bookmark-wrapper-wrapper");
const addBookmarkCloseBtn = document.querySelector("#close-cross-btn");
const createBookmarkBtn = document.querySelector("#create-bookmark-btn");
const titleField = document.querySelector("#newBookMarkTitle");
const urlField = document.querySelector("#newBookMarkURL");
const submitBookmark = document.querySelector("#submit-bookmark");
const bookmarkSwitch = document.querySelector("#bookmark-switch");
let delsBookmarks = document.querySelectorAll(".delBookmark");
const regexURL = /[A-z]+:\/\/([\W\w]+)/;

const createBookmark = (title, url) => { 
    let bookmarkImg = document.createElement("img");
    if(url.includes("http")) {
        url = url.match(regexURL)[1]
    }
    bookmarkImg.src =`https://icons.duckduckgo.com/ip3/${url}.ico`;
    bookmarkImg.className="bookmark-icon";
    let bookmarkDel = document.createElement("img");
    bookmarkDel.src="src/assets/plus.svg";
    bookmarkDel.className="delBookmark";
    let bookmark = document.createElement("div");
    bookmark.className ="bookmark";
    bookmark.setAttribute("tabindex", "1");
    bookmark.title=(title.charAt(0).toUpperCase() + title.slice(1));
    bookmark.dataset.url=url;
    bookmark.appendChild(bookmarkImg);
    bookmark.appendChild(bookmarkDel);
    return bookmark;
}

const displayBookmarks = () => {
    let arr = JSON.parse(localStorage.getItem("bookmarks"));
    arr.forEach((e)=> {
        let newBookmark = createBookmark((e.title.charAt(0).toUpperCase() + e.title.slice(1)), e.url);
        addBookmark.parentNode.insertBefore(newBookmark, addBookmark);
    })
    addListeners();
}

const newBookmark = (title, url) => {
    if(url.includes("http")) {
        url = url.match(regexURL)[1]
    }
    let createdBookmark = {
        title: title,
        url: url
    }
    if(localStorage.getItem("bookmarks")) {
        let arr = JSON.parse(localStorage.getItem("bookmarks"));
        arr.push(createdBookmark);
        localStorage.setItem("bookmarks", JSON.stringify(arr));
    }
    else{
        localStorage.setItem("bookmarks", JSON.stringify([createdBookmark]));
    }
    let newBookmark = createBookmark(title, url);
    addBookmark.parentNode.insertBefore(newBookmark, addBookmark);
    addListeners();
}

const addListeners = () => {
    bookmarks = document.querySelectorAll(".bookmark");
    bookmarks.forEach(element => {
        if(element.id=="add-bookmark") {
            addBookmark.addEventListener("click", () => {
                addBookmarkWrapperWrapper.style.display = "block";
            })
        }
        else{       
            element.addEventListener("click", (e) => {
                if(String(element.dataset.url).includes("http")) {
                    window.location = element.dataset.url;
                }
                else {
                    window.location = `https://${element.dataset.url}`;
                } 
            })
        }    
    });
    delsBookmarks = document.querySelectorAll(".delBookmark");
    delsBookmarks.forEach((e)=> {
        e.addEventListener("click", (event) => {
            event.stopPropagation();
            e.parentElement.remove();
            let arr = JSON.parse(localStorage.getItem("bookmarks"));
            arr.forEach((i) => {
                 if (i.url == e.parentElement.dataset.url) {
                     arr.splice(arr.indexOf(i), 1);
                 }
            })
            localStorage.setItem("bookmarks", JSON.stringify(arr));
        })
    })
}

addBookmarkCloseBtn.addEventListener("click",() => {
    addBookmarkWrapperWrapper.style.display = "none";
})
submitBookmark.addEventListener("submit", (e) => {
    e.preventDefault();
    let url; 
    if(urlField.value.includes("http")) {
        url = urlField.value.match(regexURL)[1]
    }
    newBookmark(titleField.value, url);
    titleField.value = "";
    urlField.value = "";
    addBookmarkWrapperWrapper.style.display = "none";
})

bookmarkSwitch.addEventListener("click",()=> {
    if(bookmarkSwitch.checked) {  
        console.log("yes")
        bookmarkWrapper.style.display = "flex";
        localStorage.setItem("bookmark", true);
    }
    else if(!bookmarkSwitch.checked){
        console.log("no")
        bookmarkWrapper.style.display = "none";
        localStorage.setItem("bookmark", false);
    }
})

if (localStorage.getItem("bookmark")){
    let bookmarkBool = JSON.parse(localStorage.getItem("bookmark"));
    if (bookmarkBool) {
        bookmarkSwitch.checked = true;
    }
    else{
        bookmarkSwitch.checked = false;
    }
    if(bookmarkBool) {
        bookmarkWrapper.style.display = "flex";
    }
    else {
        bookmarkWrapper.style.display = "none";
    }
}
else {
    bookmarkWrapper.style.display = "flex";
    bookmarkSwitch.checked = true;
    localStorage.setItem("bookmark", true);
}


displayBookmarks();
addListeners();