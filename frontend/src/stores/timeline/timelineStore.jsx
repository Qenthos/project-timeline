import { makeAutoObservable } from "mobx";

export default class TimelineStore {
  _instrumentsStore;
  _idsTimeline;
  _size = 5;
  _highlightStatus;
  _nbBadResponse = 0;
  _nbGoodResponse = 0;

  constructor(instrumentsStore) {
    this._instrumentsStore = instrumentsStore;
    this._idsTimeline = Array(this._size).fill(null);
    this._highlightStatus = {};
    this._size = this._idsTimeline.length;
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;
    makeAutoObservable(this);
    this.getTabIds();
  }

  get highlightStatus() {
    return this._highlightStatus;
  }

  set highlightStatus(value) {
    this._highlightStatus = value;
  }

  set nbGoodResponse(value) {
    this._nbGoodResponse = value;
  }

  get nbGoodResponse() {
    return this._nbGoodResponse;
  }

  set nbBadResponse(value) {
    this._nbBadResponse = value;
  }

  get nbBadResponse() {
    return this._nbBadResponse;
  }

  get instrumentsTimeline() {
    return this._idsTimeline
      .filter((id) => id !== null)
      .map((id) => this._instrumentsStore.getInstrumentsById(id));
  }

  get instrumentsTimelineBySlot() {
    return this._idsTimeline.map((id) =>
      id ? this._instrumentsStore.getInstrumentsById(id) : null
    );
  }

  setSizeTimeline(size) {
    this._idsTimeline = Array(size).fill(null);
    this._size = size;
    this.saveTabIds();
  }

  setDefaultCard(card) {
    this._idsTimeline[0] = card.id;
    this._highlightStatus[card.id] = true;
    this.saveTabIds();
  }

  existsInTimeline(instrumentOrId) {
    const instrumentId =
      typeof instrumentOrId === "object" ? instrumentOrId.id : instrumentOrId;

    return this._idsTimeline.includes(instrumentId);
  }

  setInstrumentAt(emplacement, idInstrument) {
    if (emplacement < 0 || emplacement >= this._idsTimeline.length) {
      throw new Error("L'emplacement doit être compris entre 0 et 9");
    }

    if (this._idsTimeline[emplacement] !== null) {
      return;
    }

    this._idsTimeline[emplacement] = idInstrument;
    this.saveTabIds();
  }

  reset() {
    this._idsTimeline.fill(null);
    this._highlightStatus = {};
    this._nbGoodResponse = 0;
    this._nbBadResponse = 0;
    localStorage.removeItem("tabIds");
  }

  saveTabIds() {
    localStorage.setItem("tabIds", JSON.stringify(this._idsTimeline));
  }

  getTabIds() {
    const storedTabIds = localStorage.getItem("tabIds");
    
    if (storedTabIds) {
      this._idsTimeline = JSON.parse(storedTabIds);
    } else {
      this._idsTimeline = Array(this._size).fill(null);
    }
  }

  setInstrumentsSorted(indexDropped, newInstrumentId, mode) {
    // Copier l’état actuel des cartes
    let current = [...this._idsTimeline];

    // Supprimer le doublon si déjà présent
    current = current.filter((id) => id !== newInstrumentId);

    // Garder uniquement les éléments non nuls (compactage)
    let compacted = current.filter((e) => e !== null);

    compacted.splice(indexDropped, 0, newInstrumentId);

    // Compléter avec des `null` jusqu’à this._size
    while (compacted.length < this._size) {
      compacted.push(null);
    }

    let currentIds = compacted; //tri du tab en enlevant les nulls entre les ids

    // Mise à jour immédiate pour affichage instantané
    this._idsTimeline = currentIds;

    // Récupérer les objets instruments à partir des ids non nuls
    const instruments = this._idsTimeline
      .map((id) => (id ? this._instrumentsStore.getInstrumentsById(id) : null))
      .filter(Boolean);

    // Tri selon le mode
    instruments.sort((a, b) => {
      if (mode === "annee") return a.year - b.year;
      if (mode === "taille") return a.height - b.height;
      return a.weight - b.weight;
    });

    const sortedOrder = instruments.map((instr) => instr.id);

    // Initialisation ou récupération de l’état des highlights
    if (!this._highlightStatus || typeof this._highlightStatus !== "object") {
      this._highlightStatus = {};
    }

    // Mise à jour des highlights
    this._idsTimeline.forEach((id, idx) => {
      if (!id) return;
      const isCorrect = id === sortedOrder[idx];

      if (
        this._highlightStatus[id] === undefined ||
        this._highlightStatus[id] === null
      ) {
        this._highlightStatus[id] = isCorrect;
        if (isCorrect) this._nbGoodResponse += 1;
        else this._nbBadResponse += 1;
      }
    });

    this.saveTabIds();

    // Re-tri visuel après 1 seconde
    setTimeout(() => {
      this._idsTimeline = [...sortedOrder];

      while (this._idsTimeline.length < this._size) {
        this._idsTimeline.push(null);
      }

      this.saveTabIds();
    }, 1000);
  }
}
