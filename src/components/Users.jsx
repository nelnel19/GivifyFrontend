import React, { useEffect, useState } from "react";
import "../styles/users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, age: user.age });
  };

  // Update user
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchUsers();
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Disable user
  const handleDisable = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/auth/users/${id}/disable`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Error disabling user:", err);
    }
  };

  // Enable user
  const handleEnable = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/auth/users/${id}/enable`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Error enabling user:", err);
    }
  };

  return (
    <div className="users-container">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className={user.disabled ? "row-disabled" : "row-active"}>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  ) : (
                    user.age ?? "Unknown"
                  )}
                </td>
                <td>
                  <span className={user.disabled ? "status disabled" : "status active"}>
                    {user.disabled ? "Disabled" : "Active"}
                  </span>
                </td>
                <td>
                  {editingUser === user._id ? (
                    <button className="btn save" onClick={() => handleUpdate(user._id)}>
                      Save
                    </button>
                  ) : (
                    <button className="btn edit" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                  )}
                  {user.disabled ? (
                    <button className="btn enable" onClick={() => handleEnable(user._id)}>
                      Enable
                    </button>
                  ) : (
                    <button className="btn disable" onClick={() => handleDisable(user._id)}>
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
