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
    fetch("http://127.0.0.1:5000/donations/all")
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

  if (loading) {
    return (
      <div className="donations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading top donors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="donations-wrapper">
      {/* User Welcome Section - Same as Campaign */}
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
            <button className="history-button" onClick={handleViewDonationHistory}>
              <History size={18} />
              <span>Donation History</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="donations-container">
        <div className="header-section">
          <div className="header-icon">
            <Trophy className="trophy-header-icon" />
          </div>
          <h1 className="title">Top Donors Leaderboard</h1>
          <p className="subtitle">Celebrating our most generous supporters</p>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{donations.length}</span>
              <span className="stat-label">Total Donors</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                ₱{donations.reduce((sum, d) => sum + d.donation_amount, 0).toLocaleString()}
              </span>
              <span className="stat-label">Total Raised</span>
            </div>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="no-donations">
            <Award size={48} className="empty-icon" />
            <p>No donations found yet.</p>
            <p>Be the first to make a difference!</p>
          </div>
        ) : (
          <div className="donations-list">
            {donations.slice(0, 10).map((donation, index) => {
              const rank = index + 1
              return (
                <div
                  key={donation.id}
                  className={`donation-card ${getRankClass(rank)}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="rank-section">
                    {getTrophyIcon(rank)}
                    <span className="rank-number">#{rank}</span>
                  </div>

                  <div className="donation-details">
                    <h3 className="donor-name">{donation.user_name}</h3>
                    <p className="campaign-name">
                      <span className="campaign-label">Campaign:</span>
                      <span className="campaign-value">{donation.campaign_name}</span>
                    </p>
                  </div>

                  <div className="donation-amount">
                    <span className="currency">₱</span>
                    <span className="amount">{donation.donation_amount.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Donations