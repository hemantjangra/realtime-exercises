const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");

// this will hold all the most recent messages
let allChat = [];

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  // request options
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  // send POST request
  // we're not sending any json back, but we could
  await fetch("/msgs", options);
}

async function getNewMsgs() {
  /*
   *
   * code goes here
   *
   */
  let reader;
  const utfDecoder = new TextDecoder('utf-8');
  try {
    const data = await fetch("/msgs");
    reader = data.body.getReader();
  }catch (error){
    console.log('error while streaming data is ', error);
  }
  presence.innerText = '🟢';
  let done;
  do {
    let responseReader;
    try {
      responseReader = await reader.read();
    } catch (error) {
      console.error('error while streaming', error);
      presence.innerText = '🔴';
      return;
    }

    const chunk = utfDecoder.decode(responseReader.value, { stream: true });
    done = responseReader.done;
    console.log('data while streaming is ', chunk);
    if(chunk){
      try{
        const json = JSON.parse(chunk);
        allChat = json.msg;
        render();
      }catch (error) {
        console.log('parse error while streaming is: ', error);
      }
    }
  }while(!done);
  presence.innerText = '🔴';
}

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

getNewMsgs();
