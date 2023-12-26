const CountryListItem = ({countryName, onShowClick}) => {
    return <li>{countryName} <button onClick={onShowClick}>Show</button></li>
}

export default CountryListItem;