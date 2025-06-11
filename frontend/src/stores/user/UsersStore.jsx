import { makeAutoObservable, runInAction } from "mobx";
import Users from "./Users";

// const API_URL = "https://683866862c55e01d184d280a.mockapi.io/player/users";

const API_URL = "http://localhost:8000/api/users"

export default class UsersStore {
  _users = [];
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
      });
    } catch (error) {
      throw new Error("Erreur de chargement : " + error);
    }
  }

  get users() {
    return this._users;
  }

  get usersCount() {
    return this._users.length;
  }

  getUserById(id) {
    return this._users.find((user) => user.id === id) || null;
  }

  /**
   * Create account
   * @param {*} mail
   * @param {*} pseudo
   * @param {*} password
   */
  createAccount(email, username, password) {
    fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        profilePicture: "/media/profile-pictures/pdp-deux.png",
        bannerImage: "/media/banner-images/wallpaper-un.jpg",
        score: 0,
        admin: false,
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
        console.log(data);
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

  /**
   * Login
   * @param {*} email
   * @param {*} password
   */
  async login(email, password) {
    try {
      // const response = await fetch(
      //   `${API_URL}?email=${encodeURIComponent(
      //     email
      //   )}&password=${encodeURIComponent(password)}`
      // );
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erreur réseau");
      }
      const users = await response.json();
      if (users.length === 0) {
        throw new Error("Identifiants incorrects");
      }

      runInAction(() => {
        const userData = users[0];
        const user = new Users({ ...userData, isConnected: true });
        this._currentUser = user;

        const exists = this._users.find((u) => u.id === user.id);
        if (!exists) {
          this._users.push(user);
        }

        localStorage.setItem("currentUser", JSON.stringify(userData));
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  }

  /**
   * Logout of an account
   */
  logout() {
    if (this._currentUser) {
      this._currentUser.isConnected = false;
      localStorage.removeItem("currentUser");
      this._currentUser = null;
    }
  }

  /**
   * Update user
   * @param {*} id
   * @param {*} username
   * @param {*} email
   */
  updateUser(id, username, email, password) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
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
            userToUpdate.password = password;
          }
        });
        this.refreshCurrentUser();
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
   * Update score
   * @param {*} score
   */
  updateScore(score) {
    fetch(`${API_URL}/${this._currentUser.id}`, {
      method: "PUT",
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
          const userToUpdate = this.getUserById(this._currentUser.id);
          if (userToUpdate) {
            userToUpdate.score = score;
          }
        });
        this.refreshCurrentUser();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   *
   * @param {*} profilePicture
   */
  updateProfilPicture(profilePicture) {
    fetch(`${API_URL}/${this._currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePicture: profilePicture,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la modification de la photo de profil"
          );
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const userToUpdate = this.getUserById(this._currentUser.id);
          if (userToUpdate) {
            userToUpdate.profilePicture = profilePicture;
          }
        });
        this.refreshCurrentUser();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Update banner
   * @param {*} bannerImage
   */
  updateBannerImage(bannerImage) {
    fetch(`${API_URL}/${this._currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bannerImage: bannerImage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la modification de la photo de profil"
          );
        }
        return response.json();
      })
      .then((data) => {
        runInAction(() => {
          const userToUpdate = this.getUserById(this._currentUser.id);
          if (userToUpdate) {
            userToUpdate.bannerImage = bannerImage;
          }
        });
        this.refreshCurrentUser();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Refresh date -> currentUser
   * @returns
   */
  async refreshCurrentUser() {
    if (!this._currentUser?.id) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${this._currentUser.id}`);
      const data = await response.json();
      runInAction(() => {
        const updatedUser = new Users(data);
        this._currentUser = updatedUser;
        localStorage.setItem("currentUser", JSON.stringify(data));
      });
    } catch (err) {
      console.error("Erreur refreshCurrentUser :", err);
    }
  }
}
