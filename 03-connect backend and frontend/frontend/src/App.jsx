import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/jokes`)
      .then((res) => {
        setJokes(res.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch jokes.");
      });
  });

  return (
    <>
      <h1>ruka</h1>
      <p>JOKES: {jokes.length}</p>

      {/* if error is truth (other than not null) then second expression is runned */}
      {error && <p>{error}</p>}

      {/* we are using () intead of {} as in curly we nned to retuen it */}
      {/* if jokes is truth (other than not null) then second expression is runned */}
      {jokes.map((joke) => (
        // to optimize code for telling it is working on different elements
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;
