import "./Event.scss";

function formatDate(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const statusColors = {
  available: "#28a745",
  few_left: "#ffc107",
  full: "#dc3545",
  cancelled: "#6c757d",
  past: "#6c757d",
};

export default function Event({
  title,
  location,
  start_at,
  difficulty,
  price,
  status,
  bookable,
  status_key,
}) {
  return (
    <div className="event-item">
      <div className="image-placeholder">Placeholder image.</div>
      <div className="event-content">
        <h3 className="title">{title}</h3>
        <p className="location">{location}</p>
        <p className="start_at">{formatDate(start_at)}</p>
        <p className="difficulty">{difficulty}</p>
        <p
          className="status"
          style={{
            backgroundColor: statusColors[status_key],
            border: "1px solid black",
            borderRadius: "20px",
            padding: "5px 10px",
            textAlign: "center",
          }}
        >
          {status}
        </p>
        <p className="price">{price > 0 ? `${price} HUF` : "Ingyenes"} </p>
        <button
          style={
            !bookable
              ? { cursor: "not-allowed", backgroundColor: "gray" }
              : null
          }
        >
          Jelentkezem
        </button>
      </div>
    </div>
  );
}
