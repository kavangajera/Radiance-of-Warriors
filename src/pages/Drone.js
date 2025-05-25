"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import DroneCard from "../components/DroneCard"
import Header from "../components/Header"

const Drone = () => {
  const { country } = useParams()
  const [droneData, setDroneData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states
  const [filters, setFilters] = useState({
    service: "ALL",
    role: "ALL",
    country: "ALL",
  })

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    byService: {},
    byRole: {},
    byCountry: {},
  })

  // Animation states for military feel
  const [systemStatus, setSystemStatus] = useState("ONLINE")
  const [blinkingStatus, setBlinkingStatus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setSystemStatus("LOADING")

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/military/${country.toLowerCase()}/droneforce`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${country}`)
        }

        const result = await response.json()
        const data = result.data
        setDroneData(data)
        calculateStats(data)
        setSystemStatus("ONLINE")
        setLoading(false)
      } catch (err) {
        console.error("Error fetching drone data:", err)
        setError(err.message)
        setSystemStatus("ERROR")
        setLoading(false)
      }
    }

    fetchData()
  }, [country])

  // Status blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkingStatus((prev) => !prev)
    }, 1000)

    return () => clearInterval(blinkInterval)
  }, [])

  // Calculate statistics from data
  const calculateStats = (data) => {
    const statsByService = {}
    const statsByRole = {}
    const statsByCountry = {}

    data.forEach((drone) => {
      statsByService[drone.service] = (statsByService[drone.service] || 0) + drone.units
      statsByRole[drone.role] = (statsByRole[drone.role] || 0) + drone.units
      statsByCountry[drone.country] = (statsByCountry[drone.country] || 0) + drone.units
    })

    const totalUnits = Object.values(statsByService).reduce((sum, current) => sum + current, 0)

    setStats({
      total: totalUnits,
      byService: statsByService,
      byRole: statsByRole,
      byCountry: statsByCountry,
    })
  }

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(droneData.map((item) => item[key]))]
  }

  // Apply filters and search
  const filteredDrone = droneData.filter((drone) => {
    const matchesSearch =
      drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesService = filters.service === "ALL" || drone.service === filters.service
    const matchesRole = filters.role === "ALL" || drone.role === filters.role
    const matchesCountry = filters.country === "ALL" || drone.country === filters.country

    return matchesSearch && matchesService && matchesRole && matchesCountry
  })

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  if (loading)
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingContentStyle}>
          <div style={loadingSpinnerStyle}></div>
          <div style={loadingTextStyle}>ACCESSING MILITARY DATABASE...</div>
          <div style={loadingSubTextStyle}>DECRYPTING DRONE DATA</div>
        </div>
      </div>
    )

  if (error)
    return (
      <div style={errorContainerStyle}>
        <div style={errorContentStyle}>
          <div style={errorHeaderStyle}>
            <div style={errorStatusStyle}></div>
            SYSTEM ERROR
          </div>
          <div style={errorMessageStyle}>{error}</div>
          <div style={errorCodeStyle}>ERROR CODE: DB_CONNECTION_FAILED</div>
        </div>
      </div>
    )

  return (
    <div style={pageContainerStyle}>
      <Header title={`${country.charAt(0).toUpperCase() + country.slice(1)} Air Force Command`} />

      <div style={contentContainerStyle}>
        {/* Navigation and status bar */}
        <div style={navBarStyle}>
          <Link to="/" style={backButtonStyle}>
            <span style={backIconStyle}>◄</span>
            RETURN TO COMMAND CENTER
          </Link>

          <div style={statusBarStyle}>
            <div style={statusIndicatorStyle(blinkingStatus, systemStatus)}>
              <div style={statusLightStyle(systemStatus)}></div>
              <span style={statusTextStyle}>SYSTEM: {systemStatus}</span>
            </div>
          </div>
        </div>

        {/* Mission briefing header */}
        <div style={missionHeaderStyle}>
          <div style={missionTitleStyle}>
            <span style={missionIconStyle}>✈</span>
            DRONE INVENTORY SYSTEM
          </div>
          <div style={missionSubtitleStyle}>CLASSIFIED MILITARY ASSETS - {country.toUpperCase()}</div>
        </div>

        {/* Intelligence overview */}
        <div style={intelligenceContainerStyle}>
          <div style={intelligenceHeaderStyle}>
            <div style={intelligenceIconStyle}>◉</div>
            TACTICAL OVERVIEW
          </div>

          <div style={statsGridStyle}>
            <div style={statCardStyle("#4B5320")}>
              <div style={statHeaderStyle}>TOTAL DRONE</div>
              <div style={statValueStyle}>{stats.total}</div>
              <div style={statSubtextStyle}>OPERATIONAL UNITS</div>
            </div>

            <div style={statCardStyle("#2D5016")}>
              <div style={statHeaderStyle}>PRIMARY SERVICE</div>
              {Object.entries(stats.byService).length > 0 && (
                <>
                  <div style={statValueStyle}>{Object.entries(stats.byService).sort((a, b) => b[1] - a[1])[0][0]}</div>
                  <div style={statSubtextStyle}>
                    {Object.entries(stats.byService).sort((a, b) => b[1] - a[1])[0][1]} UNITS
                  </div>
                </>
              )}
            </div>

            <div style={statCardStyle("#654321")}>
              <div style={statHeaderStyle}>MAIN ROLE</div>
              {Object.entries(stats.byRole).length > 0 && (
                <>
                  <div style={statValueStyle}>{Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0][0]}</div>
                  <div style={statSubtextStyle}>
                    {Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0][1]} UNITS
                  </div>
                </>
              )}
            </div>

            <div style={statCardStyle("#8B4513")}>
              <div style={statHeaderStyle}>DOMESTIC RATIO</div>
              {Object.entries(stats.byCountry).length > 0 && (
                <>
                  <div style={statValueStyle}>
                    {stats.byCountry[country.charAt(0).toUpperCase() + country.slice(1)]
                      ? `${Math.round((stats.byCountry[country.charAt(0).toUpperCase() + country.slice(1)] / stats.total) * 100)}%`
                      : "0%"}
                  </div>
                  <div style={statSubtextStyle}>DOMESTIC PRODUCTION</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Command and control panel */}
        <div style={controlPanelStyle}>
          <div style={controlHeaderStyle}>
            <div style={controlIconStyle}>⚡</div>
            SEARCH & FILTER CONTROLS
          </div>

          <div style={controlGridStyle}>
            <div style={controlGroupStyle}>
              <label style={controlLabelStyle}>SEARCH QUERY</label>
              <input
                type="text"
                placeholder="Enter drone designation..."
                style={searchInputStyle}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={controlGroupStyle}>
              <label style={controlLabelStyle}>SERVICE BRANCH</label>
              <select
                style={selectInputStyle}
                value={filters.service}
                onChange={(e) => handleFilterChange("service", e.target.value)}
              >
                <option value="ALL">ALL SERVICES</option>
                {getUniqueValues("service").map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlGroupStyle}>
              <label style={controlLabelStyle}>MISSION ROLE</label>
              <select
                style={selectInputStyle}
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="ALL">ALL ROLES</option>
                {getUniqueValues("role").map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlGroupStyle}>
              <label style={controlLabelStyle}>ORIGIN COUNTRY</label>
              <select
                style={selectInputStyle}
                value={filters.country}
                onChange={(e) => handleFilterChange("country", e.target.value)}
              >
                <option value="ALL">ALL COUNTRIES</option>
                {getUniqueValues("country").map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results display */}
        <div style={resultsHeaderStyle}>
          <div style={resultsInfoStyle}>
            <span style={resultsIconStyle}>📊</span>
            DISPLAYING {filteredDrone.length} OF {droneData.length} DRONE
            {filteredDrone.length > 0 &&
              ` (${filteredDrone.reduce((sum, drone) => sum + drone.units, 0)} TOTAL UNITS)`}
          </div>
        </div>

        {/* drone grid */}
        <div style={droneGridStyle}>
          {filteredDrone.map((drone, index) => (
            <DroneCard key={index} drone={drone} />
          ))}
        </div>

        {/* No results message */}
        {filteredDrone.length === 0 && (
          <div style={noResultsContainerStyle}>
            <div style={noResultsContentStyle}>
              <div style={noResultsIconStyle}>⚠</div>
              <div style={noResultsTextStyle}>NO DRONE MATCH CURRENT PARAMETERS</div>
              <div style={noResultsSubtextStyle}>ADJUST SEARCH CRITERIA OR RESET FILTERS</div>
              <button
                style={resetButtonStyle}
                onClick={() => {
                  setSearchTerm("")
                  setFilters({
                    service: "ALL",
                    role: "ALL",
                    country: "ALL",
                  })
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2D5016"
                  e.target.style.borderColor = "#8FBC8F"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#4B5320"
                  e.target.style.borderColor = "#6B7532"
                }}
              >
                RESET ALL FILTERS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Styles with military aviation theme
const pageContainerStyle = {
  minHeight: "100vh",
  backgroundColor: "#0A0A0A",
  color: "#CCCCCC",
  fontFamily: "monospace",
}

const contentContainerStyle = {
  paddingTop: "70px",
  padding: "70px 16px 16px 16px",
  maxWidth: "1400px",
  margin: "0 auto",
}

const loadingContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#0A0A0A",
  fontFamily: "monospace",
}

const loadingContentStyle = {
  textAlign: "center",
  color: "#8FBC8F",
}

const loadingSpinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #4B5320",
  borderTop: "3px solid #8FBC8F",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 16px",
}

const loadingTextStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "8px",
  letterSpacing: "1px",
}

