import React, { useEffect, useState } from "react";
import {
  User,
  Home,
  LogOut,
  Target,
  Trophy,
  History as HistoryIcon,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/history.css";

const History = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("lastLoggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);

      // Fetch donation history for the logged-in user
      fetch(`https://givifybackend.onrender.com/donations/${loggedInUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          // Sort by date, most recent first
          const sortedDonations = data.sort(
            (a, b) => new Date(b.donation_date) - new Date(a.donation_date)
          );
          setDonations(sortedDonations);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching donation history:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleHomeClick = () => {
    navigate("/homepage");
  };

  const handleLogout = () => {
    localStorage.removeItem("lastLoggedInUser");
    navigate("/");
  };

  const handleViewCampaigns = () => {
    navigate("/campaigns");
  };

  const handleViewTopDonors = () => {
    navigate("/donations");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="history-wrapper">
        <div className="history-container">
          <div className="no-user-message">
            <p>Please log in to view your donation history.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="history-wrapper">
        <div className="history-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your donation history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-wrapper">
      {/* User Welcome Section */}
      {user && (
        <div className="user-welcome-section">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-info">
            <h3 className="user-greeting">Welcome back, {user.name}</h3>
            <p className="user-email">{user.email}</p>
          </div>
          <div className="user-actions">
            <button className="home-button" onClick={handleHomeClick}>
              <Home size={18} />
              <span>Home</span>
            </button>
            <button className="campaigns-button" onClick={handleViewCampaigns}>
              <Target size={18} />
              <span>Campaigns</span>
            </button>
            <button className="top-donors-button" onClick={handleViewTopDonors}>
              <Trophy size={18} />
              <span>Top Donors</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="history-container">
        <div className="header-section">
          <div className="header-icon">
            <HistoryIcon className="history-header-icon" />
          </div>
          <h1 className="title">My Donation History</h1>
          <p className="subtitle">
            Tracking your contributions to make the world a better place
          </p>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{donations.length}</span>
              <span className="stat-label">Total Donations</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                ₱
                {donations
                  .reduce((sum, d) => sum + d.donation_amount, 0)
                  .toLocaleString()}
              </span>
              <span className="stat-label">Total Contributed</span>
            </div>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="no-donations">
            <HistoryIcon size={48} className="empty-icon" />
            <p>You haven't made any donations yet.</p>
            <p>Start making a difference today!</p>
          </div>
        ) : (
          <div className="donations-list">
            {donations.map((donation, index) => (
              <div
                key={donation.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="campaign-info">
                  <h3 className="campaign-name">{donation.campaign_name}</h3>
                  <div className="donation-meta">
                    <div className="meta-item">
                      <CreditCard size={16} />
                      <span>{donation.payment_method}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(donation.donation_date)}</span>
                    </div>
                  </div>
                  {donation.message && (
                    <div className="donation-message">
                      <p>"{donation.message}"</p>
                    </div>
                  )}
                </div>

                <div className="donation-amount-section">
                  <div className="donation-amount">
                    <span className="currency">₱</span>
                    <span className="amount">
                      {donation.donation_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="donation-type">
                    <span className="type-badge">{donation.donation_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
