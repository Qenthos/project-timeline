import { useLocation, Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import React from "react";
import Header from "../component/Header";
import DroppableZoneTimeline from "../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "../component/timeline/DraggableInstrument";
import Instrument from "../component/Instrument";
import "./TimelineComposer.scss";

const TimelineComposer = observer(() => {
  const location = useLocation();
  if (!location.state) return <Navigate to="/settings-game" />;

  const { timer, cards, round, isUnlimited, difficulty, modeGame, nbLives } =
    location.state || {};

  const { instruStore } = useContext(TimelineContext);
  

  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [finalTime, setFinalTime] = useState(timer);
  const [finishTimer, setFinishTimer] = useState(false);
  const [win, setWin] = useState(false);
  const [timerGame, setTimerGame] = useState(timer);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(100);
  const [roundFinish, setRoundFinish] = useState(1);
  const [showDragCard, setShowDragCard] = useState(true);
  const [pauseGame, setPauseGame] = useState(false);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;
  const instrumentsNotInExpo = selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);
  const allInstruments = instruStore._instrumentsStore.instruments;

  console.log(instrumentsNotInExpo.length);

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
  }, []);

  /**
   *Size timeline
   */
  useEffect(() => {
    //Size timeline
    instruStore.setSizeTimeline(cards + 1);

    // Select instruments random
    setRandomDefaultCard();
  }, [cards, instruStore]);

  /**
   *Select random draggable card
   */
  const setRandomDefaultCard = () => {
    // Random default card
    const randomInstrument =
      allInstruments[Math.floor(Math.random() * allInstruments.length)];
    instruStore.setDefaultCard(randomInstrument);

    const random = [...allInstruments].sort(() => Math.random() - 0.5);

    const selection = random.slice(0, cards);
    setSelectedInstruments(selection);
  };

  /**
   * Handle timer
   */
  useEffect(() => {
    //endgame
    if (endGame) {
      return;
    }
    //timer finish
    if (timerGame <= 0) {
      setEndGame(true);
      setWin(false);
      setFinishTimer(true);
      return;
    }
    let interval = null;
    if (!pauseGame) {
      interval = setInterval(() => {
        setTimerGame((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerGame, endGame, pauseGame]);

  /**
   *Show the next draggable card
   */
  const handleDrop = () => {
    setShowDragCard(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
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
    if (selectedInstruments.length === 0) return;
    const noMoreCards = currentIndex >= selectedInstruments.length;
    if (finishTimer || noMoreCards) {
      setEndGame(true);
      calculateTimeRemaining();
      calculateScore();
      localStorage.removeItem("tabIds");
      setRoundFinish((prev) => prev + 1);
    }
  }, [currentIndex, finishTimer, selectedInstruments.length]);

  /**
   * Calculate the time to finish the game
   */
  const calculateTimeRemaining = () => {
    const timeGame = timer;
    const finishTime = timerGame;
    let remaining = timeGame - finishTime;
    setFinalTime(remaining);
  };

  /**
   * Calculcate score of game
   */
  const calculateScore = () => {
    let nbErrors = instruStore.nbBadResponse;
    let nbGoods = instruStore.nbGoodResponse;
    let newScore = score;
    newScore -= nbErrors * 10;
    newScore += nbGoods * 15;
    newScore = Math.max(0, Math.ceil(newScore));
    setScore(newScore);
  };

  /**
   * Reset game : states by defaults
   */
  const resetGame = () => {
    setCurrentIndex(0);
    instruStore.reset();
    setTimerGame(timer);
    setEndGame(false);
    setWin(false);
    setFinishTimer(false);
    setPauseGame(false);
    setRandomDefaultCard();
  };

  return (
    <DndProvider backend={backend}>
      <Header />
      <main className="timeline">
        <section className="timeline__section">
          <h2 className="timeline__title">
            A vous de jouer !
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
                      timerGame >= 60 ? `${Math.floor(timerGame / 60)}min ` : ""
                    }${timerGame % 60}s`}
              </p>
              <button
                onClick={() =>
                  pauseGame ? setPauseGame(false) : setPauseGame(true)
                }
              >
                {pauseGame ? "Play" : "Pause"}
              </button>
            </li>
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--rounds">
                Nombre de manches : {roundFinish > round ? round : roundFinish}/
                {round}
              </p>
            </li>
            <li>
              <p>Score : {score}</p>
            </li>
          </ul>
          <div className="timeline__instruments">
            {currentIndex >= selectedInstruments.length || finishTimer ? (
              <ul>
                <li>
                  <p>
                    {win ? "Gagné ! Vous avez fait aucune faute." : "Perdu !"}
                  </p>
                </li>
                {finishTimer && (
                  <li>
                    <p>Le temps de {timer} secondes est écoulé !</p>
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
                  <p>Score : {score}</p>
                </li>
                <li>
                  <p>Terminé en {finalTime} s</p>
                </li>
                <li>
                  {round === 1 ? (
                    <>
                      <button onClick={resetGame}>
                        Recommencer une partie
                      </button>
                      <Link to="/settings-game">
                        Modifier les paramètres d'une partie
                      </Link>
                      <Link to="/">Revenir à l'accueil</Link>
                    </>
                  ) : (
                    <button onClick={resetGame}>
                      Démarrer la nouvelle manche ({roundFinish}/{round})
                    </button>
                  )}
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
                    instrument={selectedInstruments[currentIndex]}
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
