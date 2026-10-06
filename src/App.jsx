import { useEffect, useState } from "react";
import "./App.scss";
import Event from "./components/Event.jsx";
import { Audio } from "react-loader-spinner";

function App() {
  const [eventData, setEventData] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  function sortByPriceAsc() {
    const sorted = [...eventData].sort((a, b) => a.price_huf - b.price_huf);
    setEventData(sorted);
  }

  function sortByPriceDesc() {
    const sorted = [...eventData].sort((a, b) => b.price_huf - a.price_huf);
    setEventData(sorted);
  }

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
    <>
      <div className="rendezes">
        <p>Rendezés:</p>
        <button onClick={() => sortByPriceAsc()}>Ár szerint növekvő</button>
        <button onClick={() => sortByPriceDesc()}>Ár szerint csökkenő</button>
      </div>
      <div className="events-container">
        {isLoading ? (
          <Audio
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : eventData.length > 0 ? (
          eventData.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              location={event.location}
              start_at={new Date(event.start_at)}
              price={event.price_huf}
              status={event.status?.label}
              bookable={event.status?.bookable}
              status_key={event.status?.key}
            />
          ))
        ) : (
          <p>Nincsenek eventek!</p>
        )}
      </div>
    </>
  );
}

export default App;
