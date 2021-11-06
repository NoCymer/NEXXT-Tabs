const bookmarkWrapper = document.querySelector("#bookmark-wrapper");
let bookmarks = document.querySelectorAll(".bookmark");
const addBookmark = document.querySelector("#add-bookmark");
const addBookmarkWrapperWrapper = document.querySelector("#add-bookmark-wrapper-wrapper");
const addBookmarkCloseBtn = document.querySelector("#close-cross-btn");
const createBookmarkBtn = document.querySelector("#create-bookmark-btn");
const titleField = document.querySelector("#newBookMarkTitle");
const urlField = document.querySelector("#newBookMarkURL");
const submitBookmark = document.querySelector("#submit-bookmark");
let delsBookmarks = document.querySelectorAll(".delBookmark");


const displayBookmarks = () => {
    let arr = JSON.parse(localStorage.getItem("bookmarks"));
    arr.forEach((e)=> {
        let bookmarkImg = document.createElement("img");
        bookmarkImg.src =`https://icons.duckduckgo.com/ip3/${e.url}.ico`;
        bookmarkImg.className="bookmark-icon";
        let bookmarkDel = document.createElement("img");
        bookmarkDel.src="src/assets/plus.svg";
        bookmarkDel.className="delBookmark"
        let bookmark = document.createElement("div");
        bookmark.className ="bookmark";
        bookmark.setAttribute("tabindex", "1");
        bookmark.title=e.url;
        bookmark.appendChild(bookmarkImg);
        bookmark.appendChild(bookmarkDel);
        addBookmark.parentNode.insertBefore(bookmark, addBookmark);
    })
    addListeners();
}

const newBookmark = (title, url) => {
    let createdBookmark = {
        title: title,
        url: url
    }
    if(localStorage.getItem("bookmarks")) {
        console.log(JSON.parse(localStorage.getItem("bookmarks")));
        let arr = JSON.parse(localStorage.getItem("bookmarks"));
        arr.push(createdBookmark);
        localStorage.setItem("bookmarks", JSON.stringify(arr));
    }
    else{
        localStorage.setItem("bookmarks", JSON.stringify([createdBookmark]));
        console.log(JSON.parse(localStorage.getItem("bookmarks")))
    }
    let createdBookmarkImg = document.createElement("img");
    createdBookmarkImg.src =`https://icons.duckduckgo.com/ip3/${url}.ico`;
    createdBookmarkImg.className="bookmark-icon";
    let bookmarkDel = document.createElement("img");
    bookmarkDel.src="src/assets/plus.svg";
    bookmarkDel.className="delBookmark"
    createdBookmark = document.createElement("div");
    createdBookmark.className ="bookmark";
    createdBookmark.setAttribute("tabindex", "1");
    createdBookmark.title=url;
    createdBookmark.appendChild(createdBookmarkImg);
    createdBookmark.appendChild(bookmarkDel);
    addBookmark.parentNode.insertBefore(createdBookmark, addBookmark);
    addListeners();
}

const addListeners = () => {
    bookmarks = document.querySelectorAll(".bookmark");
    bookmarks.forEach(element => {
        if(element.id=="add-bookmark") {
            addBookmark.addEventListener("click", () => {
                console.log("hi")
                addBookmarkWrapperWrapper.style.display = "block";
            })
        }
        else{       
            element.addEventListener("click", (e) => {
                if(String(element.title).includes("http")) {
                    window.location = element.title;
                }
                else {
                    window.location = `https://${element.title}`;
                } 
            })
        }    
    });
    delsBookmarks = document.querySelectorAll(".delBookmark");
    delsBookmarks.forEach((e)=> {
        e.addEventListener("click", (event) => {
            event.stopPropagation();
            e.parentElement.title
            e.parentElement.remove();
            let arr = JSON.parse(localStorage.getItem("bookmarks"));
            arr.forEach((i) => {
                 if (i.url == e.parentElement.title) {
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
    newBookmark(titleField.value, urlField.value);
    titleField.value = "";
    urlField.value = "";
    addBookmarkWrapperWrapper.style.display = "none";
})
displayBookmarks();
addListeners();