import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/campaignmanagement.css";

// Monochrome Icons as React Components
const CampaignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
    <path d="M12 6v12" />
    <path d="M17 7l-10 10" />
    <path d="M7 7l10 10" />
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

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("https://givifybackend.onrender.com/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", goalAmount: "", image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingId(campaign.id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      image: null,
    });
    setImagePreview(campaign.image || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", description: "", goalAmount: "", image: null });
    setImagePreview(null);
    // Clean up preview URL
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.goalAmount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("goalAmount", formData.goalAmount);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch("https://givifybackend.onrender.com/campaigns", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        await fetchCampaigns();
        closeModal();
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.description || !formData.goalAmount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("goalAmount", formData.goalAmount);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch(`https://givifybackend.onrender.com/campaigns/${editingId}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        await fetchCampaigns();
        closeModal();
      }
    } catch (err) {
      console.error("Error updating campaign:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`https://givifybackend.onrender.com/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCampaigns();
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastLoggedInUser");
    navigate("/login");
  };

  return (
    <div className="campaign-container">
      {/* Modern Navigation Header */}
      <nav className="admin-navigation">
        <div className="nav-brand">
          <CampaignIcon />
          <h2>Admin Dashboard</h2>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/Users")}>
            <UserIcon />
            Users
          </button>
          <button className="nav-btn active">
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
      <div className="campaign-content">
        <div className="content-header">
          <h1>Campaign Management</h1>
          <p>Create and manage fundraising campaigns</p>
          <button className="btn btn-primary create-btn" onClick={openCreateModal}>
            <AddIcon />
            Create New Campaign
          </button>
        </div>

        {/* Campaigns List */}
        <div className="table-container">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Goal</th>
                <th>Collected</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>
                      <div className="campaign-image-container">
                        {campaign.image ? (
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="campaign-img"
                          />
                        ) : (
                          <div className="image-placeholder">
                            <ImageIcon />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="campaign-title">{campaign.title}</div>
                    </td>
                    <td>
                      <div className="campaign-description">
                        {campaign.description}
                      </div>
                    </td>
                    <td>
                      <div className="amount">${parseInt(campaign.goalAmount).toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="amount collected">
                        ${parseInt(campaign.collectedAmount || 0).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${Math.min(100, ((campaign.collectedAmount || 0) / campaign.goalAmount) * 100)}%`
                          }}
                        ></div>
                        <span className="progress-text">
                          {Math.min(100, Math.round(((campaign.collectedAmount || 0) / campaign.goalAmount) * 100))}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => openEditModal(campaign)}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button 
                          className="btn btn-warning" 
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-campaigns">
                    <div className="empty-state">
                      <CampaignIcon />
                      <p>No campaigns found</p>
                      <button className="btn btn-primary" onClick={openCreateModal}>
                        <AddIcon />
                        Create Your First Campaign
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Campaign" : "Create New Campaign"}</h2>
              <button className="close-btn" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-form">
                <div className="form-section">
                  <h3>Campaign Details</h3>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter campaign title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      placeholder="Enter campaign description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-input"
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Goal Amount ($) *</label>
                    <input
                      type="number"
                      name="goalAmount"
                      placeholder="Enter target amount"
                      value={formData.goalAmount}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>Campaign Image</h3>
                  <div className="image-upload-section">
                    <div className="image-preview-container">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <ImageIcon />
                          <p>Upload campaign image</p>
                          <span>Recommended: 800x600px or larger</span>
                        </div>
                      )}
                    </div>
                    <div className="file-input-wrapper">
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="file-input" className="file-input-label">
                        <ImageIcon />
                        Choose Image
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              {editingId ? (
                <button className="btn btn-primary" onClick={handleUpdate}>
                  <SaveIcon />
                  Update Campaign
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleCreate}>
                  <AddIcon />
                  Create Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;