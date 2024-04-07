import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const [text1, setText1] = useState("");
  const [result1, setResult1] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/`)
      .then((response) => {
        setMessage(response.data.dataMovies);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handlePredict = async () => {
    try {
      const response = await axios.get("http://localhost:8000/predict", {
        params: {
          text,
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error predicting sentiment:", error);
    }
  };

  const handlePredict1 = async () => {
    try {
      const response = await axios.get("http://localhost:8000/suggested", {
        params: {
          text: text1,
        },
      });
      setResult1(response.data);
    } catch (error) {
      console.error("Error predicting sentiment:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
      </header>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handlePredict}>Predict</button>
        {result && (
          <div>
            <p>Text: {result.text}</p>
            <p>Sentiment:{result.sentiment}</p>
          </div>
        )}
      </div>
      <div>
        <textarea value={text1} onChange={(e) => setText1(e.target.value)} />
        <button onClick={handlePredict1}>Predict</button>
        {result1 && (
          <div>
            <p>suggested:</p>
            <ul>
              {result1.suggested.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
