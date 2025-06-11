import { makeAutoObservable } from "mobx";

export default class GameStore {
  _gamesStore;
  _timerInterval = null;

  constructor(gamesStore, usersStore) {
    this._gamesStore = gamesStore;
    this._usersStore = usersStore;
    makeAutoObservable(this);
  }

  resetGame() {
    this._gamesStore.currentIndex = 0;
    this._gamesStore.timerGame = 30;
    this._gamesStore.timerRemaining = 30;
    this._gamesStore.endGame = false;
    this._gamesStore.win = false;
    this._gamesStore.isPaused = false;
    this._gamesStore.score = 100;
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
    this.resetGame();
  }

  calculateScore(nbBadResponse, nbGoodResponse) {
    let newScore = this._gamesStore.score;
    newScore -= nbBadResponse * 10;
    newScore += nbGoodResponse * 15;
    newScore = Math.max(0, Math.ceil(newScore));
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

  finishGame(nbBadResponse, nbGoodResponse) {
    this._gamesStore.endGame = true;
    this.calculateTimeRemaining();
    this.calculateScore(nbBadResponse, nbGoodResponse);
    this.clearTimer();
    this.postGameToUser();
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

  setRandomSelectedInstruments(allInstruments, cards) {
    const random = [...allInstruments].sort(() => Math.random() - 0.5);
    const selection = random.slice(0, cards);
    this._gamesStore.selectedInstruments = selection;
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

 async postGameToUser() {
    const userId = this._usersStore.currentUser?.id;
  
    if (!userId) {
      console.warn("Utilisateur introuvable");
      return;
    }
  
    const { win, selectedInstruments, score, difficulty, timerGame, nbRounds } = this._gamesStore;
    const nbCards = selectedInstruments?.length ?? 0;
  
    fetch(`http://localhost:8000/api/user/${userId}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        win,
        nbCards,
        score,
        difficulty,
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Erreur ${response.status} : ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Partie enregistrée :", data);
      // Tu peux ici faire un runInAction si tu veux mettre à jour un store ou autre
    })
    .catch(error => {
      console.error("Erreur lors de l'enregistrement de la partie :", error);
    });
  }
  

  
}
