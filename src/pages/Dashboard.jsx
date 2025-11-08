import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <>
      <Header />

      <main className="dashboard-main">
        <section className="dashboard-section">
          <div className="dashboard-cards" />

          <div className="assist-content">
            <DashboardCard
              imgSrc="/images/cart-shopping.png"
              title="Marketplace de Alimentos"
              text="Venda direta do produtor para o consumidor"
              onClick={() => (window.location.href = "/marketplace")}
            />
            <DashboardCard
              imgSrc="/images/graph.png"
              title="Cotação de Preços"
              text="Consulte valores atualizados do Ceasa"
              onClick={() => (window.location.href = "/cotacoes")}
            />
          </div>

          <div className="assist-content">
            <DashboardCard
              imgSrc="/images/book.png"
              title="Troca de Conhecimentos"
              text="Compartilhe experiências com outros produtores"
              onClick={() => (window.location.href = "/social")}
            />
          </div>
        </section>

        <div className="video-youtube">
          <p>
            Clique para assistir ao vídeo:
            <span>
              <a
                href="https://www.youtube.com/watch?v=TwPxlP_ZmtU"
                target="_blank"
                rel="noreferrer"
              >
                assistir agora
              </a>
            </span>
          </p>
        </div>
      </main>
    </>
  );
}
