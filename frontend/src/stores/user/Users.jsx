import { makeAutoObservable } from "mobx";

export default class Users {
  _id;
  _username;
  _email;
  _score;
  _role;
  _profilePicture;
  _bannerImage;
  _createdAt;

  constructor({
    id,
    username,
    email,
    score,
    role,
    profilePicture,
    bannerImage,
    createdAt,
  }) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._score = score;
    this._role = role;
    this._profilePicture = profilePicture || "";
    this._bannerImage = bannerImage || "";
    this._createdAt = createdAt ? new Date(createdAt) : new Date();

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

  get role() {
    return this._role;
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

  set role(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._role = value.trim();
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
}
