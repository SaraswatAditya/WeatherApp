import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL } from "../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}&where=name%20like%20%22${inputValue}%22&limit=10`
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.results.map((city) => {
            return {
              value: `${city.coordinates.lat} ${city.coordinates.lon}`,
              label: `${city.name}, ${city.country_code} ,${city.cou_name_en}`,
            };
          }),
        };
      });
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
    console.log(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
