import { useState, useEffect } from "react";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Filter from "./Filter";
import Notification from "./Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [personsDisplayed, setPersonsDisplayed] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((fetchedPersons) => {
      setPersons(fetchedPersons);
      setPersonsDisplayed(fetchedPersons);
    });
  }, []);

  const onCreate = (createdPerson, errors) => {
    setFilter("");
    if (errors) {
      console.log("Błont", errors)
      const message = errors.map(err => err.error).join("\n")
      setNotification({message: message, isError: true})
    } else {
      const updatedPersons = persons.concat(createdPerson);
      setPersons(updatedPersons);
      setPersonsDisplayed(updatedPersons);
  
      setNotification({
        message: `Contact ${createdPerson.name} has been added`,
        isError: false,
      });
    }

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const onUpdate = (updatedPerson) => {
    const updatedPersons = persons.map((p) =>
      p.id !== updatedPerson.id ? p : updatedPerson
    );
    setPersons(updatedPersons);
    setPersonsDisplayed(updatedPersons);
    setFilter("");

    setNotification({
      message: `Contact ${updatedPerson.name} has been updated`,
      isError: false,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const onFilterComplete = (personsFiltered) => {
    setPersonsDisplayed(personsFiltered);
  };

  const handlePersonDelete = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    const confirmMessage = `Delete ${personToDelete.name}?`;
    if (window.confirm(confirmMessage)) {
      personService
        .deletePerson(id)
        .then(() => {
          const updatedPersons = persons.filter((p) => p.id !== id);
          setPersons(updatedPersons);
          setPersonsDisplayed(updatedPersons);

          setNotification({
            message: `Contact ${personToDelete.name} has been deleted`,
            isError: false,
          });
      
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
          
          setNotification({
            message: `Contact ${personToDelete.name} has already been deleted from server`,
            isError: true,
          });
      
          setTimeout(() => {
            setNotification(null);
          }, 3000);

          const updatedPersons = persons.filter(p => p.id !== id)
          setPersons(updatedPersons)
          setPersonsDisplayed(updatedPersons)
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification?.message}
        isError={notification?.isError}
      />
      <Filter
        persons={persons}
        filterUpdater={{ filter, setFilter }}
        onComplete={onFilterComplete}
      />
      <PersonForm persons={persons} onCreate={onCreate} onUpdate={onUpdate} />
      <Persons
        personList={personsDisplayed}
        onPersonDeleted={handlePersonDelete}
      />
    </div>
  );
};

export default App;
