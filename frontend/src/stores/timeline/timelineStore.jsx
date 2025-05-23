import { makeAutoObservable } from "mobx";

export default class TimelineStore {
  _instrumentsStore;
  _idsTimeline;

  constructor(instrumentsStore) {
    this._instrumentsStore = instrumentsStore;
    this._idsTimeline = Array(5).fill(null);
    makeAutoObservable(this);
    this.getTabIds();
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
    this.saveTabIds();
  }

  setDefaultCard(card) {
    this._idsTimeline[0] = card.id;
    this.saveTabIds();
  }

  existsInTimeline(instrumentOrId) {
    const instrumentId =
      typeof instrumentOrId === "object" ? instrumentOrId.id : instrumentOrId;

    return this._idsTimeline.includes(instrumentId);
  }

  setInstrumentAt(emplacement, idInstrument) {
    if (emplacement < 0 || emplacement > this._idsTimeline.length) {
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
      this._idsTimeline = Array(this._idsTimeline.length).fill(null);
    }
  }
}
