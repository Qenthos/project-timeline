import { makeAutoObservable } from "mobx";

export default class GameStore {
  _timer;
  _timerGame;
  _timeRemaining;
  _score;
  _isPaused;
  _isUnlimited;
  _endGame;
  _win;
  _currentIndex;
  _timerInterval;
  _selectedInstruments = [];
  _nbBadResponse = 0;
  _nbGoodResponse = 0;

  constructor() {
    this._timer = 30;
    this._score = 100;
    this._isPaused = false;
    this._isUnlimited = false;
    this._endGame = false;
    this._win = false;
    this._currentIndex = 0;
    this._timerGame = 30;
    this._timeRemaining = 0;
    this._timerInterval = null;
    this._selectedInstruments = [];
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;

    makeAutoObservable(this);
  }

  get selectedInstruments() {
    return this._selectedInstruments;
  }

  set selectedInstruments(value) {
    this._selectedInstruments = value;
  }

  get timer() {
    return this._timer;
  }

  get score() {
    return this._score;
  }

  get isPaused() {
    return this._isPaused;
  }

  get isUnlimited() {
    return this._isUnlimited;
  }

  get endGame() {
    return this._endGame;
  }

  get win() {
    return this._win;
  }


  get currentIndex() {
    return this._currentIndex;
  }

  set timer(value) {
    this._timer = value;
  }

  set score(value) {
    this._score = value;
  }

  set isPaused(value) {
    this._isPaused = value;
  }

  set isUnlimited(value) {
    this._isUnlimited = value;
  }

  set endGame(value) {
    this._endGame = value;
  }

  set win(value) {
    this._win = value;
  }

  
  set currentIndex(value) {
    this._currentIndex = value;
  }

  get timerGame() {
    return this._timerGame;
  }
  set timerGame(value) {
    this._timerGame = value;
  }

  get timeRemaining() {
    return this._timeRemaining;
  }

  resetGame() {
    this._currentIndex = 0;
    this._timer = 30;
    this._endGame = false;
    this._win = false;
    this._isPaused = false;
  }

  calculateScore(nbBadResponse, nbGoodResponse) {
    let newScore = this._score;
    newScore -= nbBadResponse * 10;
    newScore += nbGoodResponse * 15;
    newScore = Math.max(0, Math.ceil(newScore));
    this._score = newScore;
  }

  calculateTimeRemaining() {
    const timeGame = this._timer;
    const finishTime = this._timerGame;
    let remaining = timeGame - finishTime;
    this._timeRemaining = remaining;
  }

  incrementCurrentIndex() {
    this._currentIndex += 1;
  }

  handleDrop() {
    this.incrementCurrentIndex();
  }

  finishGame(nbBadResponse, nbGoodResponse) {
    this._endGame = true;
    this.calculateTimeRemaining();
    this.calculateScore(nbBadResponse, nbGoodResponse);
  }

  startNewRound() {
    this._currentIndex = 0;
    this._timerGame = this._timer;
    this._endGame = false;
    this._win = false;
    this._isPaused = false;
    this.startTimer();
  }

  setRandomSelectedInstruments(allInstruments, cards) {
    // Mélange aléatoire et sélection des cartes
    const random = [...allInstruments].sort(() => Math.random() - 0.5);
    const selection = random.slice(0, cards);
    this.selectedInstruments = selection;
  }

  tickTimer() {
    if (!this._isPaused && !this._endGame && !this._isUnlimited) {
      this._timerGame -= 1;
      if (this._timerGame <= 0) {
        this._endGame = true;
      }
    }
  }

  startTimer() {
    this._timerGame = this._timer;
    this._endGame = false;
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }

    this._timerInterval = setInterval(() => {
      this.tickTimer();
      if (this._endGame) {
        clearInterval(this._timerInterval);
        this._timerInterval = null;
      }
    }, 1000);
  }
}
