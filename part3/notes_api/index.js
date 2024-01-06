import express from "express";

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("Content-Type ziom: ", req.get("Content-Type"));
  next()
})


app.get("/", (request, response) => {
  response.send("<h1>Elo ziom!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const noteId = Number(request.params.id);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    response.json(note);
  } else {
    response.sendStatus(404);
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const noteId = Number(request.params.id);
  notes = notes.filter((note) => note.id !== noteId);

  response.sendStatus(204);
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  console.log("body", body);
  if (!body.content) {
    return response.status(400).json({"error": "Note content is mandatory"});
  }

  const newNote = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(newNote)

  response.json(newNote);
});

app.listen(3001);
