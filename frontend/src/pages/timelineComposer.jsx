import { useLocation } from "react-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { TimelineContext } from "./../stores/TimelineContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Header from "../component/Header";
import EndGame from "../component/EndGame";
import DroppableZoneTimeline from "./../component/timeline/DroppableZoneTimeline";
import DraggableInstrument from "./../component/timeline/DraggableInstrument";
import "./TimelineComposer.scss";

const TimelineComposer = observer(() => {
  const location = useLocation();
  const { timer, cards, round, isUnlimited, difficulty, modeGame } =
    location.state || {};

  const { instruStore } = useContext(TimelineContext);

  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [win, setWin] = useState(false);
  const [nbBadResponse, setNbBadResponse] = useState(0);
  const [nbGoodResponse, setNbGoodResponse] = useState(0);
  const [timerGame, setTimerGame] = useState(timer);

  //Supprimer le local storage si nouvelle partie
  useEffect(() => {
    // Reset store si pas de sauvegarde
    const sauvegarde = localStorage.getItem("tabIds");
    if (!sauvegarde) {
      instruStore.reset();
    }
    // Taille timeline
    instruStore.setSizeTimeline(cards + 1);
  
    // Carte par défaut aléatoire
    const allInstruments = instruStore._instrumentsStore.instruments;
    const randomInstrument =
      allInstruments[Math.floor(Math.random() * allInstruments.length)];
    instruStore.setDefaultCard(randomInstrument);
  
    // Sélection aléatoire des instruments
    const random = [...allInstruments].sort(() => Math.random() - 0.5);
    const selection = random.slice(0, cards);
    setSelectedInstruments(selection);
  
    // Initialisation timer
    // setTimerGame(timer);
  }, [cards, instruStore]);
  
  useEffect(() => {
    if (timerGame <= 0) {
      setEndGame(true);
      return;
    }
    if (endGame) {
      return; 
    }
  
    const interval = setInterval(() => {
      setTimerGame((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timerGame, endGame]);
  

  const instrumentsNotInExpo = selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;
  // console.log(instrumentExpoSlot);

  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;

  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  /**
   *
   */
  const handleGame = () => {
    // On traduit le mode de jeu en nom de propriété
    let gamemode =
      modeGame === "annee"
        ? "year"
        : modeGame === "taille"
        ? "height"
        : "weight";

    // Création des données du joueur avec la bonne propriété
    let data = instrumentExpoSlot.map((instru) => ({
      id: instru?.id,
      gamemode: instru?.[gamemode],
    }));
    console.log(data);

    let orderUser = data.map((item) => item.gamemode);
    console.log(orderUser);

    // Même principe ici : on trie les vraies valeurs selon le bon champ
    let correctOrder = instrumentExpoSlot
      .map((instru) => instru?.[gamemode])
      .sort((a, b) => a - b);
    console.log(correctOrder);

    const same = [];
    const different = [];

    const compare =
      correctOrder.length === orderUser.length &&
      correctOrder.every((val, i) => val === orderUser[i]);

    if (compare) {
      setWin(true);
    } else {
      for (
        let i = 0;
        i < Math.max(orderUser.length, correctOrder.length);
        i++
      ) {
        if (orderUser[i] === correctOrder[i]) {
          same.push(orderUser[i]);
        } else {
          different.push(orderUser[i]);
        }
      }
    }

    setNbBadResponse(different.length);
    setNbGoodResponse(same.length);

    // Ici aussi on adapte les filtres
    const badResponseInstrument = data.filter((item) =>
      different.includes(item.gamemode)
    );
    const goodResponseInstrument = data.filter(
      (item) => !different.includes(item.gamemode)
    );

    console.log(badResponseInstrument);
    console.log(goodResponseInstrument);
    setEndGame(true);
  };

  return (
    <>
      <DndProvider backend={backend}>
        <Header />
        <main className="timeline">
          <section className="timeline__section">
            <h2 className="timeline__title">
              A vous de jouer !
              <span className="timeline__subtitle">
                (Déplacez les {cards} œuvres vers la zone de la timeline )
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
                  Timer : {timerGame}
                </p>
              </li>
              <li className="timeline__list-parameters-item">
                <p className="timeline__list-parameters-text timeline__list-parameters-text--rounds">
                  Nombre de manches : {round}
                </p>
              </li>
            </ul>

            <div className="timeline__instruments">
              {instrumentsNotInExpo.length === 0 ? (
                <p>Toutes les cartes ont été placées !</p>
              ) : (
                instrumentsNotInExpo.map((instru) => (
                  <DraggableInstrument key={instru.id} instrument={instru} />
                ))
              )}
            </div>

            <div className="timeline__dropzones">
              {instrumentExpoSlot.map((instrument, id) => (
                <DroppableZoneTimeline
                  key={id}
                  index={id}
                  instrumentDrop={instrument}
                  gamemode={modeGame}
                  onDrop={(idInstrument) =>
                    instruStore.setInstrumentAt(id, idInstrument)
                  }
                />
              ))}
            </div>
            <ul className="timeline__list-buttons">
              <li>
                <button
                  onClick={() => instruStore.reset()}
                  className="timeline__reset-button"
                >
                  Recommencer l'exposition
                </button>
              </li>
              <li>
                <button
                  onClick={handleGame}
                  className="timeline__confirm-timeline"
                >
                  Valider la timeline !
                </button>
              </li>
            </ul>
            {endGame && (
              <EndGame
                win={win}
                error={nbBadResponse}
                good={nbGoodResponse}
                onClose={() => {
                  setEndGame(false);
                  setWin(false);
                  setNbBadResponse(0);
                  setNbGoodResponse(0);
                  instruStore.reset();
                }}
              ></EndGame>
            )}
          </section>
        </main>
      </DndProvider>
    </>
  );
});

export default TimelineComposer;
