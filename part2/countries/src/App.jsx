import { useState, useEffect } from "react";

import countryService from "./services/countries";
import Country from "./Country";
import CountryListItem from "./CountryListItem";

function App() {
  const [countries, setCountries] = useState(null);
  const [countryFilter, setCountryFilter] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesResponse = await countryService.fetchAllCountries();
      setCountries(countriesResponse);
    };

    fetchCountries();
  }, []);

  const handleFilterChanged = (event) => {
    const newFilterValue = event.target.value;
    setCountryFilter(newFilterValue);
    setSelectedCountryCode(null);
  };

  const handleShowClick = (countryCode) => {
    setSelectedCountryCode(countryCode);
  };

  if (!countries) {
    return null;
  }

  console.log("Filter value", countryFilter);
  let filteredCountries;
  if (countryFilter && countryFilter.trim() !== "") {
    filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase()?.includes(countryFilter.toLowerCase())
    );
  } else {
    filteredCountries = countries;
  }

  const isTooMany = filteredCountries.length > 10;
  const isMultipleMatches = filteredCountries.length > 1;
  const isShowList = !isTooMany && isMultipleMatches;
  const isCountryNotFound = filteredCountries.length === 0;
  let selectedCountry;
  if (filteredCountries.length === 1) {
    selectedCountry = filteredCountries[0];
  } else if (selectedCountryCode) {
    selectedCountry = filteredCountries.find(
      (c) => c.cca3 === selectedCountryCode
    );
  }

  return (
    <div>
      <label htmlFor="search-input">Find countries</label>
      <input
        id="search-input"
        value={countryFilter}
        onChange={handleFilterChanged}
      />
      {isTooMany && <p style={{ color: "red" }}>Too many</p>}
      {isCountryNotFound && (
        <p style={{ color: "black" }}>Countries not found for given criteria</p>
      )}
      {isShowList && (
        <ul>
          {filteredCountries.map((c) => (
            <CountryListItem
              key={c.cca3}
              countryName={c.name.common}
              onShowClick={() => handleShowClick(c.cca3)}
            />
          ))}
        </ul>
      )}
      {selectedCountry && <Country countryDetails={selectedCountry} />}
    </div>
  );
}

export default App;
