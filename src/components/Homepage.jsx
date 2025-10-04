"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/homepage.css"

const Homepage = () => {
  const [userName, setUserName] = useState("")
  const [stats, setStats] = useState({
    campaigns: 0,
    peopleServed: 0,
    totalImpact: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Memoized default stats to prevent unnecessary re-renders
  const defaultStats = useMemo(() => ({
    campaigns: 247,
    peopleServed: 125000,
    totalImpact: 2850000
  }), [])

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("lastLoggedInUser")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserName(parsedUser.name || "")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        // Continue without user name if parsing fails
      }
    }

    loadUserData()
    fetchCampaignsData()
  }, [])

  // Memoized fetch function to prevent recreation on every render
  const fetchCampaignsData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const campaignsResponse = await fetch("http://localhost:5000/campaigns", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!campaignsResponse.ok) {
        throw new Error(`HTTP error! status: ${campaignsResponse.status}`)
      }

      const campaignsData = await campaignsResponse.json()

      // Validate data structure
      if (!Array.isArray(campaignsData)) {
        throw new Error("Invalid data format received")
      }

      const totalCampaigns = campaignsData.length
      const totalCollected = campaignsData.reduce(
        (sum, campaign) => {
          const amount = Number(campaign.collectedAmount) || 0
          return sum + amount
        },
        0
      )

      // Corporate-level impact calculation
      const estimatedPeopleServed = Math.round(totalCollected * 0.15) || 0

      setStats({
        campaigns: totalCampaigns,
        peopleServed: estimatedPeopleServed,
        totalImpact: totalCollected
      })

    } catch (error) {
      console.error("Error fetching campaign data:", error)
      setError(error.message)
      
      // Use default stats as fallback
      setStats(defaultStats)
    } finally {
      setIsLoading(false)
    }
  }, [defaultStats])

  // Memoized navigation handlers
  const handleExploreClick = useCallback(() => {
    navigate("/campaigns")
  }, [navigate])

  const handlePartnershipClick = useCallback(() => {
    // Scroll to process section
    const processSection = document.querySelector('.content-section.alternate')
    if (processSection) {
      processSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  // Professional number formatting for corporate metrics
  const formatNumber = useCallback((num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${Math.round(num / 1000)}K`
    }
    return num.toLocaleString()
  }, [])

  // Corporate hero title
  const heroTitle = useMemo(() => {
    return userName
      ? `Strategic philanthropy that drives measurable impact, ${userName}`
      : "Strategic philanthropy that drives measurable impact"
  }, [userName])

  // Professional process data
  const processes = useMemo(() => [
    {
      id: 1,
      icon: "📊",
      step: "01",
      title: "Strategic Assessment",
      description: "Comprehensive due diligence and impact analysis of verified humanitarian initiatives with transparent ROI metrics."
    },
    {
      id: 2,
      icon: "🤝",
      step: "02", 
      title: "Partnership Execution",
      description: "Streamlined deployment of corporate social responsibility funds through secure, enterprise-grade transaction systems."
    },
    {
      id: 3,
      icon: "📈",
      step: "03",
      title: "Impact Intelligence", 
      description: "Real-time performance analytics, comprehensive reporting, and stakeholder communication for maximum transparency."
    }
  ], [])

  // Executive testimonials data
  const testimonials = useMemo(() => [
    {
      id: 1,
      text: "Givify transformed our CSR strategy. The transparency and measurable outcomes exceeded our board's expectations. Our stakeholders now see concrete ROI from our philanthropic investments.",
      author: "Sarah Duterte",
      role: "Chief Sustainability Officer",
      company: "Fortune 500 Technology Corp",
      avatar: "SD"
    },
    {
      id: 2,
      text: "The platform's enterprise-grade reporting and due diligence capabilities align perfectly with our fiduciary responsibilities. We've scaled our impact while maintaining full accountability.",
      author: "Rodante Marcoleta", 
      role: "VP Corporate Affairs",
      company: "Global Manufacturing Ltd",
      avatar: "RM"
    }
  ], [])

  return (
    <div className="homepage-container">
      {/* Executive Hero Section */}
      <section className="hero-section" aria-label="Hero section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {heroTitle}
            </h1>
            <p className="hero-subtitle">
              Enterprise-grade philanthropic solutions with comprehensive impact tracking, 
              fiduciary-compliant processes, and institutional-level transparency for 
              corporate social responsibility excellence.
            </p>
            <div className="hero-buttons">
              <button 
                className="cta-button primary" 
                onClick={handleExploreClick}
                aria-label="View investment opportunities"
              >
                <span>View Opportunities</span>
                <span aria-hidden="true">→</span>
              </button>
              <button 
                className="cta-button secondary"
                onClick={handlePartnershipClick}
                aria-label="Learn about partnership process"
              >
                <span>Partnership Process</span>
              </button>
            </div>
          </div>

          <div 
            className={`hero-stats ${isLoading ? "loading-stats" : ""}`}
            role="region"
            aria-label="Corporate impact metrics"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <h3>{formatNumber(stats.campaigns)}+</h3>
                <p>Active Programs</p>
                <span>Verified impact initiatives</span>
              </div>
              <div className="stat-item">
                <h3>{formatNumber(stats.peopleServed)}+</h3>
                <p>Lives Transformed</p>
                <span>Measurable beneficiary impact</span>
              </div>
              <div className="stat-item">
                <h3>${formatNumber(stats.totalImpact)}</h3>
                <p>Capital Deployed</p>
                <span>Total philanthropic investment</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div 
            className="error-message" 
            role="alert"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '4px',
              padding: '1rem 1.5rem',
              marginTop: '2rem',
              color: '#fca5a5',
              fontSize: '0.875rem',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '2rem auto 0'
            }}
          >
            Live metrics temporarily unavailable. Displaying representative data.
          </div>
        )}
      </section>

      {/* Corporate Process Section */}
      <section className="content-section alternate" aria-label="Partnership process">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Partnership Framework</h2>
            <p className="section-subtitle">
              Streamlined three-phase approach for maximum corporate social impact 
              with full compliance and stakeholder transparency
            </p>
          </div>
          <div className="process-grid">
            {processes.map((process) => (
              <div key={process.id} className="process-card">
                <div className="process-icon" data-step={process.step}>
                  <span>{process.icon}</span>
                </div>
                <h3>{process.title}</h3>
                <p>{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Testimonials Section */}
      <section className="content-section executive" aria-label="Client testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Executive Endorsements</h2>
            <p className="section-subtitle">
              Trusted by industry leaders and corporate executives for strategic 
              philanthropic excellence and measurable social impact
            </p>
          </div>
          <div className="testimonials-container">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <blockquote className="testimonial-text">
                    {testimonial.text}
                  </blockquote>
                </div>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <cite>
                      <div className="testimonial-author">{testimonial.author}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                      <div className="testimonial-company">{testimonial.company}</div>
                    </cite>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage