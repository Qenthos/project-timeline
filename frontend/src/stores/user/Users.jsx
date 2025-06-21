import { makeAutoObservable } from "mobx";

export default class Users {
  _id;
  _username;
  _email;
  _score;
  _admin;
  _pfp;
  _pfb;
  _createdAt;
  _isConnected;
  _played_games;
  _elo;
  _gamesWon;
  _gamesLost;

  constructor({
    id,
    username,
    email,
    score = 0,
    admin,
    pfp,
    pfb,
    createdAt,
    isConnected = false,
    played_games = 0,
    elo = 100,
    gamesWon = 0,
    gamesLost = 0,
  }) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._score = score;
    this._admin = admin;
    this._pfp = pfp ?? 1;
    this._pfb = pfb ?? 1;
    this._createdAt = createdAt ? new Date(createdAt) : new Date();
    this._isConnected = isConnected;
    this._played_games = played_games;
    this._elo = elo;
    this._gamesWon = gamesWon;
    this._gamesLost = gamesLost;

    makeAutoObservable(this);
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get score() {
    return this._score;
  }

  get admin() {
    return this._admin;
  }

  get pfp() {
    return this._pfp;
  }

  get pfpUrl() {
    return `/media/profile-pictures/pdp-${this._pfp}.png`;
  }

  get pfb() {
    return this._pfb;
  }

  get pfbUrl() {
    return `/media/banner-images/wallpaper-${this._pfb}.jpg`;
  }

  get createdAt() {
    return this._createdAt;
  }

  get isConnected() {
    return this._isConnected;
  }

  get played_games() {
    return this._played_games;
  }

  get elo() {
    return this._elo;
  }

  get gamesWon() {
    return this._gamesWon;
  }

  get gamesLost() {
    return this._gamesLost;
  }

  set username(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._username = value.trim();
    } else {
      throw new Error(`Nom invalide : ${value}`);
    }
  }

  set email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value === "string" && emailRegex.test(value.trim())) {
      this._email = value.trim();
    } else {
      throw new Error(`Email invalide : ${value}`);
    }
  }

  set score(value) {
    if (typeof value === "number" && value >= 0) {
      this._score = value;
    } else {
      throw new Error(`Score invalide : ${value}`);
    }
  }

  set admin(value) {
    if (typeof value === "boolean") {
      this._admin = value;
    } else {
      throw new Error(`Rôle invalide : ${value}`);
    }
  }

  set pfp(value) {
    if (Number.isInteger(value) && value > 0) {
      this._pfp = value;
    } else {
      throw new Error(
        `ID de photo de profil invalide : ${JSON.stringify(value)}`
      );
    }
  }

  set pfb(value) {
    if (Number.isInteger(value) && value > 0) {
      this._pfb = value;
    } else {
      throw new Error(`ID de bannière invalide : ${JSON.stringify(value)}`);
    }
  }

  set createdAt(value) {
    const date = new Date(value);
    if (date.toString() !== "Invalid Date") {
      this._createdAt = date;
    } else {
      throw new Error(`Date invalide: ${value}`);
    }
  }

  set isConnected(value) {
    if (typeof value === "boolean") {
      this._isConnected = value;
    } else {
      throw new Error(`Valeur de connexion invalide: ${value}`);
    }
  }

  set played_games(value) {
    if (Number.isInteger(value) && value >= 0) {
      this._played_games = value;
    } else {
      throw new Error(`Nombre de parties invalide : ${value}`);
    }
  }

  set elo(value) {
    if (Number.isInteger(value) && value >= 0) {
      this._elo = value;
    } else {
      throw new Error(`Elo invalide : ${value}`);
    }
  }

  set gamesWon(value) {
    if (Number.isInteger(value) && value >= 0) {
      this._gamesWon = value;
    } else {
      throw new Error(`Parties gagnées invalides : ${value}`);
    }
  }

  set gamesLost(value) {
    if (Number.isInteger(value) && value >= 0) {
      this._gamesLost = value;
    } else {
      throw new Error(`Parties perdues invalides : ${value}`);
    }
  }
}
