import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
  user: "brian",
  text: "hi",
  time: Date.now(),
});

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

/*
 *
 * Code goes here
 *
 */

const ws = new Server(server);

ws.on('connect', (socket) =>{
  console.log('server connected on ', socket.id);

  socket.on('disconnect', (ev)=>{
    console.log('server disconnected with id', socket.id);
  });

  socket.on('msg:post', (ev)=>{
    console.log('data on server while post is', ev);
    const{ user, text, time } = ev;
    msg.push({user, text, time});
    ws.emit('msg:get', {msg:(getMsgs())});
  })

  ws.emit('msg:get', {msg:(getMsgs())});
});



const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
