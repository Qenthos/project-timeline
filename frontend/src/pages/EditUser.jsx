import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useUsersStore } from "./../stores/useStore";
import "./EditUser.scss";

const EditUser = () => {
  const { userId } = useParams();
  let navigate = useNavigate();

  const usersStore = useUsersStore();
  const user = usersStore.getUserById(Number(userId));
  console.log(user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setScore(user.score);
    }
  }, [user]);

  /**
   * Edit a user
   * @param {*} evt
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (userId) {
      const data = {
        username: username,
        email: email,
        score: parseInt(score),
      };

      try {
        const updatedUser = await usersStore.updateUser(
          userId,
          data.username,
          data.email,
          data.score
        );
        if (updatedUser) {
          navigate(-1);
        }
      } catch (error) {
        window.alert("Erreur lors de la modification");
      }
    }
    handleReset();
  };

  /**
   * Delete user
   */
  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await usersStore.deleteUser(userId);
        navigate(-1);
      } catch (error) {
        window.alert("Erreur lors de la suppression");
      }
    }
  };

  /**
   * Back
   */
  const handleReset = () => {
    navigate(-1);
  };

  return (
    <section className="user-edit">
      <h2 className="user-edit__title">Modifier l'utilisateur : {username}</h2>

      <form onSubmit={handleSubmit} className="user-edit__form">
        <ul className="user-edit__list">
          <li className="user-edit__item">
            <label htmlFor="username" className="user-edit__label">
              Pseudo
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="user-edit__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>

          <li className="user-edit__item">
            <label htmlFor="email" className="user-edit__label">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="user-edit__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </li>

          <li className="user-edit__item">
            <label htmlFor="score" className="user-edit__label">
              Score
            </label>
            <input
              type="number"
              id="score"
              name="score"
              className="user-edit__input"
              min="0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </li>

          {/* 
            <li className="user-edit__item">
                <label htmlFor="bannerImage" className="user-edit__label">
                Photo de couverture (URL)
                </label>
                <input
                type="url"
                id="bannerImage"
                name="bannerImage"
                className="user-edit__input"
                value={bannerImage}
                onChange={(e) => setbannerImage(e.target.value)}
                />
            </li>

            <li className="user-edit__item">
                <label htmlFor="profilePicture" className="user-edit__label">Photo de profil (URL)</label>
                <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                className="user-edit__input"
                value={profilePicture}
                onChange={(e) => setprofilePicture(e.target.value)}
                />
            </li> 
  */}
        </ul>

        <ul className="user-edit__actions">
          <li className="user-edit__action">
            <button
              type="button"
              onClick={handleReset}
              className="user-edit__button user-edit__button--cancel"
            >
              Annuler
            </button>
          </li>
          <li className="user-edit__action">
            <button
              type="submit"
              className="user-edit__button user-edit__button--submit"
            >
              Enregistrer
            </button>
          </li>
          <li className="user-edit__action">
            <button
              type="button"
              onClick={handleDelete}
              className="user-edit__button user-edit__button--delete"
            >
              Supprimer l'utilisateur
            </button>
          </li>
        </ul>
      </form>
    </section>
  );
};

export default EditUser;
