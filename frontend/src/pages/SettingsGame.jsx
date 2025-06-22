import { useState } from "react";
import { useNavigate } from "react-router";
import "./SettingsGame.scss";
import Header from "../component/Header";

const SettingsGame = () => {
  //Tab of different game mode
  const tabGameMode = ["Annee", "Poids", "Taille"];

  const [cards, setCards] = useState(5);
  const [timer, setTimer] = useState(30);
  const [difficulty, setDifficulty] = useState("easy");
  const [modeGame, setModeGame] = useState(tabGameMode[0]);
  const [clue, setClue] = useState(true);
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
        clue: clue,
      },
    });
  };

  const tabDifficulty = {
    easy: { cards: 10, timer: 20, clue: true },
    normal: { cards: 15, timer: 150, clue: false },
    hard: { cards: 20, timer: 120, clue: false },
  };

  /**
   * Settings defaults depending on difficulty
   * @param {*} evt
   */
  const handleParametersDifficulty = (e) => {
    const key = e.target.value;
    setDifficulty(key);

    const values = tabDifficulty[key];
    if (values) {
      const { cards, timer, clue } = values;
      setCards(cards);
      setTimer(timer);
      setClue(clue);
    }
  };

  ///tab of different difficulty
  const difficulties = [
    { key: "easy", label: "Facile - Indice" },
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
            <ul className="settings__instrument-list">
              {tabGameMode.map((mode, index) => (
                <li className="settings__instrument-item" key={index}>
                  <input
                    type="radio"
                    id={`mode-${mode}`}
                    name="gameMode"
                    value={mode}
                    checked={modeGame === mode}
                    onChange={(e) => setModeGame(e.target.value)}
                    className="settings__instrument-radio"
                  />
                  <label
                    htmlFor={`mode-${mode}`}
                    className={`settings__instrument-card settings__instrument-card--${mode}`}
                  >
                    <p className="settings__instrument-content">
                      Trier par {mode.toLowerCase()}
                    </p>
                  </label>
                </li>
              ))}
            </ul>

            <div className="settings__options">
              <h2 className="settings__options-title">Difficulté</h2>
              <ul className="settings__difficulty-list">
                {difficulties.map(({ key, label }) => (
                  <li className="settings__difficulty-item" key={key}>
                    <input
                      type="radio"
                      id={`difficulty-${key}`}
                      name="difficulty"
                      value={key}
                      checked={difficulty === key}
                      onChange={handleParametersDifficulty}
                      className="settings__difficulty-radio"
                      data-difficulty={key}
                    />
                    <label
                      htmlFor={`difficulty-${key}`}
                      className={`settings__difficulty-button settings__difficulty-button--${key}`}
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
                    </label>
                  </li>
                ))}
              </ul>

              {difficulty === "customize" && (
                <>
                  <h3 className="settings__parameter-title">Options</h3>
                  <ul className="settings__parameter-list">
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
                        <div className="settings__unlimited-group">
                          <input
                            className="settings__checkbox"
                            type="checkbox"
                            id="unlimited-timer"
                            checked={isUnlimited}
                            onChange={(e) => setIsUnlimited(e.target.checked)}
                          />
                          <label
                            htmlFor="unlimited-timer"
                            className="settings__checkbox-label"
                          >
                            Illimité
                          </label>
                        </div>
                      </div>
                    </li>
                    <li className="settings__parameter-item">
                      <label htmlFor="enable-clues" className="settings__label">
                        Activer les indices
                      </label>
                      <div className="settings__input-group-clue">
                        <input
                          className="settings__checkbox"
                          type="checkbox"
                          id="enable-clues"
                          checked={clue}
                          onChange={(e) => setClue(e.target.checked)}
                        />
                        <label
                          htmlFor="enable-clues"
                          className="settings__checkbox-label"
                        >
                          {clue ? "Indice activé" : "Indice désactivé"}
                        </label>
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
                <li>
                  <p>{clue ? "Indice activé" : "Indice désactivé"}</p>
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
