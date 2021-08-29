// a global called "io" is being loaded separately

const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");
let allChat = [];

/*
 *
 * Code goes here
 *
 */

const webSocket = io('http://localhost:8080', {});


webSocket.on('connect', () =>{
  console.log('Client Connected');
  presence.innerText='🟢';
});

webSocket.on('disconnect', () =>{
  console.log('client disconnected');
  presence.innerText = '🔴'
});

webSocket.on('msg:get', (event) =>{
  console.log('data received is ', event);
  try {
    allChat = event.msg;
  }catch (error) {
    console.error('error while rendering parsing the data received from server ', error);
  }
  render();
})



chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  /*
   *
   * Code goes here
   *
   */
  webSocket.emit('msg:post', {user, text, time: Date.now()});
}

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;
