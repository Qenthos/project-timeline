import { makeAutoObservable } from "mobx";
export default class Instruments {
  _id;
  _name;
  _image;
  _category;
  _dateCreation;
  _origin;
  _description;
  _culturalFamily;
  _anecdote;

  constructor({
    id,
    name,
    image,
    category,
    dateCreation,
    origin,
    description,
    culturalFamily,
    anecdote,
  }) {
    this._id = id;
    this._name = name;
    this._image = image;
    this._category = category;
    this._dateCreation = dateCreation;
    this._origin = origin;
    this._description = description;
    this._culturalFamily = culturalFamily;
    this._anecdote = anecdote;
    makeAutoObservable(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get image() {
    return this._image;
  }

  get category() {
    return this._category;
  }

  get dateCreation() {
    return this._dateCreation;
  }

  get origin() {
    return this._origin;
  }

  get description() {
    return this._description;
  }

  get culturalFamily() {
    return this._culturalFamily;
  }

  get anecdote() {
    return this._anecdote;
  }

  set name(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._name = value.trim();
    } else {
      throw new Error(`Nom invalide : ${value}`);
    }
  }

  set image(value) {
    if (
      typeof value === "string" &&
      value.trim().length > 0 &&
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(value.trim())
    ) {
      this._image = value.trim();
    } else {
      throw new Error(`URL d'image invalide : ${value}`);
    }
  }
  

  set category(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._category = value.trim();
    } else {
      throw new Error(`Catégorie invalide : ${value}`);
    }
  }

  set dateCreation(value) {
    if (
      typeof value !== "number" ||
      !Number.isInteger(value) ||
      value > new Date().getFullYear()
    ) {
      throw new Error(`Année invalide : ${value}`);
    }
    this._dateCreation = value;
  }

  set origin(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._origin = value.trim();
    } else {
      throw new Error(`Origine invalide : ${value}`);
    }
  }

  set description(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._description = value.trim();
    } else {
      throw new Error(`Origine invalide : ${value}`);
    }
  }

  set culturalFamily(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._culturalFamily = value.trim();
    } else {
      throw new Error(`Famille culturelle invalide : ${value}`);
    }
  }

  set anecdote(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._anecdote = value.trim();
    } else {
      throw new Error(`Anecdote invalide : ${value}`);
    }
  }
}
