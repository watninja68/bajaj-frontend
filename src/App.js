import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/bfhl';

const App = () => {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      // Validate if the input can be converted into a valid JSON array
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
      <h1>BFHL API Frontend</h1>
      
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

      {error && (
        <div className="alert error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="card">
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
