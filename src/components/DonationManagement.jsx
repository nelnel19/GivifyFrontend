import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/donationmanagement.css";

// Monochrome Icons as React Components
const DonationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
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

  // Filter donations by status
  const filteredDonations = donations.filter(donation => {
    if (filterStatus === "all") return true;
    return donation.status === filterStatus;
  });

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "donated":
        return "status-donated";
      case "on-hold":
        return "status-on-hold";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-completed";
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "donated":
        return "Donated";
      case "on-hold":
        return "On Hold";
      case "cancelled":
        return "Cancelled";
      default:
        return "Completed";
    }
  };

  return (
    <div className="donation-container">
      {/* Modern Navigation Header - Same as Users and Campaigns */}
      <nav className="admin-navigation">
        <div className="nav-brand">
          <DonationIcon />
          <h2>Admin Dashboard</h2>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/Users")}>
            <UserIcon />
            Users
          </button>
          <button className="nav-btn" onClick={() => navigate("/campaignmanagement")}>
            <CampaignIcon />
            Campaigns
          </button>
          <button className="nav-btn active">
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
      <div className="donation-content">
        <div className="content-header">
          <h1>Donation Management</h1>
          <p>Manage and track all donation transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon total">
              <DonationIcon />
            </div>
            <div className="stat-info">
              <h3>{donations.length}</h3>
              <p>Total Donations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>{donations.filter(d => d.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>{donations.filter(d => d.status === 'on-hold').length}</h3>
              <p>On Hold</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amount">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>${donations.reduce((sum, d) => sum + parseFloat(d.donation_amount || 0), 0).toLocaleString()}</h3>
              <p>Total Amount</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <FilterIcon />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Donations</option>
              <option value="completed">Completed</option>
              <option value="donated">Donated</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="summary">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
        </div>

        {/* Donations Table */}
        <div className="table-container">
          <table className="donation-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      <div className="donor-info">
                        <div className="donor-name">{donation.user_name}</div>
                        <div className="donor-email">{donation.user_email || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <div className="campaign-info">
                        <div className="campaign-name">{donation.campaign_name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="amount">
                        ${parseFloat(donation.donation_amount).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="payment-method">
                        <PaymentIcon />
                        <span>{donation.payment_method}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <CalendarIcon />
                        <span>{new Date(donation.donation_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-section">
                        <span className={`status-badge ${getStatusClass(donation.status || "completed")}`}>
                          {getStatusText(donation.status || "completed")}
                        </span>
                        <select
                          value={donation.status || "completed"}
                          onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="completed">Completed</option>
                          <option value="donated">Donated</option>
                          <option value="on-hold">On Hold</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-donations">
                    <div className="empty-state">
                      <DonationIcon />
                      <p>No donations found</p>
                      {filterStatus !== "all" && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setFilterStatus("all")}
                        >
                          Show All Donations
                        </button>
                      )}
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

export default DonationManagement;