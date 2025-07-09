import { makeAutoObservable, runInAction } from "mobx";
import Users from "./User";

const API_URL = "http://localhost:8000/api";

export default class AuthStore {
  _currentUser = null;
  isLoaded = false;  

  constructor() {
    makeAutoObservable(this);
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      this._currentUser = new Users(JSON.parse(saved));
      this.isLoaded = true;
    }
  }

  

  get currentUser() {
    return this._currentUser;
  }

  async login(email, password) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur login");

    runInAction(() => {
      const user = new Users({ ...data.user, isConnected: true });
      this._currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      this.isLoaded = true;
    });
  }

  async loginAdmin(email, password) {
    await this.login(email, password);
    if (!this._currentUser?.admin) {
      this.logout();
      throw new Error("Accès refusé : vous n'êtes pas administrateur");
    }
  }

  logout() {
    if (this._currentUser) {
      this._currentUser.isConnected = false;
      localStorage.removeItem("currentUser");
      this._currentUser = null;
      this.isLoaded = false;
    }
  }

  async createAccount(email, username, password) {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        pfp: 1,
        pfb: 1,
        score: 0,
        elo: 0,
        admin: false,
        played_games: 0,
        isConnected: true,
        gamesWon: 0,
        gamesLost: 0,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Erreur création : ${data}`);

    runInAction(() => {
      this._currentUser = new Users(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      this.isLoaded = true;
    });
  }

  async updateUser({ username, email, score, password }) {
    const id = this._currentUser?.id;
    if (!id) return;

    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, score, password }),
    });

    if (!response.ok) throw new Error("Erreur mise à jour utilisateur");
    await this.refreshCurrentUser();
  }

  async updateProfilPicture(pfp) {
    await this._updateField("pfp", pfp);
  }

  async updateBannerImage(pfb) {
    await this._updateField("pfb", pfb);
  }

  async updateScore(score) {
    await this._updateField("score", score);
  }

  async _updateField(field, value) {
    const id = this._currentUser?.id;
    if (!id) return;

    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) throw new Error(`Erreur update ${field}`);
    await this.refreshCurrentUser();
  }

  async incrementPlayedGames() {
    const user = this._currentUser;
    if (!user) return;
    const updatedPlayedGames = (user.played_games || 0) + 1;
    await this._updateField("played_games", updatedPlayedGames);
  }

  async updateElo() {
    const { score, played_games, id } = this._currentUser;
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, played_games }),
    });

    const updatedUser = await response.json();
    runInAction(() => {
      this._currentUser.elo = updatedUser.elo;
    });
    await this.refreshCurrentUser();
  }

  async refreshCurrentUser() {
    const id = this._currentUser?.id;
    if (!id) return;

    const response = await fetch(`${API_URL}/user/${id}`);
    const data = await response.json();

    runInAction(() => {
      this._currentUser = new Users(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      this.isLoaded = true;
    });
  }

  async getIsAdmin(id) {
    try {
      const response = await fetch(`${API_URL}/user/isAdmin/${id}`);
      const data = await response.json();
      return data.admin ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Supprimer son propre compte (utilisateur connecté)
   */
  async deleteOwnAccount() {
    if (!this._currentUser?.id) {
      throw new Error("Aucun utilisateur connecté");
    }

    try {
      const response = await fetch(`${API_URL}/user/${this._currentUser.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du compte");
      }

      runInAction(() => {
        this.logout();
      });

      alert("Votre compte a bien été supprimé.");
    } catch (err) {
      console.error("Erreur suppression compte :", err);
      throw err;
    }
  }

  async updateScoreAndPlayedGames(newScore) {
    const user = this._currentUser;
    if (!user) {
      console.error("Utilisateur non trouvé");
      return;
    }
  
    const updatedPlayedGames = (user.played_games || 0) + 1;
    const updatedScore = (user.score || 0) + newScore;
  
    try {
      const response = await fetch(`${API_URL}/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: updatedScore,
          played_games: updatedPlayedGames,
        }),
      });
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur ${response.status} : ${text}`);
      }
  
      const updatedUser = await response.json();
  
      runInAction(() => {
        user.score = updatedUser.score;
        user.played_games = updatedUser.played_games;
        user.elo = updatedUser.elo;
      });
  
      await this.refreshCurrentUser();
    } catch (err) {
      console.error("Erreur updateScoreAndPlayedGames :", err);
    }
  }
  

}
