import React, { useEffect, useState } from "react";
import "../styles/campaignmanagement.css";

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    image: null, // now stores a File object
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle input change (text/number)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Create campaign
  const handleCreate = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("goalAmount", formData.goalAmount);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch("http://127.0.0.1:5000/campaigns", {
        method: "POST",
        body: data, // send as multipart/form-data
      });

      if (res.ok) {
        await fetchCampaigns();
        setFormData({ title: "", description: "", goalAmount: "", image: null });
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  // Start editing
  const handleEdit = (campaign) => {
    setEditingId(campaign.id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      image: null, // reset, user must upload new file if updating image
    });
  };

  // Update campaign
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("goalAmount", formData.goalAmount);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch(`http://127.0.0.1:5000/campaigns/${editingId}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        await fetchCampaigns();
        setEditingId(null);
        setFormData({ title: "", description: "", goalAmount: "", image: null });
      }
    } catch (err) {
      console.error("Error updating campaign:", err);
    }
  };

  // Delete campaign
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCampaigns();
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  return (
    <div className="campaign-container">
      <h2>Campaign Management</h2>

      {/* Form */}
      <div className="campaign-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="goalAmount"
          placeholder="Goal Amount"
          value={formData.goalAmount}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {editingId ? (
          <button className="btn save" onClick={handleUpdate}>
            Update Campaign
          </button>
        ) : (
          <button className="btn create" onClick={handleCreate}>
            Create Campaign
          </button>
        )}
      </div>

      {/* Campaigns List */}
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Goal</th>
            <th>Collected</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>
                  {campaign.image && (
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="campaign-img"
                    />
                  )}
                </td>
                <td>{campaign.title}</td>
                <td>{campaign.description}</td>
                <td>${campaign.goalAmount}</td>
                <td>${campaign.collectedAmount}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(campaign)}>
                    Edit
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(campaign.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No campaigns found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignManagement;
