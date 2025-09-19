import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import QuoteRow from "../components/QuoteRow";
import "../styles/quotes.css";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const response = await fetch("/data/market-prices.json");
const prices = await response.json();

export default function QuotesPage() {
  const [rows, setRows] = useState(() =>
    prices.map((p) => ({ ...p, direction: 0, lastPct: 0, lastAbs: 0 }))
  );
  const [running, setRunning] = useState(true);
  const [periodMs, setPeriodMs] = useState(2000); // intervalo entre sorteios
  const [updatedAt, setUpdatedAt] = useState(null);
  const timer = useRef(null);

  // sorteia entre -3% e +3% (exclui zero “morto”)
  function randomPct(max = 3) {
    let s = (Math.random() * max) / 100;
    if (s === 0) s = 0.01;
    return Math.random() < 0.5 ? -s : s;
  }

  const tick = () => {
    setRows((prev) =>
      prev.map((item) => {
        const pct = randomPct(3);
        const nextPrice = Math.max(
          0,
          +(item.price * (1 + pct)).toFixed(item.unit === "kg" ? 2 : 2)
        );
        const abs = +(nextPrice - item.price).toFixed(2);
        return {
          ...item,
          price: nextPrice,
          lastAbs: Math.abs(abs),
          lastPct: Math.abs(pct * 100),
          direction: abs === 0 ? 0 : abs > 0 ? 1 : -1,
        };
      })
    );
    setUpdatedAt(new Date());
  };

  // controla o loop
  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(tick, periodMs);
    return () => clearInterval(timer.current);
  }, [running, periodMs]);

  // primeira atualização após montar
  useEffect(() => {
    tick();
  }, []);

  const subtitle = useMemo(() => {
    return updatedAt
      ? `Última atualização: ${updatedAt.toLocaleTimeString("pt-BR")}`
      : "—";
  }, [updatedAt]);

  return (
    <div className="quotes-page-container">
      <Header username="Edson" />
      <main className="quotes-main">
        <h1>Cotação de Preços</h1>
        <div className="quotes-toolbar">
          <span className="last-update">{subtitle}</span>
        </div>

        <ul className="quotes-list" role="list">
          {rows.map((r) => (
            <QuoteRow
              key={r.id}
              name={r.name}
              price={BRL.format(r.price)}
              direction={r.direction} // -1 queda, 0 estável, 1 alta
              lastPct={r.lastPct} // em %
              lastAbs={BRL.format(r.lastAbs)}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
