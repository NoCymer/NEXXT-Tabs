class Menu {
    constructor (container, finalWidth, finalHeight, finalTop, transitionTime){
        this.container = container;
        this.finalWidth = finalWidth;
        this.finalHeight = finalHeight;
        this.finalTop = finalTop
        this.transitionTime = transitionTime;
        this.isShown = false;
        this.childrenState = [];
        Array.from(container.children).forEach(element => {
            this.childrenState[element.id] = element.style.display;
            element.style.display = "none";
            element.style.visibility = "hidden";
        });
    }
    hide() {
        console.log(this.container.id + " hidden")
        this.container.style.width = "0%";
        this.container.style.height = "0%";
        this.container.style.top = "0%";
        Array.from(this.container.children).forEach(element => {
            element.style.display = "none";
            element.style.visibility = "hidden";
        });
        setTimeout(() => {
            this.container.style.display = "none";
            this.container.style.visibillity = "hidden";
        }, this.transitionTime);             
        this.isShown = !this.isShown;
    }
    show() {
        this.container.style.display = "block";
        this.container.style.visibility = "visible";
        setTimeout(() => {
            Array.from(this.container.children).forEach(element => {
                element.style.display = this.childrenState[element.id];
                element.style.visibility = "visible";
            });
        }, this.transitionTime)
        setTimeout(() => {
            this.container.style.width = this.finalWidth;
            this.container.style.height = this.finalHeight;
            this.container.style.top = this.finalTop;
        }, 10)
        this.isShown = !this.isShown;
    }
}