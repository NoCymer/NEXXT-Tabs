const switchEL = document.querySelector("#google-apps-switch");
let switchBtn = new switchButton(
    switchEL,
    "nigga",
    false,
    () => console.log("clicked"),
    () => console.log("checked"),
    () => console.log("unchecked")
);
