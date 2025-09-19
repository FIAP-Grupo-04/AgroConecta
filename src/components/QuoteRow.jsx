export default function QuoteRow({ name, price, direction, lastPct, lastAbs }) {
  const dirClass = direction === 1 ? "up" : direction === -1 ? "down" : "flat";
  const arrow = direction === 1 ? "▲" : direction === -1 ? "▼" : "■";
  const aria =
    direction === 1 ? "subiu" : direction === -1 ? "caiu" : "sem variação";

  return (
    <li className="quote-row">
      <span className="q-name">{name}</span>
      <span className={`q-dir ${dirClass}`} aria-label={aria}>
        {arrow}
      </span>
      <span className="q-price">{price}</span>
      <span className="q-delta">
        (
        {direction === 0 ? "0,00%" : `${lastPct.toFixed(2).replace(".", ",")}%`}{" "}
        • {lastAbs})
      </span>
    </li>
  );
}
