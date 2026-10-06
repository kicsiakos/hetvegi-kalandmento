import { useEffect, useState } from "react";
import "./App.css";
import Event from "./components/Event.jsx";

function App() {
  const [eventData, setEventData] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function getPrograms() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/wp-json/hetvegi-kalandmento/all-programs");
      if (!response.ok) {
        throw new Error(`Szerver hiba: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.programs) {
        throw new Error("Hibás válaszstruktúra a szervertől.");
      }

      console.log(data["programs"]);
      setEventData(data["programs"]);
    } catch (error) {
      setError("Oops... Valami hiba történt. Kérlek próbáld újra később.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPrograms();
  }, []);

  return (
    <div className="events-container">
      {isLoading ? (
        <p>Adatok betöltése...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : eventData.length > 0 ? (
        eventData.map((event) => (
          <Event
            key={event.id}
            title={event.title}
            location={event.location}
            start_at={new Date(event.start_at)}
            price={event.price}
            status={event.status?.label}
          />
        ))
      ) : (
        <p>Nincsenek eventek!</p>
      )}
    </div>
  );
}

export default App;
