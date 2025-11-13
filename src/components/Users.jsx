import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/users.css";

// Monochrome Icons as React Components
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const EnableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DisableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CampaignIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
    <path d="M12 6v12" />
    <path d="M17 7l-10 10" />
    <path d="M7 7l10 10" />
  </svg>
);

const DonationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://givifybackend.onrender.com/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, age: user.age });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`https://givifybackend.onrender.com/api/auth/users/${id}`, {
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

  const handleDisable = async (id) => {
    try {
      const res = await fetch(`https://givifybackend.onrender.com/api/auth/users/${id}/disable`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Error disabling user:", err);
    }
  };

  const handleEnable = async (id) => {
    try {
      const res = await fetch(`https://givifybackend.onrender.com/api/auth/users/${id}/enable`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Error enabling user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastLoggedInUser");
    navigate("/login");
  };

  return (
    <div className="users-container">
      {/* Modern Navigation Header */}
      <nav className="admin-navigation">
        <div className="nav-brand">
          <UserIcon />
          <h2>Admin Dashboard</h2>
        </div>
        <div className="nav-links">
          <button className="nav-btn active">
            <UserIcon />
            Users
          </button>
          <button className="nav-btn" onClick={() => navigate("/campaignmanagement")}>
            <CampaignIcon />
            Campaigns
          </button>
          <button className="nav-btn" onClick={() => navigate("/donationmanagement")}>
            <DonationIcon />
            Donations
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="users-content">
        <div className="content-header">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>

        <div className="table-container">
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
                  <tr key={user._id} className={user.disabled ? "row-disabled" : ""}>
                    <td>
                      {editingUser === user._id ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      ) : (
                        <div className="user-name">
                          {user.name}
                        </div>
                      )}
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="edit-input"
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
                          className="edit-input"
                        />
                      ) : (
                        user.age ?? "—"
                      )}
                    </td>
                    <td>
                      <span className={`status ${user.disabled ? "disabled" : "active"}`}>
                        {user.disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingUser === user._id ? (
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleUpdate(user._id)}
                          >
                            <SaveIcon />
                            Save
                          </button>
                        ) : (
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => handleEdit(user)}
                          >
                            <EditIcon />
                            Edit
                          </button>
                        )}
                        {user.disabled ? (
                          <button 
                            className="btn btn-success" 
                            onClick={() => handleEnable(user._id)}
                          >
                            <EnableIcon />
                            Enable
                          </button>
                        ) : (
                          <button 
                            className="btn btn-warning" 
                            onClick={() => handleDisable(user._id)}
                          >
                            <DisableIcon />
                            Disable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-users">
                    <div className="empty-state">
                      <UserIcon />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;