import axios from "axios"

async function fetchAllCountries() {
    console.log("Fetching countries...")

    const response = await axios.get("http://localhost:3001/countries")

    console.log("Fetching completed")

    return response.data
}

export default {fetchAllCountries}