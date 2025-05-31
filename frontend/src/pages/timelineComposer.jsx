import { useLocation, Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useUsersStore } from "./../stores/useStore";
import React from "react";
import Header from "../component/Header";
import DroppableZoneTimeline from "../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "../component/timeline/DraggableInstrument";
import Instrument from "../component/Instrument";
import "./TimelineComposer.scss";

const TimelineComposer = observer(() => {
  const location = useLocation();
  if (!location.state) return <Navigate to="/settings-game" />;

  const { timer, cards, isUnlimited, difficulty, modeGame, nbLives } =
    location.state || {};

  const { gameStore, instruStore } = useContext(TimelineContext);
  const usersStore = useUsersStore();

  // const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [showDragCard, setShowDragCard] = useState(true);

  useEffect(() => {
    gameStore.timer = timer;
    gameStore.timerGame = timer;
    gameStore.isUnlimited = isUnlimited;
    gameStore.score = 100;
    gameStore.roundFinish = 1;
  }, []);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;
  const instrumentsNotInExpo = gameStore.selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);

  const allInstruments = instruStore._instrumentsStore.instruments;

  //Compatibily device and mobile
  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;
  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  /**
   * Handle local storage of timeline
   */
  useEffect(() => {
    const sauvegarde = localStorage.getItem("tabIds");
    if (!sauvegarde) {
      instruStore.reset();
    }

    //Size timeline
    instruStore.setSizeTimeline(cards + 1);

    gameStore.startNewRound();
    setRandomDefaultCard();
  }, [cards, instruStore]);

  /**
   *Select random draggable card
   */
  const setRandomDefaultCard = () => {
    const randomInstrument =
      allInstruments[Math.floor(Math.random() * allInstruments.length)];
    instruStore.setDefaultCard(randomInstrument);

    gameStore.setRandomSelectedInstruments(allInstruments, cards);
  };

  /**
   *Show the next draggable card
   */
  const handleDrop = () => {
    setShowDragCard(false);
    setTimeout(() => {
      gameStore.handleDrop();
      setShowDragCard(true);
    }, 1000);
  };

  /**
   * Describe the goal of timeline depending on gamemode
   */
  const modeDescriptions = {
    annee: "du plus ancien au plus récent !",
    poids: "du plus léger au plus lourd !",
    taille: "du plus petit au plus grand !",
  };

  const subtitleText =
    modeDescriptions[modeGame] || "Placez-les dans le bon ordre !";

  /**
   * Condition to verify if a game is finish :
   * - The time is up
   * - all cards have been placed
   */
  useEffect(() => {
    const noMoreCards =
      gameStore.currentIndex >= gameStore.selectedInstruments.length;
    if (gameStore.timerGame <= 0 || noMoreCards) {
      gameStore.finishGame(
        instruStore.nbBadResponse,
        instruStore.nbGoodResponse
      );
      usersStore.updateScore((usersStore.currentUser.score += gameStore.score));
      localStorage.removeItem("tabIds");
    }
  }, [gameStore.currentIndex, gameStore.timerGame]);

  /**
   * Reset game : states by defaults
   */
  const resetGame = () => {
    instruStore.reset();
    gameStore.startNewRound();
    setRandomDefaultCard();
  };

  return (
    <DndProvider backend={backend}>
      <Header />
      <main className="timeline">
        <section className="timeline__section">
          <h2 className="timeline__title">
            A vous de jouer {usersStore.currentUser.username} !
            <span className="timeline__subtitle">
              (Vous avez {cards} à placer {subtitleText})
            </span>
          </h2>
          <ul className="timeline__list-parameters">
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--difficulty">
                Difficulté : {difficulty}
              </p>
            </li>
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--gamemode">
                Mode de jeu : trie par {modeGame}
              </p>
            </li>
            <li className="timeline__list-parameters-item timeline__list-parameters-item--timer ">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--timer">
                {isUnlimited
                  ? "Illimité"
                  : `Timer : ${
                      gameStore.timerGame >= 60
                        ? `${Math.floor(gameStore.timerGame / 60)}min `
                        : ""
                    }${gameStore.timerGame % 60}s`}
              </p>
              <button
                onClick={() => (gameStore.isPaused = !gameStore.isPaused)}
              >
                {gameStore.isPaused ? "Play" : "Pause"}
              </button>
            </li>
            <li>
              <p>Score : {usersStore.currentUser.score}</p>
            </li>
          </ul>
          <div className="timeline__instruments">
            {gameStore.currentIndex >= gameStore.selectedInstruments.length ||
            gameStore.timerGame <= 0 ? (
              <ul>
                <li>
                  <p>
                    {gameStore.win
                      ? "Gagné ! Vous avez fait aucune faute."
                      : "Perdu !"}
                  </p>
                </li>
                {gameStore.timerGame <= 0 && (
                  <li>
                    <p>Le temps de {gameStore.timer} secondes est écoulé !</p>
                  </li>
                )}
                <li>
                  <p>Nombre d'erreurs : {instruStore.nbBadResponse}</p>
                </li>
                <li>
                  <p>
                    Nombre de bonnes réponses : {instruStore.nbGoodResponse}
                  </p>
                </li>
                <li>
                  <p>Score : +{gameStore.score}</p>
                </li>
                <li>
                  <p>Terminé en {gameStore.timeRemaining} s</p>
                </li>

                <li>
                  <button onClick={resetGame}>Recommencer une partie</button>
                  <Link to="/settings-game">
                    Modifier les paramètres d'une partie
                  </Link>
                  <Link to="/">Revenir à l'accueil</Link>
                </li>
              </ul>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {modeGame !== "survival" ? (
                  <p>
                    Nombre de cartes restantes à poser :
                    {instrumentsNotInExpo.length}
                  </p>
                ) : (
                  ""
                )}
                {showDragCard && (
                  <DraggableInstrument
                    instrument={
                      gameStore.selectedInstruments[gameStore.currentIndex]
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="timeline__dropzones">
            {instrumentExpoSlot.map((instrument, zoneIndex) => {
              const id = instrument?.id;

              return (
                <React.Fragment key={`zone-${zoneIndex}`}>
                  <DroppableZoneTimeline
                    index={zoneIndex}
                    onDrop={(zoneIndex, idInstrument) => {
                      instruStore.setInstrumentsSorted(
                        zoneIndex,
                        idInstrument,
                        modeGame
                      );
                      handleDrop(); // on appelle ta version locale
                    }}
                  />

                  <Instrument
                    instrumentDrop={instrument}
                    key={`carte-${zoneIndex}`}
                    draggable
                    modeGame={modeGame}
                    status={instruStore.highlightStatus?.[id] ?? null}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </section>
      </main>
    </DndProvider>
  );
});

export default TimelineComposer;
