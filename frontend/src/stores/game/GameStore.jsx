import { makeAutoObservable, runInAction } from "mobx";

export default class GameStore {
  _gamesStore;
  _timerInterval = null;
  _timelineStore;

  constructor(gamesStore, usersStore, timelineStore) {
    this._gamesStore = gamesStore;
    this._usersStore = usersStore;
    this._timelineStore = timelineStore;
    makeAutoObservable(this);
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

  get state() {
    return this._gamesStore;
  }

  initializeGame({
    timer = 30,
    difficulty = "easy",
    isUnlimited = false,
    score = 100,
  } = {}) {
    const stateGame = this._gamesStore;
    stateGame.timerGame = timer;
    stateGame.timerRemaining = timer;
    stateGame.difficulty = difficulty;
    stateGame.isUnlimited = isUnlimited;
    stateGame.score = score;
    this.resetGame(timer);
  }

  calculateScore(cards, timer, difficulty, nbBadResponse, nbGoodResponse, win) {
    let newScore = this._gamesStore.score;

    const difficultySettings = {
      easy: { good: 10, bad: 5, winBonus: 20, loseMalus: 5 },
      normal: { good: 15, bad: 10, winBonus: 30, loseMalus: 10 },
      hard: { good: 20, bad: 15, winBonus: 50, loseMalus: 20 },
      personalize: () => {
        const baseDifficulty = cards / Math.max(timer, 1);
        const scale = Math.min(Math.max(baseDifficulty, 0.5), 3);

        return {
          good: Math.round(12 * scale),
          bad: Math.round(8 * (scale > 1 ? scale : 1)),
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

    // Bonus ou malus selon win
    if (win) {
      newScore += points.winBonus;
    } else {
      newScore -= points.loseMalus;
    }

    // Score minimum à 10
    newScore = Math.max(10, Math.ceil(newScore));

    this._gamesStore.score = newScore;
  }

  calculateTimeRemaining() {
    const remaining =
      this._gamesStore.timerGame - this._gamesStore.timerRemaining;
    this._gamesStore.timeElapsed = remaining;
  }

  incrementCurrentIndex() {
    this._gamesStore.currentIndex += 1;
  }

  handleDrop() {
    this.incrementCurrentIndex();
  }

  finishGame(cards, timer, difficulty, nbBadResponse, nbGoodResponse) {
    if (this._gamesStore.endGame) {
      return;
    }

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
    if (this._usersStore.currentUser) {
      let finalScore =
        this._usersStore.currentUser.score + this._gamesStore.score;
      this._usersStore.updateScoreAndPlayedGames(finalScore);
    }
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

  async setRandomCards(cards) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/instruments/random/${cards + 1}`
      );
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      const data = await response.json();

      runInAction(() => {
        const selection = data.slice(0, cards);
        const defaultCard = data[cards];

        this._gamesStore.selectedInstruments = selection;
        this._timelineStore.setDefaultCard(defaultCard);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des instruments :", error);
      throw error;
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
    this._timerInterval = setInterval(() => {
      this.tickTimer();
    }, 1000);
  }

  clearTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }

  /**
   * add game for an user
   * @returns 
   */
  async postGameToUser() {
    const userId = this._usersStore.currentUser?.id;

    if (!userId) {
      console.warn("Utilisateur introuvable");
      return;
    }

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

    fetch(`http://localhost:8000/api/user/${userId}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        win: win,
        nbCards: nbCards,
        score: score,
        difficulty: difficulty,
        timer: timerGame,
        time_elapsed: timeElapsed,
        nb_bad: nbBadResponse,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erreur ${response.status} : ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Partie enregistrée :", data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement de la partie :", error);
      });
  }
}
