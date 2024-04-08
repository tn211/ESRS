import React, { useState } from 'react';
import './Dropdown.css';

function Dropdown() {

  const [selectedOption, setSelectedOption] = useState('');


  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleChange}>
        <option value="">Select an option</option>
        <option value="option1">Grams</option>
        <option value="option2">Litres</option>
        <option value="option3">Unit</option>
      </select>
      {selectedOption && <div>You selected: {selectedOption}</div>}
    </div>
  );
}

export default Dropdown;