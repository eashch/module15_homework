const inputMessage = document.querySelector(".message__input");
const buttonSend = document.querySelector(".message__button-send");
const buttonGeolocation = document.querySelector(".message__button-geolocation");
const chatContainer = document.querySelector(".chat");

const geolocationSite = `https://www.openstreetmap.org/#map=18`;

const createNewMSG = (msg, isSelf) => {
    const newMsg = document.createElement("div");
    chatContainer.appendChild(newMsg);
    newMsg.classList.add("chat__message");
    newMsg.classList.add(isSelf ? "message-self" 
                                : "message-other-person");
    newMsg.classList.add("bordered");
    newMsg.classList.add("text");
    newMsg.innerHTML = msg;
    return newMsg;
};


const webSocket = new WebSocket("wss://echo-ws-service.herokuapp.com/");

webSocket.onmessage = (msg) => {
    createNewMSG(msg.data, false);
};

webSocket.onerror = (error) => {
    createNewMSG(`Error: ${error}`, true);
};

buttonSend.addEventListener("click", () => {
    if (inputMessage.value === "")
        return;
    webSocket.send(inputMessage.value);
    createNewMSG(inputMessage.value, true);
});


const onGeolocationError = () => {
    buttonGeolocation.style.opacity = 0.5;
    buttonGeolocation.style.backgroundColor = "#646b7a";
};

if (!navigator.geolocation) {
    onGeolocationError();
} else {
    buttonGeolocation.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const newMSG = createNewMSG("", true);
            const geoLocation = `<a href="${geolocationSite}/${position.coords.latitude}/${position.coords.longitude}">Geolocation</a>`;
            newMSG.innerHTML = geoLocation;
        }, onGeolocationError);
    });
}
