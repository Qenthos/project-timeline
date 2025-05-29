import { makeAutoObservable, runInAction } from "mobx";
import User from "./Users";

const API_URL = "https://683866862c55e01d184d280a.mockapi.io/player/users";

export default class UsersStore {
  _users = [];
  _isLoaded = false;

  constructor() {
    makeAutoObservable(this);
    this.loadUsers();
  }

  /**
   * Load data users
   */
  async loadUsers() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      runInAction(() => {
        this._users = data.map((user) => new User(user));
        this._isLoaded = true;
      });
    } catch (error) {
      throw new Error("Erreur de chargement : " + error);
    }
  }

  get users() {
    return this._users;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get usersCount() {
    return this._users.length;
  }

  getUserById(id) {
    return this._users.find((user) => user.id === id) || null;
  }

  updateUser(id, username, email, score) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        score,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const userToUpdate = this.getUserById(id);
          if (userToUpdate) {
            userToUpdate.username = username;
            userToUpdate.email = email;
            userToUpdate.score = score;
          }
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  }

  deleteUser(userId) {
    fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
     alert("Utilisateur supprimé");
    })
    .catch((err) => {
      console.error(err);
    });
  }
  
}
