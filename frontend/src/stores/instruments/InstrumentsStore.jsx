import { makeAutoObservable, runInAction } from "mobx";
import Instruments from "./Instruments";

const API_URL = "http://localhost:8000/api/instruments";

export default class InstrumentsStore {
  _instruments = [];
  _isLoaded = false;
  _cluesCache = {};

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

  /**
   * Update instrument
   * @param {*} id
   * @param {*} name
   * @param {*} category
   * @param {*} created
   * @param {*} weight
   * @param {*} height
   * @param {*} description
   */
  updateInstrument(id, name, category, created, weight, height, description) {
    console.log(typeof id);
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
        console.log("Réponse brute :", response);
        if (!response.ok) {
          return response.text().then((err) => {
            console.error("Erreur API : ", err);
            throw new Error(`Erreur ${response.status}`);
          });
        }
        return response.json();
      })
      .then(() => {
        runInAction(() => {
          const instrumentToUpdate = this.getInstrumentsById(Number(id));
          if (instrumentToUpdate) {
            instrumentToUpdate.name = name;
            instrumentToUpdate.category = category;
            instrumentToUpdate.created = created;
            instrumentToUpdate.weight = weight;
            instrumentToUpdate.height = height;
            instrumentToUpdate.description = description;
          }
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  }

  /**
   * Delete instrument
   * @param {*} userId
   */
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

  async fetchClue(type, id) {
    const key = `${type}_${id}`;

    if (this._cluesCache[key]) {
      return this._cluesCache[key];
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/clues/${type}/${id}`
      );
      if (!response.ok) throw new Error("Clue not found");
      const clue = await response.json();

      runInAction(() => {
        this._cluesCache[key] = clue;
      });

      return clue;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async loadCluesForInstrument(instrument) {
    if (!instrument.indice) return;

    const { weight, height, year } = instrument.indice;
    const [weightClue, heightClue, yearClue] = await Promise.all([
      this.fetchClue("weight", weight),
      this.fetchClue("height", height),
      this.fetchClue("year", year),
    ]);

    runInAction(() => {
      instrument.clues = {
        weight: weightClue,
        height: heightClue,
        year: yearClue,
      };
    });
  }
}
