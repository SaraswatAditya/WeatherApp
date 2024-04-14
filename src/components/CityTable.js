import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CityTable.css";
import { GEO_API_URL } from "../api";

const CityTable = ({ onCityClick }) => {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${GEO_API_URL}&limit=20`)
      .then((response) => response.json())
      .then((data) => {
        setCityData((prevData) => [...prevData, ...data.results]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleCityClick = (cityName) => {
    // Navigate to weather page for the city
    console.log(`Navigating to weather page for ${cityName}`);
    onCityClick(cityName);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      fetchData();
    }
  };

  return (
    <div className="city-table-container" onScroll={handleScroll}>
      <table className="city-table">
        <thead>
          <tr>
            <th>GeoName ID</th>
            <th>City</th>
            <th>Country Code</th>
            <th>Country</th>
            <th>Population</th>
            <th>Timezone</th>
            <th>Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {cityData.map((city, index) => (
            <tr key={index}>
              <td>{city.geoname_id}</td>
              <td onClick={() => handleCityClick(city.name)}>
                <Link to={`/weather/${city.name}`} className="city-link">
                  {city.name}
                </Link>
              </td>
              <td>{city.country_code}</td>
              <td>{city.cou_name_en}</td>
              <td>{city.population}</td>
              <td>{city.timezone}</td>
              <td>{city.coordinates.lon},{city.coordinates.lat}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="loading-indicator">Loading...</p>}
    </div>
  );
};

export default CityTable;
