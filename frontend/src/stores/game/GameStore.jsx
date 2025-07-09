import { makeAutoObservable, runInAction } from "mobx";

export default class GameStore {
  _gamesStore;
  _authStore;
  _instrumentsStore;
  _timerInterval = null;
  _idsTimeline = [];
  _highlightStatus = {};
  _nbBadResponse = 0;
  _nbGoodResponse = 0;
  _size = 5;
  isMusicPlaying = true;

  constructor(gamesStore, authStore, instrumentsStore) {
    this._gamesStore = gamesStore;
    this._authStore = authStore;
    this._instrumentsStore = instrumentsStore;

    this._idsTimeline = Array(this._size).fill(null);
    this._highlightStatus = {};
    this._size = this._idsTimeline.length;
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;
    makeAutoObservable(this);
    this.getTabIds();
    const savedSound = localStorage.getItem("isMusicPlaying");
    if (savedSound !== null) {
      this.isMusicPlaying = savedSound === "true";
    }
  }

  toggleMusic = () => {
    this.isMusicPlaying = !this.isMusicPlaying;
    localStorage.setItem("isMusicPlaying", this.isMusicPlaying);
  };

  setMusicPlaying = (value) => {
    this.isMusicPlaying = value;
    localStorage.setItem("isMusicPlaying", value);
  };

  get state() {
    return this._gamesStore;
  }

  initializeGame(settings = {}) {
    const defaults = {
      timer: 80,
      difficulty: "easy",
      isUnlimited: false,
      score: 100,
      clue: true,
      mode: "poids",
      cards: 10,
    };

    const config = { ...defaults, ...settings };

    this.setupGame(config);
    this.resetGame(config.timer, config.score);
  }

  setupGame({ timer, cards, isUnlimited, difficulty, clue, mode }) {
    this._gamesStore.timerGame = timer;
    this._gamesStore.timerRemaining = timer;
    this._gamesStore.score = 100;
    this._gamesStore.cards = cards;
    this._gamesStore.isUnlimited = isUnlimited;
    this._gamesStore.difficulty = difficulty;
    this._gamesStore.clue = clue;
    this._gamesStore.mode = mode;
    this._gamesStore.selectedInstruments = [];
    this._gamesStore.nbBadResponse = 0;
    this._gamesStore.nbGoodResponse = 0;
    this._gamesStore.endGame = false;
    this._gamesStore.win = false;
    this._gamesStore.currentIndex = 0;
    this._gamesStore.timeElapsed = 0;
  }

  resetGame(timer = 30) {
    this._gamesStore.currentIndex = 0;
    this._gamesStore.timerGame = timer;
    this._gamesStore.timerRemaining = timer;
    this._gamesStore.endGame = false;
    this._gamesStore.win = false;
    this._gamesStore.isPaused = false;
    this._gamesStore.score = 0;
    this._gamesStore.nbBadResponse = 0;
    this._gamesStore.nbGoodResponse = 0;
  }

  startNewRound() {
    this._gamesStore.currentIndex = 0;
    this._gamesStore.timerRemaining = this._gamesStore.timerGame;
    this._gamesStore.endGame = false;
    this._gamesStore.win = false;
    this._gamesStore.isPaused = false;
    this._gamesStore.nbBadResponse = 0;
    this._gamesStore.nbGoodResponse = 0;
    this.startTimer();
  }

  handleDrop() {
    this.incrementCurrentIndex();
  }

  finishGame(cards, timer, difficulty, nbBadResponse, nbGoodResponse) {
    if (this._gamesStore.endGame) return;

    this._gamesStore.endGame = true;
    this.calculateTimeRemaining();
    this.calculateScore(
      cards,
      timer,
      difficulty,
      nbBadResponse,
      nbGoodResponse,
      this._gamesStore.win
    );
    this.clearTimer();
    this.postGameToUser();

    if (this._authStore.currentUser) {
      const finalScore =
        this._authStore.currentUser.score + this._gamesStore.score;
      this._authStore.updateScoreAndPlayedGames(finalScore);
    }
  }

  tickTimer() {
    if (
      !this._gamesStore.isPaused &&
      !this._gamesStore.endGame &&
      !this._gamesStore.isUnlimited
    ) {
      this._gamesStore.timerRemaining -= 1;
      if (this._gamesStore.timerRemaining <= 0) {
        this._gamesStore.endGame = true;
        this.clearTimer();
      }
    }
  }

  startTimer() {
    this.clearTimer();
    this._timerInterval = setInterval(() => this.tickTimer(), 1000);
  }

  clearTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }

  calculateTimeRemaining() {
    this._gamesStore.timeElapsed =
      this._gamesStore.timerGame - this._gamesStore.timerRemaining;
  }

  calculateScore(cards, timer, difficulty, nbBadResponse, nbGoodResponse, win) {
    let newScore = this._gamesStore.score;

    const difficultySettings = {
      easy: { good: 10, bad: 5, winBonus: 20, loseMalus: 5 },
      normal: { good: 15, bad: 10, winBonus: 30, loseMalus: 10 },
      hard: { good: 20, bad: 15, winBonus: 50, loseMalus: 20 },
      personalize: () => {
        const scale = Math.min(Math.max(cards / Math.max(timer, 1), 0.5), 3);
        return {
          good: Math.round(12 * scale),
          bad: Math.round(8 * Math.max(scale, 1)),
          winBonus: Math.round(25 * scale),
          loseMalus: Math.round(10 * scale),
        };
      },
    };

    const points =
      difficulty === "personalize"
        ? difficultySettings.personalize()
        : difficultySettings[difficulty] || difficultySettings.normal;

    newScore += nbGoodResponse * points.good;
    newScore -= nbBadResponse * points.bad;
    newScore += win ? points.winBonus : -points.loseMalus;
    this._gamesStore.score = Math.max(10, Math.ceil(newScore));
  }

  incrementCurrentIndex() {
    this._gamesStore.currentIndex += 1;
  }

  async setRandomCards(cards) {
    const response = await fetch(
      `http://localhost:8000/api/instruments/random/${cards + 1}`
    );
    if (!response.ok) throw new Error("Erreur HTTP: " + response.status);

    const data = await response.json();

    runInAction(() => {
      const selection = data.slice(0, cards);
      const defaultCard = data[cards];

      this._gamesStore.selectedInstruments = selection;
      this.setDefaultCard(defaultCard);
    });
  }

  async postGameToUser() {
    const userId = this._authStore.currentUser?.id;
    if (!userId) return console.warn("Utilisateur introuvable");

    const {
      win,
      selectedInstruments,
      score,
      difficulty,
      timerGame,
      timeElapsed,
      nbBadResponse,
    } = this._gamesStore;

    const nbCards = selectedInstruments?.length ?? 0;

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${userId}/games`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            win,
            nbCards,
            score,
            difficulty,
            timer: timerGame,
            time_elapsed: timeElapsed,
            nb_bad: nbBadResponse,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status} : ${errorText}`);
      }

      const data = await response.json();
      console.log("Partie enregistrée :", data);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la partie :", err);
    }
  }

  /** ---------- TIMELINE LOGIC COMBINÉ ---------- **/

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

  setSizeTimeline(size) {
    this._size = size;
    this._idsTimeline = Array(size).fill(null);
    this.saveTabIds();
  }

  resetTimeline() {
    this._idsTimeline.fill(null);
    this._highlightStatus = {};
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;
    localStorage.removeItem("tabIds");
  }

  setDefaultCard(card) {
    this._idsTimeline[0] = card.id;
    this._highlightStatus[card.id] = "default";
    this.saveTabIds();
  }

  existsInTimeline(instrumentOrId) {
    const id =
      typeof instrumentOrId === "object" ? instrumentOrId.id : instrumentOrId;
    return this._idsTimeline.includes(id);
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

  setInstrumentsSorted(indexDropped, newInstrumentId, mode) {
    let current = [...this._idsTimeline];

    // Suppression de l'instrument s'il était déjà dans la timeline
    current = current.filter((id) => id !== newInstrumentId);

    // enlever les nulls
    let compacted = current.filter((e) => e !== null);

    compacted.splice(indexDropped, 0, newInstrumentId);

    while (compacted.length < this._size) {
      compacted.push(null);
    }

    let currentIds = compacted;

    // afficher
    this._idsTimeline = currentIds;

    // Récupérer les objets instruments à partir des ids non nuls
    const instruments = this._idsTimeline
      .map((id) => (id ? this._instrumentsStore.getInstrumentsById(id) : null))
      .filter(Boolean);

    // Tri selon le mode
    instruments.sort((a, b) => {
      if (mode === "annee") return a.created - b.created;
      if (mode === "taille") return a.height - b.height;
      return a.weight - b.weight;
    });

    const sortedOrder = instruments.map((instr) => instr.id);

    // Initialisation ou récupération de l’état des highlights
    if (!this._highlightStatus || typeof this._highlightStatus !== "object") {
      this._highlightStatus = {};
    }

    // Maj surlignement
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
      runInAction(() => {
        this._idsTimeline = [...sortedOrder];
        while (this._idsTimeline.length < this._size) {
          this._idsTimeline.push(null);
        }
        this.saveTabIds();
      });
    }, 1000);
  }

  get instrumentsTimelineBySlot() {
    return this._idsTimeline.map((id) =>
      id ? this._instrumentsStore.getInstrumentsById(id) : null
    );
  }

  get instrumentsTimeline() {
    return this._idsTimeline
      .filter((id) => id !== null)
      .map((id) => this._instrumentsStore.getInstrumentsById(id));
  }

  saveTabIds() {
    localStorage.setItem("tabIds", JSON.stringify(this._idsTimeline));
  }

  getTabIds() {
    const stored = localStorage.getItem("tabIds");
    this._idsTimeline = stored
      ? JSON.parse(stored)
      : Array(this._size).fill(null);
  }
}
