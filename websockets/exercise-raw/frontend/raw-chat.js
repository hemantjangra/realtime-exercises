const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");
let allChat = [];

// listen for events on the form
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});




/*
 *
 * your code goes here
 *
 */

// const ws = new WebSocket('ws://localhost:8080', ['json']);
const ws = new WebSocket("ws://localhost:8080", ["json"]);
ws.addEventListener('open', (event) =>{
  console.log('connected');
  presence.innerText = '🟢';
});

ws.addEventListener('message', (event)=>{
  try {
    const data = JSON.parse(event.data).msg;
    allChat = data;
    render();
  }catch (err){
    console.log('Parsing error while websocket received message', event.data);
  }

});

ws.addEventListener('close', (event) =>{
  console.log('websocket connection disconnected');
  presence.innerText = '🔴';
})

async function postNewMsg(user, text) {
  // code goes here
  ws.send(JSON.stringify({ user, text }));
}

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;
