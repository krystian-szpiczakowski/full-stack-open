const Persons = ({ personList, onPersonDeleted }) => {
  
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {personList.map((person) => (
          <li key={person.name}>
            {person.name} {person.phone}
            <button onClick={() => onPersonDeleted(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
