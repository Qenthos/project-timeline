import PropTypes from "prop-types";
import UserPreview from "./UserPreview";
import { observer } from "mobx-react-lite";
import "./ListUsers.scss";

const ListUsers = observer(({ users, editable = false, onEdit = () => {} }) => {
  return (
    <>
      <ul className="list__users">
        {[...users]
          .sort((a, b) => b.score - a.score)
          .map((user) => (
            <li key={user.id}>
              <UserPreview user={user} editable={editable} onEdit={onEdit} />
            </li>
          ))}
      </ul>
    </>
  );
});

ListUsers.propTypes = {
  users: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ListUsers;
