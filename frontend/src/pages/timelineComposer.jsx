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

  //Supprimer le local storage si nouvelle partie
  useEffect(() => {
    const sauvegarde = localStorage.getItem("tabIds");
    if (!sauvegarde) {
      instruStore.reset();
    }

    //définit le nombres de zone à créer
    instruStore.setSizeTimeline(cards);

    const allInstruments = instruStore._instrumentsStore.instruments;
    const random = [...allInstruments].sort(() => Math.random() - 0.5); //trie random
    const selection = random.slice(0, cards); //définit le nombre de cartes à afficher

    setSelectedInstruments(selection);
  }, [cards, instruStore]);

  const instrumentsNotInExpo = selectedInstruments
    .filter((instrument) => !instruStore.existsInTimeline(instrument.id))
    .slice(0, cards);

  const instrumentExpoSlot = instruStore.instrumentsTimelineBySlot;

  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;

  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  const handleGame = () => {
    let data = instrumentExpoSlot.map((instru) => ({
      id: instru?.id,
      year: instru?.year,
    }));

    let orderUser = data.map((item) => item.year);
    console.log(orderUser);

    let correctOrder = instrumentExpoSlot
      .map((instru) => instru.year)
      .sort((a, b) => a - b);
    console.log(correctOrder);
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
                  Timer : {timer}
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
            {endGame && <EndGame endgame=""></EndGame>}
          </section>
        </main>
      </DndProvider>
    </>
  );
});

export default TimelineComposer;
