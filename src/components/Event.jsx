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

export default function Event({
  title,
  location,
  start_at,
  difficulty,
  price,
  status,
}) {
  return (
    <div className="event-item">
      <img src="" alt="" />
      <h3 className="title">{title}</h3>
      <p className="location">{location}</p>
      <p className="start_at">{formatDate(start_at)}</p>
      <p className="difficulty">{difficulty}</p>
      <p className="status">{status}</p>
      <p className="price">{price}</p>
    </div>
  );
}
