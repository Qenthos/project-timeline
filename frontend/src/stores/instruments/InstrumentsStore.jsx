import { makeAutoObservable, runInAction } from "mobx";
import Instruments from "./Instruments";

// const API_URL =
//   "https://682de731746f8ca4a47b1b3a.mockapi.io/instruments/instruments";

const API_URL =
  "http://localhost:8000/api/instruments";
  

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
      const data = await response.json();

      runInAction(() => {
        this._instruments = data.map(
          (instrument) => new Instruments(instrument)
        );
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

  updateInstrument(id, name, category, created, weight, height, description) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        category: category,
        created: created,
        weight: weight,
        height: height,
        description: description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const instrumentToUpdate = this.getInstrumentsById(id);
          if (instrumentToUpdate) {
            Object.assign(instrumentToUpdate, {
              name,
              category,
              created,
              weight,
              height,
              description,
            });
          }
        });
        
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  }

  deleteInstrument(userId) {
    fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
     alert("Instrument supprimé");
    })
    .catch((err) => {
      console.error(err);
    });
  }
}
