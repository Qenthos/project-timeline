import { makeAutoObservable } from "mobx";

export default class Game {
  _timer;
  _timerRemaining;
  _timeElapsed;
  _score;
  _isPaused;
  _isUnlimited;
  _endGame;
  _win;
  _currentIndex;
  _selectedInstruments = [];
  _nbBadResponse = 0;
  _nbGoodResponse = 0;
  _difficulty;

  constructor() {
    this._timer = 30;
    this._score = 100;
    this._isPaused = false;
    this._isUnlimited = false;
    this._endGame = false;
    this._win = false;
    this._currentIndex = 0;
    this._timerRemaining = 30;
    this._timeElapsed = 0;
    this._selectedInstruments = [];
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;
    this._difficulty = "easy";

    makeAutoObservable(this);
  }

  get selectedInstruments() {
    return this._selectedInstruments;
  }

  set selectedInstruments(value) {
    this._selectedInstruments = value;
  }

  get difficulty() {
    return this._difficulty;
  }

  set difficulty(value) {
    this._difficulty = value;
  }

  get timerGame() {
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

  set timerGame(value) {
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

  get timerRemaining() {
    return this._timerRemaining;
  }
  set timerRemaining(value) {
    this._timerRemaining = value;
  }

  get timeElapsed() {
    return this._timeElapsed;
  }

  set timeElapsed(value) {
    this._timeElapsed = value;
  }
}
