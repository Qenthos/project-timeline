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
    fetch(`http://localhost:8000/api/user`, {
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
        elo: 0,
        // admin: false,
        isConnected: true,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Erreur ${response.status} : ${text}`);
        });
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
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }

      const users = await response.json();

      const userByEmail = users.find((u) => u.email === email);

      if (!userByEmail) {
        throw new Error("Adresse mail introuvable");
      }
  
      if (userByEmail.password !== password) {
        throw new Error("Mot de passe incorrect");
      }

      runInAction(() => {
        const user = new Users({ ...userByEmail, isConnected: true });

        this._currentUser = user;

        const exists = this._users.find((u) => u.id === user.id);
        if (!exists) {
          this._users.push(user);
        }

        localStorage.setItem("currentUser", JSON.stringify({ ...userByEmail}));      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw error;
    }
  }

  /**
   * Login Administrateur
   * @param {*} email 
   * @param {*} password 
   */
  async loginAdmin(email, password) {
    try {
      const response = await fetch(API_URL);
  
      if (!response.ok) {
        throw new Error("Erreur réseau");
      }
  
      const users = await response.json();
  
      const userByEmail = users.find((u) => u.email === email);
  
      if (!userByEmail) {
        throw new Error("Adresse mail introuvable");
      }
  
      if (userByEmail.password !== password) {
        throw new Error("Mot de passe incorrect");
      }

      const isAdmin = await this.getIsAdmin(userByEmail.id);
  
      if (!isAdmin) {
        throw new Error("Accès refusé : vous n'êtes pas administrateur");
      }
  
      runInAction(() => {
        const user = new Users({ ...userByEmail, admin: true, isConnected: true });
  
        this._currentUser = user;
  
        const exists = this._users.find((u) => u.id === user.id);
        if (!exists) {
          this._users.push(user);
        }
  
        localStorage.setItem("currentUser", JSON.stringify({ ...userByEmail, admin: true }));
      });
    } catch (error) {
      console.error("Erreur lors de la connexion admin :", error);
      throw error;
    }
  }
  

  async getIsAdmin(id) {
    try {
      const response = await fetch(`http://localhost:8000/api/user/isAdmin/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du statut admin");
      }
      const data = await response.json();
      return data.admin ?? false;
    } catch (error) {
      console.error(error);
      return false;
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
  updateUser(id, username, email, score, password) {
    fetch(`http://localhost:8000/api/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        score,
        password,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Erreur ${response.status} : ${text}`);
        });
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
    fetch(`http://localhost:8000/api/user/${userId}`, {
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
    fetch(`http://localhost:8000/api/user/${this._currentUser.id}`, {
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
    fetch(`http://localhost:8000/api/user/${this._currentUser.id}`, {
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
    fetch(`http://localhost:8000/api/user/${this._currentUser.id}`, {
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
      const response = await fetch(`http://localhost:8000/api/user/${this._currentUser.id}`);
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
