const Filter = ({persons, filterUpdater, onComplete}) => {
    const {filter, setFilter} = filterUpdater

    const handleOnChangeNameFilter = (event) => {
      const nameFilter = event.target.value;
      setFilter(nameFilter)

      const personsFiltered = filterPersonsByName(persons, nameFilter)
      onComplete(personsFiltered)
    };
  
    const filterPersonsByName = (thePersons, name) => {
      if (name === null || name.length === 0) {
        return thePersons
      } else {
        return thePersons.filter((p) =>
          p.name.toLowerCase().includes(name.toLowerCase())
        )
      }
    }

  return (
    <span>
      <label htmlFor="nameFilter">Filter shown with</label>
      <input id="nameFilter" value={filter} onChange={handleOnChangeNameFilter} />
    </span>
  );
};

export default Filter