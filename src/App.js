import React, { useState } from 'react';
import './App.css';

const API_URL = 'https://bajaj-backend-eqd9.onrender.com/bfhl';

const App = () => {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFields, setSelectedFields] = useState({
    is_success: true,
    user_id: true,
    email: true,
    roll_number: true,
    numbers: true,
    alphabets: true,
    highest_lowecase_alphabet: true
  });

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const handleFieldChange = (field) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const dataArray = inputData.split(',').map(item => item.trim());
      if (!Array.isArray(dataArray) || dataArray.some(item => item === '')) {
        throw new Error('Invalid input format. Please enter valid JSON.');
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataArray }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGetRequest = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>21BLC1591</h1>
      <h2>BFHL API Frontend</h2>
      <div className="card">
        <h2>POST Request</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputData}
            onChange={handleInputChange}
            placeholder="Enter numbers and alphabets separated by commas"
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="card">
        <h2>GET Request</h2>
        <button onClick={handleGetRequest}>Send GET Request</button>
      </div>

      <div className="card">
        <h2>Select Fields to Display</h2>
        {Object.keys(selectedFields).map(field => (
          <label key={field}>
            <input
              type="checkbox"
              checked={selectedFields[field]}
              onChange={() => handleFieldChange(field)}
            />
            {field}
          </label>
        ))}
      </div>

      {error && (
        <div className="alert error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="card">
          <h2>Response</h2>
          <pre>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(response).filter(([key]) => selectedFields[key])
              ),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;