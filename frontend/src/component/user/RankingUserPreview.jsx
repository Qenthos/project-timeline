import PropTypes from "prop-types";
import "./RankingUserPreview.scss";

const RankingUserPreview = ({ user, index }) => {
    const headingId = `user-title-${user.id}`;
  
    const getPodiumClass = () => {
      if (index === 1) return "podium--first";
      if (index === 2) return "podium--second";
      if (index === 3) return "podium--third";
      return "";
    };
  
    return (
      <>
        <span className={`ranking-user-card__index ${getPodiumClass()}`}>{index}</span>
        <img
          src={user.profilePicture}
          alt={`Photo de profil de ${user.username}`}
          className="ranking-user-card__profile-picture"
        />
        <div className="ranking-user-card__info">
          <p id={headingId} className="ranking-user-card__name">
            {user.username}
          </p>
          <p className="ranking-user-card__score">
            <strong>Score :</strong> {user.score}
          </p>
        </div>
      </>
    );
  };
  

RankingUserPreview.propTypes = {
  user: PropTypes.shape({
    profilePicture: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
};

export default RankingUserPreview;