const loadingSubTextStyle = {
  fontSize: "12px",
  color: "#6B7532",
}

const errorContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#0A0A0A",
  fontFamily: "monospace",
}

const errorContentStyle = {
  backgroundColor: "#2A1A1A",
  border: "2px solid #8B0000",
  padding: "24px",
  borderRadius: "2px",
  textAlign: "center",
  maxWidth: "400px",
}

const errorHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FF4444",
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "12px",
}

const errorStatusStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#FF4444",
  marginRight: "8px",
  boxShadow: "0 0 6px #FF4444",
}

const errorMessageStyle = {
  color: "#CCCCCC",
  marginBottom: "8px",
}

const errorCodeStyle = {
  color: "#8B0000",
  fontSize: "12px",
}

const navBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  padding: "12px",
  backgroundColor: "rgba(20, 25, 20, 0.8)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
}

const backButtonStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#4B5320",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "8px 16px",
  border: "1px solid #6B7532",
  borderRadius: "1px",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
  transition: "all 0.2s ease",
}

const backIconStyle = {
  marginRight: "8px",
  fontSize: "14px",
}

const statusBarStyle = {
  display: "flex",
  alignItems: "center",
}

const statusIndicatorStyle = (blinking, status) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(10, 10, 10, 0.8)",
  border: "1px solid #4B5320",
  padding: "6px 12px",
  borderRadius: "1px",
})

