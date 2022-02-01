const localREGEX = /__MSG_(\w+)__/g
const localizeHtml = () => {
    let elements = document.querySelector("html");
    elements = elements.childNodes;
    elements.forEach(element => {
        let valStr = String(element.innerHTML);
        let newVal = valStr.replace(localREGEX, (match, extracted) => {
            return extracted ? chrome.i18n.getMessage(extracted) : "";
        })
        if (newVal != valStr) {
            element.innerHTML = newVal;
        }
    });
}
localizeHtml();