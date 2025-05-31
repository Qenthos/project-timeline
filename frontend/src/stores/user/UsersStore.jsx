import { makeAutoObservable, runInAction } from "mobx";
import Users from "./Users";

const API_URL = "https://683866862c55e01d184d280a.mockapi.io/player/users";

export default class UsersStore {
  _users = [];
  // _isLoaded = false;
  _currentUser = null;

  constructor() {
    makeAutoObservable(this);
    this.loadUsers();
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      this._currentUser = new Users(JSON.parse(saved));
    }
  }

  get currentUser() {
    return this._currentUser;
  }

  /**
   * Load data users
   */
  async loadUsers() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      runInAction(() => {
        this._users = data.map((user) => new Users(user));
        // this._isLoaded = true;
      });
    } catch (error) {
      throw new Error("Erreur de chargement : " + error);
    }
  }

  get users() {
    return this._users;
  }

  // get isLoaded() {
  //   return this._isLoaded;
  // }

  get usersCount() {
    return this._users.length;
  }

  getUserById(id) {
    return this._users.find((user) => user.id === id) || null;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      const userData = await response.json();

      runInAction(() => {
        const user = new Users({ ...userData, isConnected: true });
        this._currentUser = user;
        this._users.push(user);
        localStorage.setItem("currentUser", JSON.stringify(userData));
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  }

  logout() {
    if (this._currentUser) {
      this._currentUser.isConnected = false;
      localStorage.removeItem("currentUser");
      this._currentUser = null;
    }
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

  /**
   * Delete user
   * @param {*} userId
   */
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

  /**
   * Create account
   * @param {*} mail
   * @param {*} pseudo
   * @param {*} password
   */
  createAccount(mail, pseudo, password) {
    fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: mail,
        username: pseudo,
        password: password,
        score: 0,
        role: "user",
        profilePicture: "",
        bannerImage: "",
        isConnected: true,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création du compte");
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const newUser = new Users(data);
          this._users.push(newUser);
          this._currentUser = newUser;
        });
        alert("Compte créé avec succès !");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  updateScore(score) {
    fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création du compte");
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const userToUpdate = this.getUserById(this.currentUser.id);
          if (userToUpdate) {
            userToUpdate.score = score;
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
