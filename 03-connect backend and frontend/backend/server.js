import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("server is ready");
});

//get a list of 5 jokes
const jokes = [
  {
    id: 1,
    title:"hi",
    content: "Why did the scarecrow win an award? Because he was outstanding in his field!",
  },
  {
    id: 2,
    title:"hi2",
    content: "Why did the web developer stay at the restaurant? Because he wanted good server-side scripting!",
  },
  {
    id: 3,
    title:"hi3",
    content: "Parallel lines have so much in common. It's a shame they'll never meet.",
  },
  {
    id: 4,
    title:"hi4",
    content: "Why did the bicycle fall over? Because it was two-tired.",
  },
  {
    id: 5,
    title:"hi5",
    content: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  },
];

app.get("/api/jokes", (req, res) => {
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
