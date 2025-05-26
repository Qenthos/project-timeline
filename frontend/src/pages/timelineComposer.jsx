import { useLocation, Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "./../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Header from "../component/Header";
import DroppableZoneTimeline from "./../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "./../component/timeline/DraggableInstrument";
import Instrument from "./../component/Instrument";
import "./TimelineComposer.scss";
import React from "react";

const TimelineComposer = observer(() => {
  const location = useLocation();
  const { timer, cards, round, isUnlimited, difficulty, modeGame } =
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

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;

  /**
   *
   */
  useEffect(() => {
    //Delete local storage if new game
    const sauvegarde = localStorage.getItem("tabIds");
    if (!sauvegarde) {
      instruStore.reset();
    }

    // Taille timeline
    instruStore.setSizeTimeline(cards + 1);

    // Random default card
    const allInstruments = instruStore._instrumentsStore.instruments;
    const randomInstrument =
      allInstruments[Math.floor(Math.random() * allInstruments.length)];
    instruStore.setDefaultCard(randomInstrument);

    // Select instruments random
    const random = [...allInstruments].sort(() => Math.random() - 0.5);
    const selection = random.slice(0, cards);
    setSelectedInstruments(selection);
  }, [cards, instruStore]);

  /**
   * Handle timer
   */
  useEffect(() => {
    if (endGame) {
      return;
    }

    if (timerGame <= 0) {
      setEndGame(true);
      setWin(false);
      setFinishTimer(true);
      return;
    }

    const interval = setInterval(() => {
      setTimerGame((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerGame, endGame]);

  // const instrumentsNotInExpo = selectedInstruments
  //   .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
  //   .slice(0, cards);

  //Compatibily device and mobile
  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;
  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  /**
   *Show the next draggable card
   */
  const handleDrop = () => {
    setCurrentIndex((prev) => prev + 1);
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
    Math.ceil[newScore];
    setScore(newScore);
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
            <li className="timeline__list-parameters-item ">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--timer">
                {isUnlimited ? `Illimité` : `Timer : ${timerGame}`}
              </p>
            </li>
            <li className="timeline__list-parameters-item">
              <p className="timeline__list-parameters-text timeline__list-parameters-text--rounds">
                Nombre de manches : {round}
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
                  <button onClick={() => window.location.reload()}>
                    Recommencer une partie
                  </button>
                  <Link to="/settings-game">
                    Modifier les paramètres d'une partie
                  </Link>
                  <Link to="/">Revenir à l'accueil</Link>
                </li>
              </ul>
            ) : (
              <DraggableInstrument
                instrument={selectedInstruments[currentIndex]}
              />
            )}
          </div>

          <div className="timeline__dropzones">
            {/* <div className="timeline-dynamic" style={{ display: "flex" }}> */}
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
            {/* </div> */}
          </div>
        </section>
      </main>
    </DndProvider>
  );
});

export default TimelineComposer;
