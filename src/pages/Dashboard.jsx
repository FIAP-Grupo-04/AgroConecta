import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  const username = "Edson";

  const disabledNav = [
    { id: "sobre", label: "Sobre", href: "#", disabled: true },
    { id: "termos", label: "Termos", href: "#", disabled: true },
    { id: "contato", label: "Contato", href: "/contato" },
  ];

  return (
    <>
      <Header username={username} navLinks={disabledNav} />

      <main className="dashboard-main">
        <section className="dashboard-section">
          <div className="dashboard-cards" />

          <div className="assist-content">
            <DashboardCard
              imgSrc="/images/cart-shopping.png"
              title="Marketplace de Alimentos"
              text="Venda direta do produtor para o consumidor"
              disabled
            />
            <DashboardCard
              imgSrc="/images/graph.png"
              title="Cotação de Preços"
              text="Consulte valores atualizados do Ceasa"
              disabled
            />
          </div>

          <div className="assist-content">
            <DashboardCard
              imgSrc="/images/person.png"
              title="Mão de Obra e Serviços"
              text="Encontre ou ofereça vagas legalizadas ou serviços"
              disabled
            />
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
                href="https://youtu.be/8TQbfC-4h1g?si=nfkYI0-uHPeyliyR"
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
