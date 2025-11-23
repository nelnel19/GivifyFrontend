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
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': {
        icon: CheckCircle,
        color: '#059669',
        bgColor: 'rgba(5, 150, 105, 0.1)',
        borderColor: 'rgba(5, 150, 105, 0.2)',
        label: 'Completed'
      },
      'pending': {
        icon: Clock,
        color: '#d97706',
        bgColor: 'rgba(217, 119, 6, 0.1)',
        borderColor: 'rgba(217, 119, 6, 0.2)',
        label: 'Pending'
      },
      'failed': {
        icon: XCircle,
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        borderColor: 'rgba(220, 38, 38, 0.2)',
        label: 'Failed'
      },
      'cancelled': {
        icon: XCircle,
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.2)',
        label: 'Cancelled'
      }
    };

    const config = statusConfig[status?.toLowerCase()] || {
      icon: AlertCircle,
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      borderColor: 'rgba(107, 114, 128, 0.2)',
      label: status || 'Unknown'
    };

    const StatusIcon = config.icon;

    return (
      <span 
        className="status-badge"
        style={{
          background: config.bgColor,
          color: config.color,
          border: `1px solid ${config.borderColor}`
        }}
      >
        <StatusIcon size={14} />
        {config.label}
      </span>
    );
  };

  // Calculate status statistics
  const getStatusStats = () => {
    const stats = {
      completed: 0,
      pending: 0,
      failed: 0,
      cancelled: 0,
      total: donations.length
    };

    donations.forEach(donation => {
      const status = donation.status?.toLowerCase();
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  };

  const statusStats = getStatusStats();

  if (!user) {
    return (
      <div className="history-container">
        <div className="no-user-message">
          <p>Please log in to view your donation history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      {/* User Welcome Section */}
      {user && (
        <div className="user-welcome-section">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-info">
              <h3 className="user-greeting">Welcome back, {user.name}!</h3>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <div className="user-actions">
            <button className="action-btn home-button" onClick={handleHomeClick}>
              <Home size={18} />
              <span>Home</span>
            </button>
            <button className="action-btn campaigns-button" onClick={handleViewCampaigns}>
              <Target size={18} />
              <span>Campaigns</span>
            </button>
            <button className="action-btn top-donors-button" onClick={handleViewTopDonors}>
              <Trophy size={18} />
              <span>Top Donors</span>
            </button>
            <button className="action-btn logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* History Header Section */}
      <section className="history-header-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Donation History</div>
            <h1 className="section-title">
              Your Giving
              <span className="gradient-text"> Journey</span>
            </h1>
            <p className="section-subtitle">
              Track your contributions and see the impact you're making across all supported campaigns
            </p>
          </div>

          {/* History Stats */}
          <div className="history-stats">
            <div className="stats-card">
              <div className="stat-icon">
                <HistoryIcon size={24} />
              </div>
              <div className="stat-content">
                <h3>{donations.length}</h3>
                <p>Total Donations</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">
                <CreditCard size={24} />
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(donations.reduce((sum, d) => sum + d.donation_amount, 0))}</h3>
                <p>Total Contributed</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>{statusStats.completed}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section className="donations-section">
        <div className="section-container">
          {donations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <HistoryIcon size={48} />
              </div>
              <h3>No Donations Yet</h3>
              <p>Start making a difference by supporting campaigns that matter to you!</p>
              <button className="action-btn campaigns-button" onClick={handleViewCampaigns}>
                <Target size={18} />
                <span>Explore Campaigns</span>
              </button>
            </div>
          ) : (
            <div className="donations-grid">
              {donations.map((donation, index) => (
                <div className="donation-card" key={donation.id || donation._id}>
                  <div className="card-header">
                    <div className="campaign-info">
                      <h3 className="campaign-name">{donation.campaign_name}</h3>
                      {getStatusBadge(donation.status)}
                    </div>
                    <div className="donation-amount">
                      <span className="amount">{formatCurrency(donation.donation_amount)}</span>
                      <span className="donation-type">{donation.donation_type}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="donation-meta">
                      <div className="meta-item">
                        <CreditCard size={16} />
                        <span>{donation.payment_method}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(donation.donation_date)}</span>
                      </div>
                      {donation.transaction_id && (
                        <div className="meta-item">
                          <span className="transaction-id">
                            TXN: {donation.transaction_id}
                          </span>
                        </div>
                      )}
                    </div>
                    {donation.message && (
                      <div className="donation-message">
                        <p>"{donation.message}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default History;