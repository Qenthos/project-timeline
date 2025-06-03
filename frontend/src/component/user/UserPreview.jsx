import PropTypes from "prop-types";
import "./UserPreview.scss";

const UserPreview = ({ user, editable = false, onEdit = () => {} }) => {
  const headingId = `user-title-${user.id}`;

  console.log(user)

  return (
    <article className="user-card">
      <div className="user-card__images-container">
        <img
          src={user.bannerImage}
          alt="Banner"
          className="user-card__banner-image"
        />
        <img
          src={user.profilePicture}
          alt={user.username}
          className="user-card__profile-picture"
        />
      </div>

      <div className="user-card__content">
        <ul className="user-card__list">
          <li className="user-card__item">
            <h2 id={headingId} className="user-card__name">
              {user.username}
            </h2>
          </li>
          <li>
            <span>Mail : {user.email}</span>
          </li>
          <li>
            <span>Rôle : {user.role ? "administrateur" : "utilisateur"}</span>
          </li>
          <li>
            <span>Score : {user.score}</span>
          </li>
          <li>
            <span className="user-card__year">
              Année de création : {user.createdAt.toLocaleString()}
            </span>
          </li>
        </ul>
        {editable && (
          <button
            onClick={() => onEdit(user.id)}
            aria-labelledby={user.name}
            className="user-card__button user-card__button"
          >
            Modifier
          </button>
        )}
      </div>
    </article>
  );
};

UserPreview.propTypes = {
  user: PropTypes.shape({
    profilePicture: PropTypes.string.isRequired,
    bannerImage: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
    role: PropTypes.string,
    score: PropTypes.number,
    createdAt: PropTypes.instanceOf(Date),
  }).isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default UserPreview;
