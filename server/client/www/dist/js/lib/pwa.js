let defferedPrompt;
const addbtn = document.querySelector(".install_btn");
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(), (defferedPrompt = e), (addbtn.style.display = "block");
}),
    addbtn.addEventListener("click", (e) => {
        defferedPrompt.prompt(),
            defferedPrompt.userChoice.then((e) => {
                "accepted" === e.outcome && console.log("user accepted the prompt"), (defferedPrompt = null);
            });
    });
