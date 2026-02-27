import { ExternalLink, Github, Heart, Linkedin } from 'lucide-react';

const PROJECT_GITHUB_URL = 'https://github.com/MarvinArtiga/palabra-viva';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-shell">
        <div className="footer-grid">
          <section className="footer-col">
            <p className="footer-kicker">Fuente de datos</p>
            <a
              href="https://www.dominicos.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pill"
              aria-label="Abrir dominicos.org en una nueva pestaña"
            >
              <img
                src="/icons/dominicos-logo.png"
                alt="Logo dominicos.org"
                className="footer-mini-logo"
                loading="lazy"
              />
              Fuente: dominicos.org
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <p className="footer-copy">Lecturas obtenidas desde dominicos.org.</p>
          </section>

          <section className="footer-col">
            <p className="footer-kicker">Desarrollo</p>
            <p className="footer-copy">Desarrollado por Marvin Artiga.</p>
            <p className="footer-copy">Contactame para futuros proyectos.</p>
            <a
              href="https://marvinartiga.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Abrir página web de Marvin Artiga"
            >
              <img
                src="/icons/marvin-logo.png"
                alt="Logo de Marvin Artiga"
                className="footer-mini-logo footer-mini-logo-marvin"
                loading="lazy"
              />
              Página web
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/marvin-artiga/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Abrir perfil de LinkedIn de Marvin Artiga"
            >
              <Linkedin size={14} aria-hidden="true" />
              LinkedIn
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </section>

          <section className="footer-col">
            <p className="footer-kicker">Proyecto</p>
            <a
              href={PROJECT_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-gh-link"
              aria-label="Abrir repositorio en GitHub"
            >
              <Github size={16} aria-hidden="true" />
              GitHub del proyecto
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <p className="footer-copy">
              Si te sirve, compartelo con tus familiares y amigos, puedes apoyar dando una <span aria-hidden="true">⭐</span> al proyecto en github o mandame un mensaje.
            </p>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {year} Palabra Viva</p>
          <p className="footer-bottom-made">
            Hecho con <Heart size={13} aria-hidden="true" /> para la comunidad.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
