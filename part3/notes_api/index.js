import "dotenv/config";
import express from "express";
import { Note } from "./models/note.js";

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
  next();
});

app.get("/", (request, response) => {
  response.send("<h1>Elo ziom!</h1>");
});

app.get("/api/notes", async (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
});

app.get("/api/notes/:id", async (request, response) => {
  const id = request.params.id

  try {
    const note = await Note.findById(id)
    if (note) {
      response.json(note);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    response.status(400).send({error: "malformatted id"});
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const noteId = Number(request.params.id);
  notes = notes.filter((note) => note.id !== noteId);

  response.sendStatus(204);
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "'content' is mandatory" });
  }

  const newNote = {
    content: body.content,
    important: Boolean(body.important) || false,
  };

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote);
  })  
});

app.listen(process.env.PORT || 3001);
