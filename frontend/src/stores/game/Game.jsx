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
  _selectedInstruments;
  _nbBadResponse;
  _nbGoodResponse;
  _difficulty;
  _mode;
  _clue;
  _cards;

  constructor() {
    this._timer = 30;
    this._timerRemaining = 30;
    this._timeElapsed = 0;
    this._score = 100;
    this._isPaused = false;
    this._isUnlimited = false;
    this._endGame = false;
    this._win = false;
    this._currentIndex = 0;
    this._selectedInstruments = [];
    this._nbBadResponse = 0;
    this._nbGoodResponse = 0;
    this._difficulty = "easy";
    this._mode = "annee";
    this._clue = true;
    this._cards = 10;
    makeAutoObservable(this);
  }

  get timerGame() {
    return this._timer;
  }
  set timerGame(value) {
    this._timer = value;
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

  get score() {
    return this._score;
  }
  set score(value) {
    this._score = value;
  }

  get isPaused() {
    return this._isPaused;
  }
  set isPaused(value) {
    this._isPaused = value;
  }

  get isUnlimited() {
    return this._isUnlimited;
  }
  set isUnlimited(value) {
    this._isUnlimited = value;
  }

  get endGame() {
    return this._endGame;
  }
  set endGame(value) {
    this._endGame = value;
  }

  get win() {
    return this._win;
  }
  set win(value) {
    this._win = value;
  }

  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(value) {
    this._currentIndex = value;
  }

  get selectedInstruments() {
    return this._selectedInstruments;
  }
  set selectedInstruments(value) {
    this._selectedInstruments = value;
  }

  get nbBadResponse() {
    return this._nbBadResponse;
  }
  set nbBadResponse(value) {
    this._nbBadResponse = value;
  }

  get nbGoodResponse() {
    return this._nbGoodResponse;
  }
  set nbGoodResponse(value) {
    this._nbGoodResponse = value;
  }

  get difficulty() {
    return this._difficulty;
  }
  set difficulty(value) {
    this._difficulty = value;
  }

  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
  }

  get clue() {
    return this._clue;
  }
  set clue(value) {
    this._clue = value;
  }

  get cards() {
    return this._cards;
  }
  set cards(value) {
    this._cards = value;
  }
}
