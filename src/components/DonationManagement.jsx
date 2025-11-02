import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/donationmanagement.css";

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const res = await fetch("https://givifybackend.onrender.com/donations");
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Update donation status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`https://givifybackend.onrender.com/donations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchDonations(); // refresh list
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastLoggedInUser");
    navigate("/login");
  };

  // Navigate to campaigns
  const handleCampaigns = () => {
    navigate("/campaignmanagement");
  };

  // Navigate to users
  const handleUsers = () => {
    navigate("/Users");
  };

  return (
    <div className="donation-container">
      {/* Navigation Header */}
      <div className="admin-navigation">
        <div className="nav-brand">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={handleUsers}>
            Users
          </button>
          <button className="nav-btn" onClick={handleCampaigns}>
            Campaigns
          </button>
          <button className="nav-btn active" onClick={() => navigate("/donationmanagement")}>
            Donations
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="donation-content">
        <h2>Donation Management</h2>

        <table className="donation-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Campaign</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.user_name}</td>
                  <td>{donation.campaign_name}</td>
                  <td>${donation.donation_amount}</td>
                  <td>{donation.payment_method}</td>
                  <td>{new Date(donation.donation_date).toLocaleString()}</td>
                  <td>
                    <select
                      value={donation.status || "completed"}
                      onChange={(e) =>
                        handleStatusChange(donation.id, e.target.value)
                      }
                    >
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="donated">Donated</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No donations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationManagement;