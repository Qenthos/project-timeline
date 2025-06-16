import Header from "../component/Header";
import { Link } from "react-router";
import "./Home.scss";

const Home = () => {
  return (
    <>
      <Header />
      <main className="home">
        <section className="home__section">
          <h1 className="home__title">Timeline</h1>

          <ul className="home__list home__list--primary-actions">
            <li className="home__item home__item--first-list home__item--play">
            <Link to="/settings-game" className="home__link home__link--play">
                Jouer au jeu
              </Link>
            </li>
            <li className="home__item home__item--first-list home__item--instruments">
              <Link to="/my-instruments" className="home__link home__link--discover-instruments">
                Découvir les instruments
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default Home;
