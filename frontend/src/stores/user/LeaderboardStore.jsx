// stores/LeaderboardStore.js
import { makeAutoObservable, runInAction } from "mobx";
import Users from "./User";

const API_URL = "http://localhost:8000/api/users";

export default class LeaderboardStore {
  _users = [];
  _isLoaded = false;

  constructor() {
    makeAutoObservable(this);
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
    return this._users.find((u) => u.id === id) || null;
  }

  async loadUsers() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      runInAction(() => {
        this._users = data.map((u) => new Users(u));
        this._isLoaded = true;
      });
    } catch (err) {
      throw new Error("Erreur chargement utilisateurs");
    }
  }

  async getPositionLeaderboard(userId) {
    const response = await fetch(
      `http://localhost:8000/api/user/${userId}/ranking`
    );
    const data = await response.json();
    return data;
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      runInAction(() => {
        this._users = this._users.filter((u) => u.id !== userId);
      });
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
    }
  }
}
