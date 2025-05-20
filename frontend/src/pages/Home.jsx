import Header from "../component/Header";
import './Home.scss'

const Home = () => {

return (
    <>
      <Header />
      <main>
        <section>
          <h1>Timeline</h1>
          <ul>
            <li><button>Jouer au jeu</button></li>
            <li><button>Découvrir les instruments</button></li>
          </ul>
          <ul>
            <li><a href="">Créer un compte</a></li>
            <li><a href="">Se connecter</a></li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default Home;
