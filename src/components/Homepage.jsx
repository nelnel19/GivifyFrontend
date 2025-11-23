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
  const [isVisible, setIsVisible] = useState({})
  const navigate = useNavigate()

  const defaultStats = useMemo(() => ({
    campaigns: 247,
    peopleServed: 125000,
    totalImpact: 2850000
  }), [])

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
      }
    }

    loadUserData()
    fetchCampaignsData()
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const fetchCampaignsData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const campaignsResponse = await fetch("https://givifybackend.onrender.com/campaigns", {
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

      const estimatedPeopleServed = Math.round(totalCollected * 0.15) || 0

      setStats({
        campaigns: totalCampaigns,
        peopleServed: estimatedPeopleServed,
        totalImpact: totalCollected
      })

    } catch (error) {
      console.error("Error fetching campaign data:", error)
      setError(error.message)
      setStats(defaultStats)
    } finally {
      setIsLoading(false)
    }
  }, [defaultStats])

  const handleExploreClick = useCallback(() => {
    navigate("/campaigns")
  }, [navigate])

  const handlePartnershipClick = useCallback(() => {
    const processSection = document.querySelector('.process-section')
    if (processSection) {
      processSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${Math.round(num / 1000)}K`
    }
    return num.toLocaleString()
  }, [])

  const heroTitle = useMemo(() => {
    return userName
      ? `Welcome back, ${userName}`
      : "Transform Lives Through Strategic Giving"
  }, [userName])

  const features = useMemo(() => [
    {
      id: 1,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      title: "100% Verified",
      description: "All campaigns are thoroughly vetted and verified"
    },
    {
      id: 2,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      title: "Secure Transactions",
      description: "Bank-level encryption for all donations"
    },
    {
      id: 3,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: "Real-Time Tracking",
      description: "See your impact with live campaign updates"
    },
    {
      id: 4,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Community Driven",
      description: "Join thousands making a difference together"
    }
  ], [])

  const processes = useMemo(() => [
    {
      id: 1,
      step: "01",
      title: "Discover Campaigns",
      description: "Browse verified humanitarian initiatives with transparent goals and detailed impact reports.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      )
    },
    {
      id: 2,
      step: "02", 
      title: "Make Your Contribution",
      description: "Support causes you care about with secure, seamless transactions and instant confirmation.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <line x1="12" y1="14" x2="12" y2="17"></line>
          <line x1="10.5" y1="15.5" x2="13.5" y2="15.5"></line>
        </svg>
      )
    },
    {
      id: 3,
      step: "03",
      title: "Track Your Impact", 
      description: "Monitor campaign progress, receive updates, and see the real difference your generosity makes.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    }
  ], [])

  const testimonials = useMemo(() => [
    {
      id: 1,
      text: "Givify has completely transformed how I approach charitable giving. The transparency and ease of tracking impact is unmatched. I can see exactly where my donations go and the real difference they make.",
      author: "Sarah Chen",
      role: "Community Leader",
      location: "San Francisco, CA",
      avatar: "SC",
      rating: 5
    },
    {
      id: 2,
      text: "As someone who's always been passionate about helping others, Givify makes it so simple to find and support causes that matter. The verification process gives me complete confidence in every donation.",
      author: "Michael Rodriguez", 
      role: "Social Entrepreneur",
      location: "Austin, TX",
      avatar: "MR",
      rating: 5
    },
    {
      id: 3,
      text: "The platform's user experience is exceptional. From discovering campaigns to tracking their progress, everything is intuitive and professional. This is the future of philanthropy.",
      author: "Emily Thompson",
      role: "Tech Executive",
      location: "Seattle, WA",
      avatar: "ET",
      rating: 5
    }
  ], [])

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Trusted by 50,000+ donors worldwide</span>
            </div>
            
            <h1 className="hero-title">{heroTitle}</h1>
            
            <p className="hero-subtitle">
              Join a global community of changemakers supporting verified campaigns 
              with complete transparency, real-time tracking, and measurable impact.
            </p>
            
            <div className="hero-buttons">
              <button 
                className="cta-button primary" 
                onClick={handleExploreClick}
              >
                <span>Explore Campaigns</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button 
                className="cta-button secondary"
                onClick={handlePartnershipClick}
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="hero-features">
              {features.map((feature) => (
                <div key={feature.id} className="feature-pill">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-text">
                    <div className="feature-title">{feature.title}</div>
                    <div className="feature-description">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stats-container">
            <div className={`hero-stats ${isLoading ? "loading-stats" : ""}`}>
              <div className="stats-card">
                <div className="stat-icon campaigns">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{formatNumber(stats.campaigns)}+</h3>
                  <p>Active Campaigns</p>
                  <span>Making impact daily</span>
                </div>
              </div>

              <div className="stats-card">
                <div className="stat-icon people">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{formatNumber(stats.peopleServed)}+</h3>
                  <p>Lives Transformed</p>
                  <span>Across communities</span>
                </div>
              </div>

              <div className="stats-card">
                <div className="stat-icon impact">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>${formatNumber(stats.totalImpact)}</h3>
                  <p>Total Raised</p>
                  <span>And growing strong</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Showing representative data</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section" id="process" data-animate>
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">How It Works</div>
            <h2 className="section-title">Simple Steps to Make an Impact</h2>
            <p className="section-subtitle">
              Get started in minutes and begin your journey of meaningful giving with our streamlined process
            </p>
          </div>
          
          <div className="process-grid">
            {processes.map((process, index) => (
              <div key={process.id} className="process-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="process-number">{process.step}</div>
                <div className="process-icon">{process.icon}</div>
                <h3>{process.title}</h3>
                <p>{process.description}</p>
                {index < processes.length - 1 && (
                  <div className="process-connector">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials" data-animate>
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">Trusted by Thousands</h2>
            <p className="section-subtitle">
              Hear from our community of donors who are making a real difference
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="testimonial-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <blockquote className="testimonial-text">"{testimonial.text}"</blockquote>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <div className="testimonial-author">{testimonial.author}</div>
                    <div className="testimonial-meta">
                      <span>{testimonial.role}</span>
                      <span className="separator">•</span>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community and start supporting causes that matter to you</p>
          <button className="cta-button primary large" onClick={handleExploreClick}>
            <span>Start Your Journey</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Homepage