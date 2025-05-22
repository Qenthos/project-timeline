import { makeAutoObservable, runInAction } from "mobx";
import Instruments from "./Instruments";

const API_URL = "https://682de731746f8ca4a47b1b3a.mockapi.io/instruments/instruments";
export default class InstrumentsStore {
  _instruments = [];
  _isLoaded = false;

  constructor() {
    makeAutoObservable(this);
    this.loadInstruments();
  }

  /**
   * Load data instruments
   */
  async loadInstruments() {
    try {
      const response = await fetch(API_URL);
      this._instruments = await response.json();

      runInAction(() => {
        this._instruments = this._instruments.map(
          (instrument) => new Instruments(instrument)
        );
        console.log(this._instruments)
        this._isLoaded = true;
      });
    } catch (error) {
      throw new Error("Erreur de chargement" + error);
    }
  }

  get instruments() {
    return this._instruments;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get instrumentsCount() {
    return this._instruments.length;
  }

  getInstrumentsById(id) {
    return this._instruments.find((instrument) => instrument.id === id) || null;
  }
}
