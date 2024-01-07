import express, { application } from "express";
import morgan from "morgan";

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res)
    ].join(" ");
  })
);

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/api/persons", (request, response) => {
  return response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const parsedId = Number(request.params.id);

  const person = persons.find((p) => p.id === parsedId);
  if (person) {
    return response.json(person);
  } else {
    response.statusMessage = `Person with id '${id}' does not exist`;
    return response.sendStatus(404);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const parseId = Number(id);

  const person = persons.find((p) => p.id === parseId);
  if (person) {
    persons = persons.filter((p) => p.id !== parseId);
    response.statusMessage = `Person with id '${id}' deleted`;
    response.sendStatus(204);
  } else {
    response.statusMessage = `Person with id '${id}' doesn't exist`;
    response.sendStatus(404);
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const errors = validateNewPersonRequest(body);
  if (errors.length > 0) {
    return response.status(400).json({
      errors: errors,
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  return response.status(201).json(newPerson);
});

const validateNewPersonRequest = (person) => {
  const errors = [];

  if (!person.name) {
    errors.push({
      error: "name is mandatory",
    });
  }

  if (!person.number) {
    errors.push({
      error: "number is mandatory",
    });
  }

  const duplicatedPerson = persons.find(
    (p) => p.name.toLowerCase() === person.name.toLowerCase()
  );
  if (duplicatedPerson) {
    errors.push({
      error: "name must be unique",
    });
  }

  return errors;
};

app.get("/info", (request, response) => {
  const currentDate = new Date();
  const phonebookEntriesNumber = persons.length;

  response.send(
    `<p>Phonebook has info for ${phonebookEntriesNumber} people</p><p>${currentDate}</p>`
  );
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};
