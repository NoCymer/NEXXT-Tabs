class switchButton {
    constructor(switchEl, localStorageKey, defaultState = true, clickCallback = () => { }, checkedCallback = () => { }, uncheckedCallback = () => { }) {
        this.element = switchEl;
        this.localStorageKey = localStorageKey;
        this.switchBool = defaultState;
        this.checkedCallback = checkedCallback;
        this.uncheckedCallback = uncheckedCallback;
        this.loadFromLocalStorage();
        this.element.addEventListener('click', () => {
            this.switchBool = this.element.checked ? true : false;
            this.switchBool ? checkedCallback() : uncheckedCallback();
            clickCallback();
            this.storeToLocalStorage();
        });
    }
    loadFromLocalStorage() {
        if (localStorage.getItem(String(this.localStorageKey))) {
            this.switchBool = JSON.parse(localStorage.getItem(String(this.localStorageKey)));
        }
        else {
            this.storeToLocalStorage();
        }
        this.element.checked = this.switchBool;
        this.switchBool ? this.checkedCallback() : this.uncheckedCallback();

    }
    storeToLocalStorage() {
        localStorage.setItem(String(this.localStorageKey), JSON.parse(this.switchBool));
    }

}

/*Cette vidéo est un documentaire sur la barriére de corail,
 qui est entrain de disparaitre peu à peu et est sur le point de mourrir
 à cause des produits chimiques rejetées dans la mè-re et du réchauffement climatique*/