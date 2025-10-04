"use client"

import { useState, useEffect } from "react"
import { Heart, Target, Users, TrendingUp, User, Home, X, LogOut, Trophy, History } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styles/campaign.css"

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([])
  const [user, setUser] = useState(null)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Donation Form State
  const [donationData, setDonationData] = useState({
    // Payment Method Section
    payment_method: "Credit Card",
    card_number: "",
    expiry_date: "",
    cvv: "",
    billing_address: "",

    // Donation Details Section
    donation_amount: "",
    donation_type: "One-time",
    message: "",

    // Verification Section
    age_requirement_accepted: false,
    identity_verified: false,
    privacy_policy_accepted: false,
  })

  useEffect(() => {
    fetch("https://givifybackend.onrender.com/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error))

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

  const handleViewTopDonors = () => {
    navigate("/donations")
  }

  const handleViewDonationHistory = () => {
    navigate("/history")
  }

  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign)
    setDonationData((prev) => ({
      ...prev,
      donation_amount: "",
      message: "",
    }))
    setShowDonationModal(true)
  }

  const handleCloseModal = () => {
    setShowDonationModal(false)
    setSelectedCampaign(null)
    setIsSubmitting(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setDonationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmitDonation = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("Please log in to make a donation")
      return
    }

    if (!donationData.age_requirement_accepted) {
      alert("You must be 18+ to make a donation")
      return
    }

    if (!donationData.privacy_policy_accepted) {
      alert("You must accept the privacy policy")
      return
    }

    setIsSubmitting(true)

    try {
      const donationPayload = {
        ...donationData,
        user_email: user.email,
        user_name: user.name,
        campaign_id: selectedCampaign.id,
        campaign_name: selectedCampaign.title,
        donation_amount: Number.parseFloat(donationData.donation_amount),
      }

      const response = await fetch("https://givifybackend.onrender.com/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationPayload),
      })

      if (response.ok) {
        alert("Donation successful! Thank you for your generosity.")
        handleCloseModal()
        // Refresh campaigns to update progress
        const campaignsResponse = await fetch("https://givifybackend.onrender.com/campaigns")
        const campaignsData = await campaignsResponse.json()
        setCampaigns(campaignsData)
      } else {
        const errorData = await response.json()
        alert(`Donation failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      alert("An error occurred while processing your donation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateProgress = (goal, collected) => {
    return Math.min((collected / goal) * 100, 100)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="campaign-wrapper">
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
            <button className="top-donors-button" onClick={handleViewTopDonors}>
              <Trophy size={18} />
              <span>Top Donors</span>
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

      <div className="campaign-header">
        <div className="header-icon">
          <Heart className="heart-icon" />
        </div>
        <h1 className="campaign-title">Active Campaigns</h1>
        <p className="campaign-subtitle">Join our mission to make a meaningful difference in the world</p>
      </div>

      <div className="campaign-list">
        {campaigns.map((campaign) => {
          const progress = calculateProgress(campaign.goalAmount, campaign.collectedAmount)
          const remainingAmount = campaign.goalAmount - campaign.collectedAmount

          return (
            <div className="campaign-card" key={campaign.id}>
              <div className="campaign-image-container">
                <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} className="campaign-image" />
                <div className="image-overlay"></div>
                <div className="campaign-badge">
                  <Target size={16} />
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>

              <div className="campaign-details">
                <h2 className="campaign-card-title">{campaign.title}</h2>
                <p className="campaign-description">{campaign.description}</p>

                <div className="campaign-progress">
                  <div className="progress-header">
                    <div className="progress-stats">
                      <div className="stat-item">
                        <TrendingUp size={16} />
                        <span className="stat-label">Raised</span>
                        <span className="stat-value">{formatCurrency(campaign.collectedAmount)}</span>
                      </div>
                      <div className="stat-item">
                        <Target size={16} />
                        <span className="stat-label">Goal</span>
                        <span className="stat-value">{formatCurrency(campaign.goalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}>
                      <div className="progress-shine"></div>
                    </div>
                  </div>

                  <div className="progress-footer">
                    <span className="progress-percentage">{Math.round(progress)}% funded</span>
                    <span className="remaining-amount">
                      {remainingAmount > 0 ? `${formatCurrency(remainingAmount)} to go` : "Goal reached!"}
                    </span>
                  </div>
                </div>

                <button className="donate-button" onClick={() => handleDonateClick(campaign)}>
                  <Heart size={18} />
                  <span>Donate Now</span>
                  <div className="button-shine"></div>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="modal-overlay">
          <div className="donation-modal">
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>Complete Your Donation</h2>
                <div className="campaign-reference">
                  <span className="campaign-label">Supporting:</span>
                  <span className="campaign-name">{selectedCampaign.title}</span>
                </div>
              </div>
              <button className="close-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDonation} className="donation-form">
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">01</div>
                  <div className="section-info">
                    <h3>Payment Information</h3>
                    <p className="section-description">Secure payment processing</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      name="payment_method"
                      value={donationData.payment_method}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="GCash">GCash</option>
                      <option value="Maya">Maya</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Card Number / e-Wallet ID</label>
                    <input
                      type="text"
                      name="card_number"
                      value={donationData.card_number}
                      onChange={handleInputChange}
                      placeholder="Enter card number or e-wallet ID"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="month"
                        name="expiry_date"
                        value={donationData.expiry_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV Code</label>
                      <input
                        type="text"
                        name="cvv"
                        value={donationData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Billing Address <span className="optional">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="billing_address"
                      value={donationData.billing_address}
                      onChange={handleInputChange}
                      placeholder="Enter billing address"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">02</div>
                  <div className="section-info">
                    <h3>Donation Details</h3>
                    <p className="section-description">Customize your contribution</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group amount-group">
                    <label>Donation Amount</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">₱</span>
                      <input
                        type="number"
                        name="donation_amount"
                        value={donationData.donation_amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Donation Type</label>
                    <select name="donation_type" value={donationData.donation_type} onChange={handleInputChange}>
                      <option value="One-time">One-time</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>
                      Personal Message <span className="optional">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={donationData.message}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts or motivation for this donation..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">03</div>
                  <div className="section-info">
                    <h3>Verification & Agreement</h3>
                    <p className="section-description">Legal requirements and terms</p>
                  </div>
                </div>

                <div className="checkbox-container">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="age_requirement_accepted"
                        checked={donationData.age_requirement_accepted}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">
                        <strong>Age Verification:</strong> I confirm that I am 18 years of age or older
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="identity_verified"
                        checked={donationData.identity_verified}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">
                        <strong>Identity Verification:</strong> I agree to KYC verification (optional but recommended)
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="privacy_policy_accepted"
                        checked={donationData.privacy_policy_accepted}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">
                        <strong>Terms & Privacy:</strong> I agree to the Privacy Policy and Terms of Service
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  <span className="button-text">
                    {isSubmitting
                      ? "Processing..."
                      : `Donate ${donationData.donation_amount ? formatCurrency(Number.parseFloat(donationData.donation_amount)) : ""}`}
                  </span>
                  {!isSubmitting && <div className="button-glow"></div>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {campaigns.length === 0 && (
        <div className="empty-state">
          <Users size={48} />
          <h3>No Active Campaigns</h3>
          <p>Check back soon for new opportunities to make a difference!</p>
        </div>
      )}
    </div>
  )
}

export default Campaign