const statusLightStyle = (status) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: status === "ONLINE" ? "#8FBC8F" : status === "ERROR" ? "#FF4444" : "#FFD700",
  marginRight: "8px",
  boxShadow: `0 0 6px ${status === "ONLINE" ? "#8FBC8F" : status === "ERROR" ? "#FF4444" : "#FFD700"}`,
})

const statusTextStyle = {
  color: "#8FBC8F",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1px",
}

const missionHeaderStyle = {
  textAlign: "center",
  marginBottom: "24px",
  padding: "20px",
  backgroundColor: "rgba(75, 83, 32, 0.2)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
}

const missionTitleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8FBC8F",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "8px",
  letterSpacing: "2px",
}

const missionIconStyle = {
  marginRight: "12px",
  fontSize: "28px",
}

const missionSubtitleStyle = {
  color: "#6B7532",
  fontSize: "14px",
  letterSpacing: "1px",
}

const intelligenceContainerStyle = {
  marginBottom: "24px",
  backgroundColor: "rgba(20, 25, 20, 0.8)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
  padding: "16px",
}

const intelligenceHeaderStyle = {
  display: "flex",
  alignItems: "center",
  color: "#8FBC8F",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "16px",
  letterSpacing: "1px",
}

const intelligenceIconStyle = {
  marginRight: "8px",
  fontSize: "16px",
}

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
}

