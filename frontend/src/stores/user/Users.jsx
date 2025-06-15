import { makeAutoObservable } from "mobx";

export default class Users {
  _id;
  _username;
  _email;
  _score;
  _admin;
  _profilePicture;
  _bannerImage;
  _createdAt;
  _isConnected;
  _playedGames;
  _elo;

  constructor({
    id,
    username,
    email,
    score = 0,
    admin,
    profilePicture,
    bannerImage,
    createdAt,
    isConnected = false,
    playedGames = 0,
    elo = 1000,
  }) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._score = score;
    this._admin = admin;
    this._profilePicture =
      profilePicture || "/media/profile-pictures/pdp-deux.png";
    this._bannerImage = bannerImage || "/media/banner-images/wallpaper-un.jpg";
    this._createdAt = createdAt ? new Date(createdAt) : new Date();
    this._isConnected = isConnected;
    this._playedGames = playedGames;
    this._elo = elo;

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

  get profilePicture() {
    return this._profilePicture;
  }

  get bannerImage() {
    return this._bannerImage;
  }

  get createdAt() {
    return this._createdAt;
  }

  get isConnected() {
    return this._isConnected;
  }

  get playedGames() {
    return this._playedGames;
  }

  get elo() {
    return this._elo;
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

  set profilePicture(value) {
    if (
      typeof value === "string" &&
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(value.trim())
    ) {
      this._profilePicture = value.trim();
    } else {
      throw new Error(`URL de photo de profil invalide : ${value}`);
    }
  }

  set bannerImage(value) {
    if (
      typeof value === "string" &&
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(value.trim())
    ) {
      this._bannerImage = value.trim();
    } else {
      throw new Error(`URL de bannière invalide : ${value}`);
    }
  }

  set createdAt(value) {
    const date = new Date(value);
    if (date.toString() !== "Date invalide") {
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

  set playedGames(value) {
    if (Number.isInteger(value) && value >= 0) {
      this._playedGames = value;
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
}
