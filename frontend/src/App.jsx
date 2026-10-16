import { useState } from "react";
import HauntedMansion from "./components/HauntedMansion.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import "./App.css";
import "./Mansion.css";

/** The mansion is deliberately the first view, regardless of a previous dashboard hash. */
function App() {
  const [view, setView] = useState("mansion");

  return (
    <div className="haunted-app-shell">
      {view === "mansion" ? (
        <HauntedMansion onOpenDashboard={() => setView("dashboard")} />
      ) : (
        <Dashboard onReturnToMansion={() => setView("mansion")} />
      )}
    </div>
  );
}

export default App;
