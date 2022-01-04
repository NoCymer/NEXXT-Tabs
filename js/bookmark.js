class Bookmark {
    static newTabBool;
    static addBookmarkEl;
    static REGEX_URL = /[A-z]+:\/\/(w{3}\.)?([\W\w]+)/;
    constructor(url, title, localStorageStr) {
        this.url = this.parseUrl(url);
        this.title = (title.charAt(0).toUpperCase() + title.slice(1));
        this.localStorageStr = localStorageStr;
        this.createElement();
        let createdBookmarkObj = {
            title: title,
            url: url
        }
        let temp = localStorage.getItem(this.localStorageStr);
        if (temp) {
            let tempArr = JSON.parse(temp);
            if (!tempArr.find(bookmark => bookmark.url === createdBookmarkObj.url)) {
                tempArr.push(createdBookmarkObj);
            }
            localStorage.setItem(this.localStorageStr, JSON.stringify(tempArr));
        } else {
            localStorage.setItem(this.localStorageStr, JSON.stringify([createdBookmarkObj]));
        }
        this.bookmarkElement.addEventListener("click", () => {
            if (String(this.bookmarkElement.dataset.url).includes("http")) {
                if (Bookmark.newTabBool) {
                    window.open(this.bookmarkElement.dataset.url, "_blank");
                }
                else window.location = this.bookmarkElement.dataset.url;
            }
            else {
                if (Bookmark.newTabBool) {
                    window.open(`https://${this.bookmarkElement.dataset.url}`, "_blank");
                }
                else window.location = `https://${this.bookmarkElement.dataset.url}`;
            }
        })
        this.bookmarkDel.addEventListener("click", (event) => {
            event.stopPropagation();
            this.bookmarkElement.remove();
            let arr = JSON.parse(localStorage.getItem(this.localStorageStr));
            arr.forEach((i) => {
                if (i.url == createdBookmarkObj.url) {
                    arr.splice(arr.indexOf(i), 1);
                }
            })
            localStorage.setItem(this.localStorageStr, JSON.stringify(arr));
        })
    }
    static retrieveBookmarks(localStorageStr) {
        let temp = localStorage.getItem(`${localStorageStr}`);
        let bookmarksArray = []
        if (temp) {
            let arr = JSON.parse(temp);
            arr.forEach((e) => {
                let newBookmark = new Bookmark(e.url, (e.title.charAt(0).toUpperCase() + e.title.slice(1)), localStorageStr);
                bookmarksArray.push(newBookmark);
            })
        }
        return bookmarksArray;
    }
    parseUrl(localUrl) {
        localUrl = localUrl.trim();
        if (localUrl.includes("http")) {
            localUrl = localUrl.match(Bookmark.REGEX_URL)[2];
        }
        let char = localUrl.charAt(localUrl.length - 1);
        if (char == "/") {
            localUrl = localUrl.substring(0, localUrl.length - 1);
        }
        return localUrl;
    }
    createElement() {
        let bookmarkImg = document.createElement("img");
        bookmarkImg.src = `https://icons.duckduckgo.com/ip3/${this.url}.ico`;
        bookmarkImg.className = "bookmark-icon";
        let bookmarkDel = document.createElement("img");
        bookmarkDel.src = "src/assets/plus.svg";
        bookmarkDel.className = "delBookmark";
        let bookmark = document.createElement("div");
        bookmark.className = "bookmark";
        bookmark.setAttribute("tabindex", "1");
        bookmark.title = this.title;
        bookmark.dataset.url = this.url;
        bookmark.appendChild(bookmarkDel);
        this.bookmarkDel = bookmarkDel;
        bookmark.appendChild(bookmarkImg);
        this.bookmarkElement = bookmark;
    }
    display() {
        Bookmark.addBookmarkEl.parentNode.insertBefore(this.bookmarkElement, Bookmark.addBookmarkEl);
    }
}