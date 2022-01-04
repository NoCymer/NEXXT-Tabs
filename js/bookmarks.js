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
const FADE_DURATION = "100"; //ms
Bookmark.addBookmarkEl = addBookmark;
Bookmark.retrieveBookmarks("bookmarks").forEach((e) => {
    e.display();
})
addBookmark.addEventListener("click", () => {
    addBookmarkWrapperWrapper.style.display = "block";
    setTimeout(() => {
        addBookmarkWrapperWrapper.style.opacity = "1";
    }, 10);
})
addBookmarkCloseBtn.addEventListener("click", () => {
    addBookmarkWrapperWrapper.style.opacity = "0";
    setTimeout(() => {
        addBookmarkWrapperWrapper.style.display = "none";
    }, FADE_DURATION);

})
submitBookmark.addEventListener("submit", (e) => {
    e.preventDefault();
    new Bookmark(urlField.value, titleField.value, "bookmarks").display();
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
    () => Bookmark.newTabBool = true,
    () => Bookmark.newTabBool = false
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