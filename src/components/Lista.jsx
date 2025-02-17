import React, { useState } from 'react';

const Lista = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${search}`);
      if (!response.ok) {
        throw new Error('País no encontrado');
      }
      const data = await response.json();
      setSelectedCountry(data[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className='Titulo'>PAISES DEL MUNDO</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Busca un país"
        className="form-control mb-3"
      />
      <button onClick={handleSearch} className="btn btn-primary">
        BUSCAR
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div className="row">
        <div className="col-md-12 p-4">
          {loading && <p>Cargando...</p>}

          {!loading && !error && selectedCountry && (
            <div className="country-details">
              <h2>{selectedCountry.name.common}</h2>
              <img
                src={selectedCountry.flags.svg}
                alt={`${selectedCountry.name.common} flag`}
                width="200"
              />
              <p>
                <strong>Capital:</strong> {selectedCountry.capital}
              </p>
              <p>
                <strong>Región:</strong> {selectedCountry.region}
              </p>
              <p>
                <strong>Subregión:</strong> {selectedCountry.subregion}
              </p>
              <p>
                <strong>Población:</strong> {selectedCountry.population.toLocaleString()}
              </p>
              <p>
                <strong>Lenguas:</strong> {Object.values(selectedCountry.languages).join(', ')}
              </p>
              <p>
                <strong>Moneda:</strong> {Object.values(selectedCountry.currencies).map((currency) => currency.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lista;