import PropTypes from "prop-types";
import "./RankingUserPreview.scss";
import { observer } from "mobx-react-lite";

const RankingUserPreview = observer(({ user, index }) => {
  const headingId = `user-title-${user.id}`;

  const getPodiumClass = () => {
    if (index === 1) return "podium--first";
    if (index === 2) return "podium--second";
    if (index === 3) return "podium--third";
    return "";
  };

  return (
    <>
      <span className={`ranking-user-card__index ${getPodiumClass()}`}>
        {index}
      </span>
      <img
        src={user.pfpUrl}
        alt={`Photo de profil de ${user.username}`}
        className="ranking-user-card__profile-picture"
      />

      <ul className="ranking-user-card__info">
        <li className="ranking-user-card__info-item">
          <p id={headingId} className="ranking-user-card__name">
            {user.username}
          </p>
        </li>
        <li>
          <p className="ranking-user-card__elo">
            <strong>Elo : {user.elo}</strong>
          </p>
        </li>
        <li className="ranking-user-card__info-data">
          <p className="ranking-user-card__score">
            <strong>Score : {user.score}</strong>
          </p>
          <p className="ranking-user-card__score">
            <strong>
              Partie{user.played_games === 1 ? "" : "s"} jouée
              {user.played_games === 1 ? "" : "s"} : {user.played_games}
            </strong>
          </p>
        </li>
      </ul>
    </>
  );
});

RankingUserPreview.propTypes = {
  user: PropTypes.shape({
    pfp: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
};

export default RankingUserPreview;
