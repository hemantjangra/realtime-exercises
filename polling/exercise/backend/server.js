import express from "express";
import bodyParser from "body-parser";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// feel free to take out, this just seeds the server with at least one message
msg.push({
  user: "hemant",
  text: "Hemant wants to be a geek",
  time: Date.now(),
});

// get express ready to run
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("frontend"));

app.get("/poll", function (req, res) {
  // use getMsgs to get messages to send back
  // write code here
  res.status(200).json({
    msg: getMsgs()
  })
});

app.post("/poll", function (req, res) {
  // add a new message to the server
  // write code here
  const { body } = req;
  const { text, user } = body;
  const message = {
    user,
    text,
    time: Date.now()
  }
  msg.push(message);
  console.log('message is ', message);
  res.status(201).json({status: 'Ok'});
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);
