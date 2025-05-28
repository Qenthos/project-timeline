import { useState } from "react";
import { useNavigate } from "react-router";
import "./SettingsGame.scss";
import Header from "../component/Header";

const SettingsGame = () => {
  const [cards, setCards] = useState(5);
  const [timer, setTimer] = useState(30);
  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [modeGame, setModeGame] = useState("annee");
  const [isUnlimited, setIsUnlimited] = useState(false);
  // const [categoryGame, setCategoryGame] = useState("all");
  const [timeTimer, setTimeTimer] = useState(30);
  const [nbLives, setNbLives] = useState(3);

  let navigate = useNavigate();

  /**
   * change page and send data settings
   */
  const startParty = () => {
    localStorage.removeItem("tabIds");
    navigate("/timeline-composer", {
      state: {
        timer: timer,
        cards: cards,
        round: round,
        isUnlimited: isUnlimited,
        difficulty: difficulty,
        modeGame: modeGame.toLowerCase(),
        nbLives: nbLives,
      },
    });
  };

  /**
   * Settings defaults depending on difficulty
   * @param {*} evt
   */
  const handleParametersDifficulty = (evt) => {
    const difficulty = evt.currentTarget.dataset.difficulty;
    setDifficulty(difficulty);

    const tabDifficulty = {
      easy: { cards: 10, timer: 20, round: 2 },
      normal: { cards: 15, timer: 150, round: 3 },
      hard: { cards: 20, timer: 120, round: 5 },
      survival: { cards: 50, timer: "", round: 1 },
    };

    const values = tabDifficulty[difficulty];
    if (values) {
      setCards(values.cards);
      setTimer(values.timer);
      setRound(values.round);
      setTimeTimer(values.timer);
    }
  };

  //Tab of different game mode
  const tabGameMode = ["Annee", "Poids", "Taille"];

  ///tab of different difficulty
  const difficulties = [
    { key: "easy", label: "Facile" },
    { key: "normal", label: "Normal" },
    { key: "hard", label: "Difficile" },
    { key: "survival", label: "Survie" },
  ];

  return (
    <>
      <Header />
      <main className="settings">
        <section className="settings__section">
          <h1 className="settings__title">Paramètres de la partie</h1>
          <div className="settings__content">
            <ul className="settings__instrument-list">
              <li>
                <h2 className="settings__instrument-title">Mode de jeux</h2>
              </li>
              {/* boutons des instruments */}
              {tabGameMode.map((mode, index) => (
                <li className="settings__instrument-item" key={index}>
                  <button
                    onClick={() => setModeGame(mode)}
                    className={`settings__instrument-button settings__instrument-button--${mode.toLowerCase()}`}
                  >
                    {mode}
                  </button>
                </li>
              ))}
            </ul>

            {/* Difficulté */}
            <div className="settings__options">
              <h3 className="settings__options-title">Difficulté</h3>
              <ul className="settings__difficulty-list">
                {difficulties.map(({ key, label }) => (
                  <li className="settings__difficulty-item" key={key}>
                    <button
                      data-difficulty={key}
                      onClick={handleParametersDifficulty}
                      className={`settings__difficulty-button settings__difficulty-button--${key}`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="settings__parameter-title">Options</h3>
              <ul className="settings__parameter-list">
                {/* Nombre d'instruments */}
                <li className="settings__parameter-item">
                  <label htmlFor="instrument-count" className="settings__label">
                    Nombre d'instruments à placer
                  </label>
                  <div className="settings__input-group">
                    <input
                      className="settings__range"
                      type="range"
                      id="instrument-count"
                      min="5"
                      max="20"
                      step="5"
                      value={cards}
                      onChange={(e) => setCards(Number(e.target.value))}
                    />
                    <input
                      className="settings__number"
                      type="number"
                      value={cards}
                      min="5"
                      max="20"
                      step="5"
                      onChange={(e) => setCards(Number(e.target.value))}
                    />
                  </div>
                </li>

                {/* Timer */}
                <li className="settings__parameter-item">
                  <label htmlFor="game-timer" className="settings__label">
                    Timer
                  </label>
                  <div className="settings__input-group">
                    <input
                      className="settings__range"
                      type="range"
                      id="game-timer"
                      min="30"
                      max="350"
                      step="15"
                      value={isUnlimited ? 350 : timer}
                      onChange={(e) => setTimer(Number(e.target.value))}
                      disabled={isUnlimited}
                    />
                    <span className="settings__time-range-timer">
                      {timeTimer}s
                    </span>
                    <label
                      htmlFor="unlimited-timer"
                      className="settings__checkbox-label"
                    >
                      Illimité
                    </label>
                    <input
                      className="settings__checkbox"
                      type="checkbox"
                      id="unlimited-timer"
                      checked={isUnlimited}
                      onChange={(e) => setIsUnlimited(e.target.checked)}
                    />
                  </div>
                </li>

                {/* Nombre de manches */}
                <li className="settings__parameter-item">
                  <label htmlFor="round-count" className="settings__label">
                    Nombre de manches
                  </label>
                  <div className="settings__input-group">
                    <input
                      className="settings__range"
                      type="range"
                      id="round-count"
                      min="1"
                      max="5"
                      step="1"
                      value={round}
                      onChange={(e) => setRound(Number(e.target.value))}
                    />
                    <input
                      className="settings__number"
                      type="number"
                      value={round}
                      min="1"
                      max="5"
                      step="1"
                      onChange={(e) => setRound(Number(e.target.value))}
                    />
                  </div>
                </li>
              </ul>
              <button onClick={startParty} className="settings__start-button">
                Commencer la partie
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SettingsGame;
