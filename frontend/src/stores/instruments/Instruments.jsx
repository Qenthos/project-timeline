import { makeAutoObservable } from "mobx";

export default class Instruments {
  _id;
  _name;
  _image;
  _category;
  _created;
  _weight;
  _height;
  _description;

  constructor({
    id,
    name,
    image,
    category,
    created,
    weight,
    height,
    description,
  }) {
    this._id = id;
    this._name = name;
    this._image = image;
    this._category = category;
    this._created = created;
    this._weight = weight;
    this._height = height;
    this._description = description;
    makeAutoObservable(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get image() {
    return `/media/instru-cards/${this._image}`;
  }

  get category() {
    return this._category;
  }

  get created() {
    return this._created;
  }

  get weight() {
    return this._weight;
  }

  get height() {
    return this._height;
  }

  get description() {
    return this._description;
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

  set created(value) {
    const currentYear = new Date().getFullYear();
    if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value > 0 &&
      value <= currentYear
    ) {
      this._created = value;
    } else {
      throw new Error(`Année invalide : ${value}`);
    }
  }

  set weight(value) {
    if (typeof value === "number" && value >= 0) {
      this._weight = value;
    } else {
      throw new Error(`Poids invalide : ${value}`);
    }
  }

  set height(value) {
    if (typeof value === "number" && value >= 0) {
      this._height = value;
    } else {
      throw new Error(`Hauteur invalide : ${value}`);
    }
  }

  set description(value) {
    if (typeof value === "string" && value.trim().length > 0) {
      this._description = value.trim();
    } else {
      throw new Error(`Description invalide : ${value}`);
    }
  }

}
