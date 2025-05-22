import { makeAutoObservable } from "mobx";

export default class timelineStore {
  _instrumentsStore;
  _idsTimeline;

  constructor(instrumentsStore) {
    this._instrumentsStore = instrumentsStore;
    this._idsTimeline = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
      // this._idsTimeline = Array(10).fill(null);
    this.getTabIds();
    makeAutoObservable(this);
  }

  get instrumentsTimeline() {
    return this._idsExpo
      .filter((id) => id !== null)
      .map((id) => this._instrumentsStore.getInstrumentsById(id));
  }

  get instrumentsTimelineBySlot() {
    return this._idsExpo.map((id) =>
      id ? this._instrumentsStore.getInstrumentsById(id) : null
    );
  }

  existsInTimeline(instrumentOrId) {
    const instrumentId =
      typeof instrumentOrId === "object" ? instrumentOrId.id : instrumentOrId;

    return this._idsExpo.includes(instrumentId);
  }

  setInstrumentsAt(emplacement, idInstrument) {
    if (emplacement < 0 || emplacement > 9) {
      throw new Error("L'emplacement doit être compris entre 0 et 9");
    }

    if (this._idsExpo[emplacement] !== null) {
      return;
    }

    this._idsExpo[emplacement] = idInstrument;
    this.saveTabIds();
  }

  reset() {
    this._idsExpo.fill(null);
    localStorage.removeItem("tabIds");
  }

  saveTabIds() {
    localStorage.setItem("tabIds", JSON.stringify(this._idsExpo));
  }

  getTabIds() {
    const storedTabIds = localStorage.getItem("tabIds");
    if (storedTabIds) {
      this._idsExpo = JSON.parse(storedTabIds);
    } else {
      this._idsExpo = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
    }
  }
}
