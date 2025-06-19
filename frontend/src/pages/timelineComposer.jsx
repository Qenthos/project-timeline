import { useLocation, Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useUsersStore, useInstrumentsStore } from "../stores/useStore";
import React from "react";
import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";
import DroppableZoneTimeline from "../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "../component/timeline/DraggableInstrument";
import Instrument from "../component/Instrument";
import "./TimelineComposer.scss";

const TimelineComposer = observer(() => {
  const location = useLocation();

  const [loadingCards, setLoadingCards] = useState(true);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [previousElo, setPreviousElo] = useState(null);

  if (!location.state) return <Navigate to="/settings-game" />;

  const { timer, cards, isUnlimited, difficulty, modeGame } =
    location.state || {};

  const { gameStore, instruStore } = useContext(TimelineContext);
  const { isLoaded } = useInstrumentsStore();
  const usersStore = useUsersStore();

  const [showDragCard, setShowDragCard] = useState(true);

  const currentUser = usersStore.currentUser || null;

  /**
   * Initialize a game
   */
  useEffect(() => {
    if (currentUser) {
      gameStore.initializeGame({ timer, difficulty, isUnlimited });
      setPreviousElo(currentUser.elo);
    } else {
      gameStore.initializeGame({ timer, difficulty, isUnlimited, score: 100 });
    }
  }, []);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;
  const instrumentsNotInExpo = gameStore.state.selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);

  const allInstruments = instruStore._instrumentsStore.instruments;

  //Compatibily device and mobile
  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;
  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  const currentInstrument =
    gameStore.state.selectedInstruments[gameStore.state.currentIndex];

  /**
   * Handle local storage of timeline
   */
  useEffect(() => {
    if (!isLoaded) return;

    const sauvegarde = localStorage.getItem("tabIds");
    if (!sauvegarde) {
      instruStore.reset();
    }

    //Size timeline
    instruStore.setSizeTimeline(cards + 1);

    gameStore.startNewRound();
    const init = async () => {
      await setRandomDefaultCard();
    };
    init();
  }, [cards, isLoaded]);

  /**
   *Select random draggable card
   */
  const setRandomDefaultCard = async () => {
    if (!allInstruments || allInstruments.length === 0) {
      console.warn("Aucun instrument encore disponbile");
      setLoadingCards(false);
      return;
    }
    try {
      setLoadingCards(true);
      await gameStore.setRandomCards(cards);
    } catch (error) {
      console.error("Erreur " + error);
    } finally {
      setLoadingCards(false);
    }
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
    if (!isLoaded || isGameFinished) return;

    if (!gameStore.state.endGame) {
      const noMoreCards =
        gameStore.state.currentIndex >=
        gameStore.state.selectedInstruments.length;
      if (
        gameStore.state.selectedInstruments.length > 0 &&
        (gameStore.state.timerRemaining <= 0 || noMoreCards)
      ) {
        setIsGameFinished(true);
        gameStore.finishGame(
          cards,
          timer,
          difficulty,
          instruStore.nbBadResponse,
          instruStore.nbGoodResponse,
        );
        localStorage.removeItem("tabIds");
      }
    }
  }, [
    gameStore.state.currentIndex,
    gameStore.state.timerRemaining,
    gameStore.state.endGame,
    currentUser,
  ]);

  useEffect(() => {
    if (gameStore.state.timerRemaining === 0 && !isGameFinished) {
      setIsGameFinished(true);
      gameStore.finishGame(
        cards,
        timer,
        difficulty,
        instruStore.nbBadResponse,
        instruStore.nbGoodResponse
      );
    }
  }, [gameStore.state.timerRemaining, isGameFinished]);

  /**
   * Reset game : states by defaults
   */
  const resetGame = () => {
    instruStore.reset();
    gameStore.startNewRound();
    setRandomDefaultCard();
    setIsGameFinished(false);
  };

  const difficultyMap = {
    easy: "Facile",
    normal: "Normal",
    hard: "Difficile",
    customize: "Personnalisée",
  };

  return !isLoaded ? (
    <LoadingScreen message="Chargement des instruments en cours" />
  ) : (
    <DndProvider backend={backend}>
      <Header />
      <main className="timeline">
        <section className="timeline__section">
          <ul className="timeline__list-parameters">
            <li className="timeline__list-parameters-item">
              <h2 className="timeline__title">
                {currentUser ? `${currentUser.username}` : "Invité"}{" "}
                <span className="timeline__subtitle">
                  (Vous avez {cards} cartes à placer {subtitleText})
                </span>
              </h2>
            </li>
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--difficulty">
                Mode de jeu : trie par {modeGame}
              </p>
              <p className="timeline__list-parameters-text timeline__list-parameters-text--difficulty">
                Difficulté : {difficultyMap[difficulty] || difficulty}
              </p>
            </li>
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--gamemode">
                <span>{instrumentsNotInExpo.length}</span>
                {instrumentsNotInExpo.length === 1
                  ? " carte à poser"
                  : " cartes à poser"}
              </p>
            </li>
            <li className="timeline__list-parameters-item timeline__list-parameters-item--timer ">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--timer">
                <span>
                  {isUnlimited
                    ? "Temps illimité"
                    : `${
                        gameStore.state.timerRemaining >= 60
                          ? `${Math.floor(
                              gameStore.state.timerRemaining / 60
                            )}min `
                          : ""
                      }${gameStore.state.timerRemaining % 60}s`}
                </span>
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
            {currentUser && (
              <li className="timeline__list-parameters-item timeline__list-parameters-item--score">
                <p className="timeline__list-parameters-text timeline__list-parameters-text--score">
                  <span>{currentUser.elo}</span>
                  elo
                </p>
              </li>
            )}
            {!currentUser && (
              <li className="timeline__list-parameters-item timeline__list-parameters-item--score">
                <Link
                  to="/register"
                  className="timeline__instruments-link-account"
                >
                  Créer un compte
                </Link>
              </li>
            )}
          </ul>
          <div className="timeline__instruments">
            {isGameFinished ? (
              <ul className="timeline__instruments-list">
                <li className="timeline__instruments-item">
                  <p className="timeline__instruments-message">
                    {gameStore.state.win
                      ? "Gagné ! Vous avez fait aucune faute."
                      : "Perdu !"}
                  </p>
                </li>

                {gameStore.state.timerRemaining <= 0 && (
                  <li className="timeline__instruments-item">
                    <p className="timeline__instruments-message">
                      Le temps de {gameStore.state.timerGame} secondes est
                      écoulé !
                    </p>
                  </li>
                )}

                <li className="timeline__instruments-item">
                  <p className="timeline__instruments-result">
                    {`Nombre d'erreur${
                      instruStore.nbBadResponse > 1 ? "s" : ""
                    } : ${instruStore.nbBadResponse}`}
                  </p>
                </li>

                <li className="timeline__instruments-item">
                  <p className="timeline__instruments-result">
                    {`Nombre de bonne réponse${
                      instruStore.nbGoodResponse > 1 ? "s" : ""
                    } : ${instruStore.nbGoodResponse}`}
                  </p>
                </li>

                {currentUser && (
                  <li className="timeline__instruments-item">
                    <p className="timeline__instruments-score">
                      Score : +{gameStore.state.score}
                    </p>
                  </li>
                )}

                {currentUser && previousElo !== null && (
                  <li className="timeline__instruments-item">
                    <p className="timeline__instruments-score">
                      Elo : {previousElo} → {currentUser.elo}
                    </p>
                  </li>
                )}

                <li className="timeline__instruments-item">
                  <p className="timeline__instruments-time">
                    {gameStore.state.timeElapsed === 0
                      ? ""
                      : `Terminé en ${gameStore.state.timeElapsed} secondes`}
                  </p>
                </li>

                <li className="timeline__instruments-item timeline__instruments-actions">
                  <button
                    className="timeline__instruments-button"
                    onClick={resetGame}
                  >
                    Recommencer une partie
                  </button>
                  <Link
                    to="/settings-game"
                    className="timeline__instruments-link"
                  >
                    Modifier les paramètres d'une partie
                  </Link>
                </li>
              </ul>
            ) : (
              <>
                {modeGame !== "survival" && (
                  <p
                    className={`timeline__nb-place-card ${
                      !loadingCards ? "timeline__nb-place-card--hidden" : ""
                    }`}
                  >
                    Chargement en cours
                  </p>
                )}
                {showDragCard && currentInstrument && (
                  <DraggableInstrument instrument={currentInstrument} />
                )}
              </>
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
