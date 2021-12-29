const bookmarkWrapper = document.querySelector("#bookmark-wrapper");
const addBookmark = document.querySelector("#add-bookmark");
const addBookmarkWrapperWrapper = document.querySelector("#add-bookmark-wrapper-wrapper");
const addBookmarkCloseBtn = document.querySelector("#close-cross-btn");
const createBookmarkBtn = document.querySelector("#create-bookmark-btn");
const titleField = document.querySelector("#newBookMarkTitle");
const urlField = document.querySelector("#newBookMarkURL");
const submitBookmark = document.querySelector("#submit-bookmark");
const bookmarkSwitch = document.querySelector("#bookmark-switch");
const bookmarkNewPageSwitch = document.querySelector("#new-page-switch");
let delsBookmarks = document.querySelectorAll(".delBookmark");
let bookmarks = document.querySelectorAll(".bookmark");
let bookmarkNewTabBool = true;

const BOOKMARKS_FADE_DURATION = "200";
const REGEX_URL = /[A-z]+:\/\/(w{3}\.)?([\W\w]+)/;
const FADE_DURATION = "100"; //ms

const parseUrl = (localUrl) => {
    localUrl = localUrl.trim();
    if (localUrl.includes("http")) {
        localUrl = localUrl.match(REGEX_URL)[2];
    }
    let char = localUrl.charAt(localUrl.length - 1);
    if (char == "/") {
        localUrl = localUrl.substring(0, localUrl.length-1);
    }
    return localUrl;
}
const createBookmark = (title, url) => {
    let bookmarkImg = document.createElement("img");
    url = parseUrl(url);
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
    bookmark.appendChild(bookmarkDel);
    bookmark.appendChild(bookmarkImg);
    return bookmark;
}
const displayBookmarks = () => {
    if (localStorage.getItem("bookmarks")) {
        let arr = JSON.parse(localStorage.getItem("bookmarks"));
        arr.forEach((e) => {
            let newBookmark = createBookmark((e.title.charAt(0).toUpperCase() + e.title.slice(1)), e.url);
            addBookmark.parentNode.insertBefore(newBookmark, addBookmark);
        })
    }
}
const newBookmark = (title, url) => {
    if (url != "") {
        url = parseUrl(url);
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
        addListener(newBookmark);
        addDelListener(newBookmark.firstChild);
    }
}
const addListener = (element) => {
    if (element.id == "add-bookmark") {
        addBookmark.addEventListener("click", () => {
            addBookmarkWrapperWrapper.style.display = "block";
            setTimeout(() => addBookmarkWrapperWrapper.style.opacity = "1", 1)

        })
    }
    else {
        element.addEventListener("click", (e) => {
            if (String(element.dataset.url).includes("http")) {
                if (bookmarkNewTabBool) {
                    window.open(element.dataset.url, "_blank");
                }
                else window.location = element.dataset.url;
            }
            else {
                if (bookmarkNewTabBool) {
                    window.open(`https://${element.dataset.url}`, "_blank");
                }
                else window.location = `https://${element.dataset.url}`;
            }
        })
    }
}
const addDelListener = (element) => {
    element.addEventListener("click", (event) => {
        event.stopPropagation();
        element.parentElement.remove();
        let arr = JSON.parse(localStorage.getItem("bookmarks"));
        arr.forEach((i) => {
            if (i.url == element.parentElement.dataset.url) {
                arr.splice(arr.indexOf(i), 1);
            }
        })
        localStorage.setItem("bookmarks", JSON.stringify(arr));
    })
}

const addListeners = () => {
    bookmarks = document.querySelectorAll(".bookmark");
    bookmarks.forEach(element => {
        addListener(element);
    });
    delsBookmarks = document.querySelectorAll(".delBookmark");
    delsBookmarks.forEach((e) => {
        addDelListener(e);
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
    url = parseUrl(urlField.value);
    newBookmark(titleField.value, url);
    titleField.value = "";
    urlField.value = "";
    addBookmarkWrapperWrapper.style.opacity = "0";
    setTimeout(() => {
        addBookmarkWrapperWrapper.style.display = "none";
    }, FADE_DURATION);
})
let bookmarkNewPageSwitchBTN = new switchButton(
    bookmarkNewPageSwitch,
    "bookmarkNewPage",
    true,
    () => { },
    () => bookmarkNewTabBool = true,
    () => bookmarkNewTabBool = false
)
let bookmarkSwitchBTN = new switchButton(
    bookmarkSwitch,
    "bookmark",
    true,
    () => { },
    () => {
        bookmarkWrapper.style.display = "flex";
        setTimeout(() => {
            bookmarkWrapper.style.opacity = "1";
        }, 1);
        bookmarkNewPageSwitchBTN.enable();
    },
    () => {
        bookmarkWrapper.style.opacity = "0";
        setTimeout(() => {
            bookmarkWrapper.style.display = "none";
        }, BOOKMARKS_FADE_DURATION);
        bookmarkNewPageSwitchBTN.disable();
    }
);

displayBookmarks();
addListeners();