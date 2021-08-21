const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

//request handler
const httpPostRequestWrapper = async (url, body) =>{
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const json = await response.json();
    return json;
  }catch (err) {
    console.log('error while poll post is called ', err)
  };
}

const httpGetRequestWrapper = async (url) =>{
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  // write code here
  const response = await httpPostRequestWrapper('http://localhost:3000/poll', {user, text});
  console.log(response);
}

async function getNewMsgs() {
  // poll the server
  // write code here
  const response = await httpGetRequestWrapper('http://localhost:3000/poll');
  //return response;
  allChat = response.msg;
  render();
  setTimeout(getNewMsgs, INTERVAL);
}

function render(time) {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

let timeToMakeNextRequest = 0;
const rafTimer = async (time) =>{
  if(timeToMakeNextRequest< time){
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL;
  }
  requestAnimationFrame(rafTimer);
}



requestAnimationFrame(rafTimer);

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
getNewMsgs();
