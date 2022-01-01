class Storage{
    constructor(key, defaultValue = "") {
        this.key = key;
        let temp = localStorage.getItem(`${this.key}`)
        if (temp) {
            this.value = JSON.parse(temp);
        }
        else {
            this.value = defaultValue;
            localStorage.setItem(`${this.key}`, JSON.stringify(this.value));
        }
    }
    setValue(newValue) {
        this.value = newValue;
        localStorage.setItem(`${this.key}`, JSON.stringify(this.value));
    }
    getValue() {
        return this.value;
    }
}