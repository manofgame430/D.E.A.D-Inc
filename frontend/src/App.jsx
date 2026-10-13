import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("API connection failed");
      });
  }, []);

  return (
    <div className="app">
      <h1>SaaSlytics</h1>
      <p>API Status: {status}</p>
    </div>
  );
}

export default App;