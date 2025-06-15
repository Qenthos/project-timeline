import { useState } from "react";
import { useNavigate } from "react-router";
import "./SettingsGame.scss";
import Header from "../component/Header";

const SettingsGame = () => {
  const [cards, setCards] = useState(5);
  const [timer, setTimer] = useState(30);
  const [difficulty, setDifficulty] = useState("easy");
  const [modeGame, setModeGame] = useState("annee");
  const [isUnlimited, setIsUnlimited] = useState(false);

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
        isUnlimited: isUnlimited,
        difficulty: difficulty,
        modeGame: modeGame.toLowerCase(),
      },
    });
  };

  const tabDifficulty = {
    easy: { cards: 10, timer: 20 },
    normal: { cards: 15, timer: 150 },
    hard: { cards: 20, timer: 120 },
  };

  /**
   * Settings defaults depending on difficulty
   * @param {*} evt
   */
  const handleParametersDifficulty = (evt) => {
    const difficulty = evt.currentTarget.dataset.difficulty;
    setDifficulty(difficulty);

    const values = tabDifficulty[difficulty];
    if (values) {
      const { cards, timer } = values;
      setCards(cards);
      setTimer(timer);
    }
  };

  //Tab of different game mode
  const tabGameMode = ["Annee", "Poids", "Taille"];

  ///tab of different difficulty
  const difficulties = [
    { key: "easy", label: "Facile" },
    { key: "normal", label: "Normal" },
    { key: "hard", label: "Difficile" },
    { key: "customize", label: "Personnaliser" },
  ];

  return (
    <>
      <Header />
      <main className="settings">
        <section className="settings__section">
          <h1 className="settings__title">Paramètres de la partie</h1>
          <div className="settings__content">
            <h2 className="settings__instrument-title">Mode de jeux</h2>
            <div className="settings__instrument-fieldset">
              {tabGameMode.map((mode, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setModeGame(mode)}
                  className={`settings__instrument-card settings__instrument-card--${mode} ${
                    modeGame === mode
                      ? "settings__instrument-card--selected"
                      : ""
                  }`}
                >
                  <p className="settings__instrument-content">
                    Trier par {mode.toLowerCase()}
                  </p>
                </button>
              ))}
            </div>

            {/* Difficulté */}
            <div className="settings__options">
              <h2 className="settings__options-title">Difficulté</h2>
              <ul className="settings__difficulty-list">
                {difficulties.map(({ key, label }) => (
                  <li className={`settings__difficulty-item`} key={key}>
                    <button
                      type="button"
                      onClick={handleParametersDifficulty}
                      data-difficulty={key}
                      className={`settings__difficulty-button settings__difficulty-button--${key} ${
                        key === difficulty
                          ? "settings__difficulty-button--selected"
                          : ""
                      }`}
                    >
                      <p className="settings__difficulty-label">{label}</p>
                      <ul className="settings__difficulty-details">
                        <li className="settings__difficulty-detail">
                          {tabDifficulty[key]?.cards ?? "-"} cartes
                        </li>
                        <li className="settings__difficulty-detail">
                          {tabDifficulty[key]?.timer ?? "-"} secondes
                        </li>
                      </ul>
                    </button>
                  </li>
                ))}
              </ul>
              {difficulty === "customize" && (
                <>
                  <h3 className="settings__parameter-title">Options</h3>
                  <ul className="settings__parameter-list">
                    {/* Nombre d'instruments */}
                    <li className="settings__parameter-item">
                      <label
                        htmlFor="instrument-count"
                        className="settings__label"
                      >
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
                          {timer}s
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
                  </ul>
                </>
              )}

              <ul className="settings__list-recap">
                <li>
                  <p>Mode de jeu : {modeGame}</p>
                </li>
                <li>
                  <p>
                    Difficulté :{" "}
                    {difficulties.find((diff) => diff.key === difficulty)
                      ?.label || "Inconnue"}
                  </p>
                </li>
                <li>
                  <p>Nombre de cartes : {cards}</p>
                </li>
                <li>
                  <p>Temps : {isUnlimited ? "Illimité" : `${timer}s`}</p>
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
