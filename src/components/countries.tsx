const BASE_URL = 'https://restcountries.com/v3.1';

export const getAllCountries = async () => {
  const response = await fetch(`${BASE_URL}/all`);
  return await response.json();
};

export const getCountryByName = async (name) => {
  const response = await fetch(`${BASE_URL}/name/${name}`);
  return await response.json();
};
