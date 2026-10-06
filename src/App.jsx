import { useEffect, useState } from "react";
import "./App.css";
import Event from "./components/Event.jsx";

function App() {
  const [eventData, setEventData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function getPrograms() {
    try {
      setIsLoading(true);
      const response = await fetch("/wp-json/hetvegi-kalandmento/all-programs");
      const data = await response.json();
      console.log(data["programs"]);
      setEventData(data["programs"]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPrograms();
  }, []);

  return (
    <div className="events-container">
      {eventData && eventData.length > 0
        ? eventData.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              location={event.location}
              start_at={event.start_at}
              price={event.price}
              status={event.status['label']}
            />
          ))
        : "Jelenleg nincsenek események."}
    </div>
  );
}

export default App;
