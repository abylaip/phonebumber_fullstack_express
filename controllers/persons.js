const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (request, response) => {
  response.send("<h1>Persons main page</h1>");
});

personRouter.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${request.body.length} people</p>`);
});

personRouter.post("/api/persons/", (request, response) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((formattedPerson) => {
      return formattedPerson.toJSON();
    })
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      response.status(400).json({ error: "Minimum allowed length: 5" });
    });
});

personRouter.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

personRouter.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personRouter.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

personRouter.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});
module.exports = personRouter;
