import { makeAutoObservable } from "mobx";

export default class TimelineStore {
  _instrumentsStore;
  _idsTimeline;

  constructor(instrumentsStore) {
    this._instrumentsStore = instrumentsStore;
    this._idsTimeline = Array(5).fill(null);
    this.getTabIds();
    makeAutoObservable(this);
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
    return (this._idsTimeline = Array(size).fill(null));
  }

  setDefaultCard(card) {
    this._idsTimeline.unshift(card.id);
    this._idsTimeline.pop();
    this.saveTabIds();
  }

  existsInTimeline(instrumentOrId) {
    const instrumentId =
      typeof instrumentOrId === "object" ? instrumentOrId.id : instrumentOrId;

    return this._idsTimeline.includes(instrumentId);
  }

  setInstrumentAt(emplacement, idInstrument) {
    if (emplacement < 0 || emplacement > 9) {
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
