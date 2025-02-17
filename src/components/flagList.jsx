import React, { useState, useEffect } from 'react';
import { getAllCountries, getCountryByName } from './countries';
import '../styles/FlagList.css';

const FlagList = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 5;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err) {
        setError('Error fetching countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCountryByName(search);
      setCountries(data);
    } catch (err) {
      setError('País no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCountries.length / countriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="containerLista">
      <h1 className="TituloLista">PAISES DEL MUNDO</h1>
      <ul className="list-group mt-4">
        {!loading && !error && currentCountries.map((country) => (
          <li key={country.cca3} className="list-group-item d-flex justify-content-center align-items-center mt-3">
            <div className="text-center">
              <img
                src={country.flags.svg}
                alt={`${country.name.common} flag`}
                width="100"
                className="mb-2"
              />
              <p className="mt-2">{country.name.common}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={prevPage} className="btn2 btn-secondary" disabled={currentPage === 1}>
          Retroceder
        </button>
        <span className="page-number">Página {currentPage}</span>
        <button onClick={nextPage} className="btn2 btn-secondary" disabled={currentPage === Math.ceil(filteredCountries.length / countriesPerPage)}>
          Adelantar
        </button>
      </div>
    </div>
  );
};

export default FlagList;