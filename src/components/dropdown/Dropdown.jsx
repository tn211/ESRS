import React, { useState } from 'react'; // Importing React and useState hook from React
import './Dropdown.css'; // Importing CSS file for styling

function Dropdown() {

  const [selectedOption, setSelectedOption] = useState(''); // Initializing state for selected option using useState hook

// Function to handle changes in dropdown selection
  const handleChange = (event) => {
    setSelectedOption(event.target.value); // Updating selectedOption state with the value of the selected option
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
// Updating selectedOption state with the value of the selected option
export default Dropdown;