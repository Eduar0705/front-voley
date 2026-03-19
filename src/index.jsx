import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";

export default function Index() {
    return (
        <main className="main-index">
            <Header />
            <Menu />

            <section className="hero-section animate-fade">
                <div className="hero-container">
                    <div className="hero-content">
                        <span className="hero-badge">Temporada 2026</span>
                        <h1 className="hero-title">Pasión por el <span>Voleibol</span></h1>
                        <p className="hero-description">
                            Únete a los equipos Inter Universitario del IUJO Barquisimeto
                            y demuestra tu talento en la cancha del IUJO.
                        </p>
                        <div className="hero-cta">
                            <a href="/registro" className="btn btn-primary btn-lg">Registra tu equipo</a>
                            <a href="#" className="btn btn-secondary btn-lg">Ver Partidos</a>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-circle"></div>
                        <img src="/balon.png" alt="Voley Hero" className="hero-img-floating" />
                    </div>
                </div>
            </section>
        </main>
    );
}