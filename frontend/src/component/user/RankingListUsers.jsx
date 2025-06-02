import PropTypes from "prop-types";
import RankingUserPreview from "./RankingUserPreview";
import "./RankingListUsers.scss";

const RankingListUsers = ({ users }) => {
  return (
    <>
      <ul className="ranking-list__users">
        {[...users]
          .sort((a, b) => b.score - a.score)
          .map((user, index) => (
            <li className="ranking-list__item" key={user.id}>
              <RankingUserPreview user={user} index={index + 1}/>
            </li>
          ))}
      </ul>
    </>
  );
};

RankingListUsers.propTypes = {
  users: PropTypes.array.isRequired,
};

export default RankingListUsers;