const statCardStyle = (borderColor) => ({
  backgroundColor: "rgba(10, 10, 10, 0.8)",
  border: `2px solid ${borderColor}`,
  borderRadius: "2px",
  padding: "16px",
  textAlign: "center",
})

const statHeaderStyle = {
  color: "#6B7532",
  fontSize: "10px",
  fontWeight: "bold",
  marginBottom: "8px",
  letterSpacing: "1px",
}

const statValueStyle = {
  color: "#8FBC8F",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "4px",
}

const statSubtextStyle = {
  color: "#4B5320",
  fontSize: "10px",
  letterSpacing: "0.5px",
}

const controlPanelStyle = {
  marginBottom: "24px",
  backgroundColor: "rgba(20, 25, 20, 0.8)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
  padding: "16px",
}

const controlHeaderStyle = {
  display: "flex",
  alignItems: "center",
  color: "#8FBC8F",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "16px",
  letterSpacing: "1px",
}

const controlIconStyle = {
  marginRight: "8px",
  fontSize: "16px",
}

const controlGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
}

const controlGroupStyle = {
  display: "flex",
  flexDirection: "column",
}

const controlLabelStyle = {
  color: "#6B7532",
  fontSize: "11px",
  fontWeight: "bold",
  marginBottom: "6px",
  letterSpacing: "1px",
}

const searchInputStyle = {
  backgroundColor: "#0A0A0A",
  border: "1px solid #4B5320",
  borderRadius: "1px",
  padding: "8px 12px",
  color: "#8FBC8F",
  fontSize: "12px",
  fontFamily: "monospace",
}

const selectInputStyle = {
  backgroundColor: "#0A0A0A",
  border: "1px solid #4B5320",
  borderRadius: "1px",
  padding: "8px 12px",
  color: "#8FBC8F",
  fontSize: "12px",
  fontFamily: "monospace",
}

const resultsHeaderStyle = {
  marginBottom: "16px",
  padding: "12px",
  backgroundColor: "rgba(75, 83, 32, 0.3)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
}

const resultsInfoStyle = {
  display: "flex",
  alignItems: "center",
  color: "#8FBC8F",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
}

const resultsIconStyle = {
  marginRight: "8px",
  fontSize: "14px",
}

const droneGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  marginBottom: "24px",
}

const noResultsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  backgroundColor: "rgba(20, 25, 20, 0.8)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
}

const noResultsContentStyle = {
  textAlign: "center",
}

const noResultsIconStyle = {
  fontSize: "48px",
  color: "#6B7532",
  marginBottom: "16px",
}

const noResultsTextStyle = {
  color: "#8FBC8F",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "8px",
  letterSpacing: "1px",
}

const noResultsSubtextStyle = {
  color: "#6B7532",
  fontSize: "12px",
  marginBottom: "20px",
}

const resetButtonStyle = {
  backgroundColor: "#4B5320",
  border: "1px solid #6B7532",
  color: "#FFFFFF",
  padding: "10px 20px",
  borderRadius: "1px",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
  cursor: "pointer",
  transition: "all 0.2s ease",
}

export default Drone
