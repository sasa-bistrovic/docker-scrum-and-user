import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [user2, setUser2] = useState({ id: null, username: '', email: '', password: '' });

  useEffect(() => {
    axios.get('/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  }, []);

  const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
  };

  const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
  };

  const handleAddUser = newUser => {
    const usernameToFind = newUser.username;
    const foundUser1 = findUserByUsername(usernameToFind);

    const emailToFind = newUser.email;
    const foundUser2 = findUserByEmail(emailToFind);

    if (newUser.username.trim()==="" || newUser.email.trim()==="" || newUser.password.trim()==="" || foundUser1 || foundUser2) {
    resetUserForm();
    } else {
    axios.post('/api/users', newUser)
      .then(response => {
        console.log('User added successfully', response);
        setUsers([...users, response.data]);
        resetUserForm();
      })
      .catch(error => console.error('Error adding user', error));
     }
  };

  const handleEditUser = editedUser => {
    const usernameToFind = editedUser.username;
    const foundUser1 = findUserByUsername(usernameToFind);

    const emailToFind = editedUser.email;
    const foundUser2 = findUserByEmail(emailToFind);

    if (editedUser.username.trim()==="" || editedUser.email.trim()==="" || editedUser.password.trim()==="" || (foundUser1 && !foundUser2) || (!foundUser1 && foundUser2) || (!foundUser1 && !foundUser2)) {
    resetUserForm();
    } else {
    axios.put(`/api/users/${editedUser.id}`, editedUser)
      .then(response => {
        console.log('User updated successfully', response);
        setUsers(users.map(user => (user.id === response.data.id ? response.data : user)));
        resetUserForm();
      })
      .catch(error => console.error('Error updating user', error));
    }
  };

  const handleEditUser2 = editedUser => {
    setUser2({
      id: editedUser.id,
      username: editedUser.username,
      email: editedUser.email,
      password: editedUser.password
    });
    setIsEdit(true);
  };

  const handleDeleteUser = userId => {
    axios.delete(`/api/users/${userId}`)
      .then(response => {
        console.log('User deleted successfully', response);
        setUsers(users.filter(user => user.id !== userId));
        resetUserForm();
      })
      .catch(error => console.error('Error deleting user', error));
  };

  const handleChange = e => {
    setUser2({ ...user2, [e.target.name]: e.target.value });
  };

  const handleAddButtonClick = () => {
    resetUserForm();
  };

  const resetUserForm = () => {
    setUser2({
      id: null,
      username: '',
      email: '',
      password: ''
    });
    setIsEdit(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (isEdit) {
      handleEditUser(user2);
    } else {
      handleAddUser(user2);
    }
  };


return (
  <div className="w3-content w3-margin-top" style={{ maxWidth: '1400px' }}>
    <div className="w3-row-padding">
      <div className="w3-third">
        <div className="w3-white w3-text-grey w3-card-4">
          <div className="w3-display-container">
          <div className="w3-container">
                <div>
    <h2 className="w3-text-grey w3-padding-16"><i className="fa fa-list fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>User List</h2>
      <p>
        <button className="fa fa-plus-circle w3-margin-right w3-large w3-text-teal" type="button" onClick={handleAddButtonClick}>
          Add
        </button>
      </p>
      {users.map(user => (
        <p key={user.id}>
          <p><i className="fa fa-circle fa-fw w3-margin-right w3-large w3-text-teal"></i>{user.username}</p>
          <p>
          <button className="fa fa-pencil-square-o w3-margin-right w3-large w3-text-teal" onClick={() => handleEditUser2(user)}>   Edit</button>
          <button className="fa fa-cut w3-margin-right w3-large w3-text-teal" onClick={() => handleDeleteUser(user.id)}>   Delete</button>
          </p>
        </p>
      ))}
  </div>
          </div>
        </div>
      </div>
    </div>
    {isEdit ? (
      <div className="w3-twothird">
        <div className="w3-container w3-card w3-white w3-margin-bottom">
          <h2 class="w3-text-grey w3-padding-16"><i class="fa fa-pencil-square-o fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>Edit User</h2>
              <form onSubmit={handleSubmit}>
      <label>
        <p><i class="fa fa-user fa-fw w3-margin-right w3-large w3-text-teal"></i>Username</p>
        <p><input type="text" name="username" value={user2.username} onChange={handleChange} /></p>
      </label>
      <label>
        <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>Email</p>
        <p><input type="text" name="email" value={user2.email} onChange={handleChange} /></p>
      </label>
      <label>
        <p><i class="fa fa-code fa-fw w3-margin-right w3-large w3-text-teal"></i>Password</p>
        <input type="password" name="password" value={user2.password} onChange={handleChange} />
      </label>
      {isEdit ? <p><button class="fa fa-pencil-square-o w3-large w3-text-teal" type="submit">     Edit</button></p>
      : <p><button class="fa fa-plus-circle w3-large w3-text-teal" type="submit">     Add</button></p>}
    </form>
        </div>
      </div>
    ) : (
      <div className="w3-twothird">
        <div className="w3-container w3-card w3-white w3-margin-bottom">
          <h2 class="w3-text-grey w3-padding-16"><i class="fa fa-plus-circle fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>Add User</h2>
              <form onSubmit={handleSubmit}>
      <label>
        <p><i class="fa fa-user fa-fw w3-margin-right w3-large w3-text-teal"></i>Username</p>
        <p><input type="text" name="username" value={user2.username} onChange={handleChange} /></p>
      </label>
      <label>
        <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>Email</p>
        <p><input type="text" name="email" value={user2.email} onChange={handleChange} /></p>
      </label>
      <label>
        <p><i class="fa fa-code fa-fw w3-margin-right w3-large w3-text-teal"></i>Password</p>
        <input type="password" name="password" value={user2.password} onChange={handleChange} />
      </label>
      {isEdit ? <p><button class="fa fa-pencil-square-o w3-large w3-text-teal" type="submit">     Edit</button></p>
      : <p><button class="fa fa-plus-circle w3-large w3-text-teal" type="submit">     Add</button></p>}
    </form>
        </div>
      </div>
    )}
      </div>
    </div>

);

};

export default UserManagement;
