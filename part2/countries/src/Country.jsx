const Country = ({ countryDetails }) => {

  const languages = countryDetails.languages
  const languageKeys = Object.keys(languages)

  return (
    <div>
      <h1>{countryDetails.name.common}</h1>
      <p>capital {countryDetails.capital[0]}</p>
      <p>area {countryDetails.area}</p>

      <h3>languages</h3>
      <ul>
        {
            languageKeys.map(langKey => <li key={langKey}>{languages[langKey]}</li>)
        }
      </ul>
      <img src={countryDetails.flags.png} alt={`A country of ${countryDetails.name.common}`}/>
    </div>
  );
};

export default Country;
