import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (person) => {
  return axios.post(baseUrl, person).then((response) => response.data);
};

const update = async (person) => {
  const response = await axios
    .put(`${baseUrl}/${person.id}`, person);
  return response.data;
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, deletePerson };
