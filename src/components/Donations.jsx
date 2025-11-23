"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award, Star, Crown, User, Home, LogOut, Target, History } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styles/donations.css"

const Donations = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://givifybackend.onrender.com/donations")
      .then((res) => res.json())
      .then((data) => {
        const sortedDonations = data.sort((a, b) => b.donation_amount - a.donation_amount)
        setDonations(sortedDonations)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching donations:", err)
        setLoading(false)
      })

    const storedUser = localStorage.getItem("lastLoggedInUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleHomeClick = () => {
    navigate("/homepage")
  }

  const handleLogout = () => {
    localStorage.removeItem("lastLoggedInUser")
    navigate("/")
  }

  const handleViewCampaigns = () => {
    navigate("/campaigns")
  }

  const handleViewDonationHistory = () => {
    navigate("/history")
  }

  const getTrophyIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="trophy-icon gold" size={28} />
      case 2:
        return <Trophy className="trophy-icon silver" size={26} />
      case 3:
        return <Medal className="trophy-icon bronze" size={24} />
      case 4:
      case 5:
      case 6:
        return <Award className="trophy-icon platinum" size={22} />
      default:
        return <Star className="trophy-icon standard" size={20} />
    }
  }

  const getRankClass = (rank) => {
    if (rank <= 3) return "top-three"
    if (rank <= 6) return "top-six"
    return "top-ten"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="donations-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading top donors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="donations-wrapper">
      {/* User Welcome Section - Same as History */}
      {user && (
        <div className="user-welcome-section">
          <div className="section-container">
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
              <button className="action-btn history-button" onClick={handleViewDonationHistory}>
                <History size={18} />
                <span>History</span>
              </button>
              <button className="action-btn logout-button" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donations Header Section - Matching History */}
      <section className="donations-header-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Top Donors</div>
            <h1 className="section-title">
              Generosity
              <span className="gradient-text"> Leaderboard</span>
            </h1>
            <p className="section-subtitle">
              Celebrating our most dedicated supporters and their incredible contributions to meaningful causes
            </p>
          </div>

          {/* Donations Stats - Matching History */}
          <div className="donations-stats">
            <div className="stats-card">
              <div className="stat-icon">
                <Trophy size={24} />
              </div>
              <div className="stat-content">
                <h3>{donations.length}</h3>
                <p>Total Donors</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(donations.reduce((sum, d) => sum + d.donation_amount, 0))}</h3>
                <p>Total Raised</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">
                <Crown size={24} />
              </div>
              <div className="stat-content">
                <h3>{Math.min(donations.length, 10)}+</h3>
                <p>Top Supporters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donations Section - Matching History */}
      <section className="donations-section">
        <div className="section-container">
          {donations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Trophy size={48} />
              </div>
              <h3>No Donations Yet</h3>
              <p>Be the first to make a difference and appear on our leaderboard!</p>
              <button className="action-btn campaigns-button" onClick={handleViewCampaigns}>
                <Target size={18} />
                <span>Start Donating</span>
              </button>
            </div>
          ) : (
            <div className="donations-grid">
              {donations.slice(0, 10).map((donation, index) => {
                const rank = index + 1
                return (
                  <div
                    key={donation.id || donation._id}
                    className={`donation-card ${getRankClass(rank)}`}
                  >
                    <div className="rank-section">
                      {getTrophyIcon(rank)}
                      <span className="rank-number">#{rank}</span>
                    </div>

                    <div className="donation-info">
                      <h3 className="donor-name">{donation.user_name}</h3>
                      <div className="donation-meta">
                        <div className="meta-item">
                          <Target size={16} />
                          <span>{donation.campaign_name}</span>
                        </div>
                        <div className="meta-item">
                          <Award size={16} />
                          <span>{formatCurrency(donation.donation_amount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="donation-amount">
                      <span className="amount">{formatCurrency(donation.donation_amount)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Donations