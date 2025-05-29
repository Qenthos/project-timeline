import PropTypes from "prop-types";
import UserPreview from "./UserPreview";
import { useState } from "react";
import "./ListUsers.scss";

const ListUsers = ({ users, editable = false, onEdit = () => {} }) => {
    console.log(users)
  return (
    <>
      <ul className="list__users">
        {users.map((user) => (
          <li key={user.id}>
            <UserPreview
              user={user}
              editable={editable}
              onEdit={onEdit}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

ListUsers.propTypes = {
  users: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ListUsers;
