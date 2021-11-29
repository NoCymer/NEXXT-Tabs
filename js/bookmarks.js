const bookmarkWrapper = document.querySelector("#bookmark-wrapper");
const addBookmark = document.querySelector("#add-bookmark");
const addBookmarkWrapperWrapper = document.querySelector("#add-bookmark-wrapper-wrapper");
const addBookmarkCloseBtn = document.querySelector("#close-cross-btn");
const createBookmarkBtn = document.querySelector("#create-bookmark-btn");
const titleField = document.querySelector("#newBookMarkTitle");
const urlField = document.querySelector("#newBookMarkURL");
const submitBookmark = document.querySelector("#submit-bookmark");
const bookmarkSwitch = document.querySelector("#bookmark-switch");
let delsBookmarks = document.querySelectorAll(".delBookmark");
let bookmarks = document.querySelectorAll(".bookmark");

const BOOKMARKS_FADE_DURATION = "200";
const REGEX_URL = /[A-z]+:\/\/([\W\w]+)/;
const FADE_DURATION = "100"; //ms

const createBookmark = (title, url) => {
    let bookmarkImg = document.createElement("img");
    if (url.includes("http")) {
        url = url.match(REGEX_URL)[1]
    }
    bookmarkImg.src = `https://icons.duckduckgo.com/ip3/${url}.ico`;
    bookmarkImg.className = "bookmark-icon";
    let bookmarkDel = document.createElement("img");
    bookmarkDel.src = "src/assets/plus.svg";
    bookmarkDel.className = "delBookmark";
    let bookmark = document.createElement("div");
    bookmark.className = "bookmark";
    bookmark.setAttribute("tabindex", "1");
    bookmark.title = (title.charAt(0).toUpperCase() + title.slice(1));
    bookmark.dataset.url = url;
    bookmark.appendChild(bookmarkImg);
    bookmark.appendChild(bookmarkDel);
    return bookmark;
}

const displayBookmarks = () => {
    if (localStorage.getItem("bookmarks")) {
        let arr = JSON.parse(localStorage.getItem("bookmarks"));
        arr.forEach((e) => {
            let newBookmark = createBookmark((e.title.charAt(0).toUpperCase() + e.title.slice(1)), e.url);
            addBookmark.parentNode.insertBefore(newBookmark, addBookmark);
        })
        addListeners();
    }
}

const newBookmark = (title, url) => {
    if (url != "") {
        if (url.includes("http")) {
            url = url.match(REGEX_URL)[1]
        }
        let createdBookmark = {
            title: title,
            url: url
        }
        if (localStorage.getItem("bookmarks")) {
            let arr = JSON.parse(localStorage.getItem("bookmarks"));
            arr.push(createdBookmark);
            localStorage.setItem("bookmarks", JSON.stringify(arr));
        }
        else {
            localStorage.setItem("bookmarks", JSON.stringify([createdBookmark]));
        }
        let newBookmark = createBookmark(title, url);
        addBookmark.parentNode.insertBefore(newBookmark, addBookmark);
        addListeners();
    }
}

const addListeners = () => {
    bookmarks = document.querySelectorAll(".bookmark");
    bookmarks.forEach(element => {
        if (element.id == "add-bookmark") {
            addBookmark.addEventListener("click", () => {
                addBookmarkWrapperWrapper.style.display = "block";
                setTimeout(() => addBookmarkWrapperWrapper.style.opacity = "1", 1)

            })
        }
        else {
            element.addEventListener("click", (e) => {
                if (String(element.dataset.url).includes("http")) {
                    window.location = element.dataset.url;
                }
                else {
                    window.location = `https://${element.dataset.url}`;
                }
            })
        }
    });
    delsBookmarks = document.querySelectorAll(".delBookmark");
    delsBookmarks.forEach((e) => {
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

addBookmarkCloseBtn.addEventListener("click", () => {
    addBookmarkWrapperWrapper.style.opacity = "0";
    setTimeout(() => {
        addBookmarkWrapperWrapper.style.display = "none";
    }, FADE_DURATION);

})
submitBookmark.addEventListener("submit", (e) => {
    e.preventDefault();
    let url;
    if (urlField.value.includes("http")) {
        url = urlField.value.match(REGEX_URL)[1]
    }
    else {
        url = urlField.value;
    }
    newBookmark(titleField.value, url);
    titleField.value = "";
    urlField.value = "";
    addBookmarkWrapperWrapper.style.opacity = "0";
    setTimeout(() => {
        addBookmarkWrapperWrapper.style.display = "none";
    }, FADE_DURATION);
})

bookmarkSwitch.addEventListener("click", () => {
    if (bookmarkSwitch.checked) {
        bookmarkWrapper.style.display = "flex";
        setTimeout(() => {
            bookmarkWrapper.style.opacity = "1";
        }, 1);

        localStorage.setItem("bookmark", true);
    }
    else if (!bookmarkSwitch.checked) {

        bookmarkWrapper.style.opacity = "0";
        setTimeout(() => {
            bookmarkWrapper.style.display = "none";
        }, BOOKMARKS_FADE_DURATION);
        localStorage.setItem("bookmark", false);
    }
})

if (localStorage.getItem("bookmark")) {
    let bookmarkBool = JSON.parse(localStorage.getItem("bookmark"));
    if (bookmarkBool) {
        bookmarkSwitch.checked = true;
    }
    else {
        bookmarkSwitch.checked = false;
    }
    if (bookmarkBool) {
        bookmarkWrapper.style.display = "flex";
        setTimeout(() => {
            bookmarkWrapper.style.opacity = "1";
        }, 1);
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