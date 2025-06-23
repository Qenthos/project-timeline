import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import { Link } from "react-router";
import { useUserStore } from "../../stores/useStore";
import "./Home.scss";

const Home = () => {
  const { currentUser } = useUserStore();
  const username = currentUser?.username;

  return (
    <>
      <Header />
      <main className="home">
        <section className="home__section">
          <h1 className="home__title">InstruLine</h1>
          <h2 className="home__sub-title">
            Prêt à relever le défi {username ?? ""} ?
          </h2>

          <ul className="home__list home__list--primary-actions">
            <li className="home__item home__item--first-list home__item--play">
              <Link to="/settings-game" className="home__link home__link--play">
                Jouer au jeu !
              </Link>
            </li>
            <li className="home__item home__item--first-list home__item--instruments">
              <Link
                to="/my-instruments"
                className="home__link home__link--discover-instruments"
              >
                Découvrir les instruments
              </Link>
            </li>
          </ul>
          <ul className="home__list-account">
            <li>
              <Link
                to="/register"
                className="home__link-account"
              >
                Créer un compte
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="home__link-account"
              >
                Se connecter
              </Link>
            </li>
          </ul>
        </section>

        <section className="home__image">
          <img
            src="/media/instruments-home.webp"
            alt="Cartes d'instruments entassées"
            loading="lazy"
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
