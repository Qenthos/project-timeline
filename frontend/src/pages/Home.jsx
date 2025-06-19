import Header from "../component/Header";
import { Link } from "react-router";
import "./Home.scss";

const Home = () => {
  return (
    <>
      <Header />
      <main className="home">
        <section className="home__section">
          <h1 className="home__title">InstruLine</h1>
          <h2 className="home__sub-title">Prêt à relever le défi ?</h2>
          <ul className="home__list home__list--primary-actions">
            <li className="home__item home__item--first-list home__item--play">
            <Link to="/settings-game" className="home__link home__link--play">
                Jouer au jeu !
              </Link>
            </li>
            <li className="home__item home__item--first-list home__item--instruments">
              <Link to="/my-instruments" className="home__link home__link--discover-instruments">
                Découvrir les instruments
              </Link>
            </li>
          </ul>
        </section>
        
        <section className="home__image">
          <img
            src="/media/piano-bg.jpg"
            alt="Manette de jeu colorée"
            loading="lazy"
          />
        </section>
      </main>
    </>
  );
};

export default Home;
