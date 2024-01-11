import { useState } from "react";
import personService from "./services/persons";

const PersonForm = ({ persons, onCreate, onUpdate }) => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleOnChangeNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleOnChangePhoneInput = (event) => {
    setNewPhone(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const foundPerson = persons.find((person) => person.name === newName);
    if (foundPerson !== undefined) {
      const confirmUpdateMessage = `${foundPerson.name} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(confirmUpdateMessage)) {
        personService
          .update({ ...foundPerson, number: newPhone })
          .then((updatedPerson) => {
            onUpdate(updatedPerson);
          });
      }
    } else {
      const newPerson = { name: newName, number: newPhone };
      personService.create(newPerson).then((personCreated) => {
        onCreate(personCreated);
      });
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        <span>
          <label htmlFor="name">Name:</label>
          <input id="name" value={newName} onChange={handleOnChangeNameInput} />
        </span>
        <br></br>
        <span>
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            value={newPhone}
            onChange={handleOnChangePhoneInput}
          />
        </span>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
