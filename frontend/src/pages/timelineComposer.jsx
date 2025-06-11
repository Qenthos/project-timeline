import { useLocation, Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useUsersStore } from "../stores/useStore";
import React from "react";
import Header from "../component/Header";
import DroppableZoneTimeline from "../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "../component/timeline/DraggableInstrument";
import Instrument from "../component/Instrument";
import "./TimelineComposer.scss";


const TimelineComposer = observer(() => {
  const location = useLocation();
  if (!location.state) return <Navigate to="/settings-game" />;

  const { timer, cards, isUnlimited, difficulty, modeGame } =
    location.state || {};

  const { gameStore, instruStore } = useContext(TimelineContext);
  const usersStore = useUsersStore();

  const [showDragCard, setShowDragCard] = useState(true);

  const currentUser = usersStore.currentUser || null;

  /**
   * Initialize a game
   */
  useEffect(() => {
    gameStore.initializeGame({ timer, difficulty, isUnlimited, score: 100 });
  }, []);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;
  const instrumentsNotInExpo = gameStore.state.selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);

  const allInstruments = instruStore._instrumentsStore.instruments;

  //Compatibily device and mobile
  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;
  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  const isGameFinished =
    gameStore.state.currentIndex >=
      gameStore.state.selectedInstruments.length ||
    gameStore.state.timerRemaining <= 0;

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
    if (currentUser && !gameStore.state.endGame) {
      const noMoreCards =
        gameStore.state.currentIndex >=
        gameStore.state.selectedInstruments.length;
      if (gameStore.state.timerRemaining <= 0 || noMoreCards) {
        gameStore.finishGame(
          instruStore.nbBadResponse,
          instruStore.nbGoodResponse
        );
        usersStore.updateScore(currentUser.score + gameStore.state.score);

        localStorage.removeItem("tabIds");
      }
    }
  }, [
    gameStore.state.currentIndex,
    gameStore.state.timerRemaining,
    gameStore.state.endGame,
    currentUser,
  ]);

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
            {currentUser
              ? `À vous de jouer ${currentUser.username}`
              : "Vous jouez en tant qu'invité"}{" "}
            !
            <span className="timeline__subtitle">
              (Vous avez {cards} cartes à placer {subtitleText})
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
                  ? "Temps illimité"
                  : `Timer : ${
                      gameStore.state.timerRemaining >= 60
                        ? `${Math.floor(
                            gameStore.state.timerRemaining / 60
                          )}min `
                        : ""
                    }${gameStore.state.timerRemaining % 60}s`}
              </p>
              {!isUnlimited && !isGameFinished ? (
                <button
                  onClick={() =>
                    (gameStore.state.isPaused = !gameStore.state.isPaused)
                  }
                >
                  {gameStore.state.isPaused ? "Play" : "Pause"}
                </button>
              ) : (
                ""
              )}
            </li>
            <li>{currentUser && <p>Score : {currentUser.score}</p>}</li>
          </ul>
          <div className="timeline__instruments">
            {isGameFinished ? (
              <ul>
                <li>
                  <p>
                    {gameStore.state.win
                      ? "Gagné ! Vous avez fait aucune faute."
                      : "Perdu !"}
                  </p>
                </li>
                {gameStore.state.timerRemaining <= 0 && (
                  <li>
                    <p>
                      Le temps de {gameStore.state.timerGame} secondes est
                      écoulé !
                    </p>
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
                  {currentUser && <p>Score : +{gameStore.state.score}</p>}
                </li>
                <li>
                  <p>Terminé en {gameStore.state.timeElapsed} s</p>
                </li>

                <li>
                  <button onClick={resetGame}>Recommencer une partie</button>
                  <Link to="/settings-game">
                    Modifier les paramètres d'une partie
                  </Link>
                  {!currentUser && <Link to="/register">Créer un compte</Link>}
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
                      gameStore.state.selectedInstruments[
                        gameStore.state.currentIndex
                      ]
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
                      handleDrop();
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
