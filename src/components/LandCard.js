"use client"

import { useState } from "react"

const LandCard = ({ land_vehicle }) => {
  const [showModal, setShowModal] = useState(false)
  const [flagError, setFlagError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Check if 3D model is available
  const has3DModel = land_vehicle.sketchfab_embed_url && land_vehicle.sketchfab_embed_url !== "NOT FOUND"

  return (
    <div style={cardContainerStyle}>
      {/* Military-style corner brackets */}
      <div style={cornerBracketStyle(true, true)}></div>
      <div style={cornerBracketStyle(true, false)}></div>
      <div style={cornerBracketStyle(false, true)}></div>
      <div style={cornerBracketStyle(false, false)}></div>

      <div style={cardInnerStyle}>
        <div style={imageContainerStyle}>
          <img
            src={land_vehicle.image_url || "/placeholder.svg"}
            alt={land_vehicle.name}
            style={{
              ...imageStyle,
              opacity: imageLoaded ? 1 : 0.7,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/api/placeholder/400/320"
            }}
          />

          {/* HUD-style overlay */}
          <div style={hudOverlayStyle}></div>

          {/* Country flag and identifier */}
          <div style={countryBadgeStyle}>
            {!flagError && (
              <img
                src={`/data/flags/${land_vehicle.country.toLowerCase()}.jpg`}
                alt={land_vehicle.country}
                style={flagStyle}
                onError={(e) => {
                  setFlagError(true)
                  e.target.onerror = null
                }}
              />
            )}
            <span style={countryTextStyle}>{land_vehicle.country}</span>
          </div>

          {/* Service branch indicator */}
          <div style={serviceBadgeStyle}>
            <div style={statusLightStyle}></div>
            <span style={serviceTextStyle}>{land_vehicle.service}</span>
          </div>

          {/* Aviation callsign style identifier */}
          <div style={callsignStyle}>
            {land_vehicle.name
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()}
          </div>
        </div>

        <div style={contentStyle}>
          {/* land_vehicle designation header */}
          <div style={headerSectionStyle}>
            <h2 style={land_vehicleNameStyle}>{land_vehicle.name}</h2>
            <div style={roleBadgeStyle}>
              <span style={roleTextStyle}>{land_vehicle.role}</span>
            </div>
          </div>

          {/* Model designation */}
          <div style={modelSectionStyle}>
            <span style={modelLabelStyle}>MODEL:</span>
            <span style={modelValueStyle}>{land_vehicle.model}</span>
          </div>

          {/* Flight data section */}
          <div style={flightDataStyle}>
            <div style={dataRowStyle}>
              <span style={dataLabelStyle}>UNITS:</span>
              <span style={dataValueStyle}>{land_vehicle.units}</span>
            </div>
            <div style={dataRowStyle}>
              <span style={dataLabelStyle}>STATUS:</span>
              <span style={assessmentStyle}>{land_vehicle.assessment}</span>
            </div>
          </div>

          {/* Tactical divider */}
          <div style={dividerStyle}></div>

          {/* Mission brief */}
          <div style={missionBriefStyle}>
            <div style={briefHeaderStyle}>MISSION BRIEF:</div>
            <p style={descriptionStyle}>{land_vehicle.description}</p>
          </div>

          {/* Action button */}
          <div style={actionSectionStyle}>
            <button
              style={{
                ...actionButtonStyle,
                ...(has3DModel ? activeButtonStyle : disabledButtonStyle),
              }}
              onClick={() => has3DModel && setShowModal(true)}
              disabled={!has3DModel}
              onMouseEnter={(e) => {
                if (has3DModel) {
                  e.target.style.backgroundColor = "#2D5016"
                  e.target.style.borderColor = "#8FBC8F"
                  e.target.style.boxShadow = "0 0 8px rgba(143, 188, 143, 0.3)"
                }
              }}
              onMouseLeave={(e) => {
                if (has3DModel) {
                  e.target.style.backgroundColor = "#4B5320"
                  e.target.style.borderColor = "#6B7532"
                  e.target.style.boxShadow = "none"
                }
              }}
            >
              <span style={buttonIconStyle}>◉</span>
              3D COCKPIT VIEW
            </button>
          </div>
        </div>
      </div>

      {/* 3D Model Modal with aviation theme */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContainerStyle}>
            {/* Modal header with HUD styling */}
            <div style={modalHeaderStyle}>
              <div style={modalTitleSectionStyle}>
                <div style={modalStatusLightStyle}></div>
                <h3 style={modalTitleStyle}>VEHICLE INSPECTION: {land_vehicle.name.toUpperCase()}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#8B0000"
                  e.target.style.borderColor = "#FF4444"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#654321"
                  e.target.style.borderColor = "#8B4513"
                }}
              >
                <span style={closeIconStyle}>✕</span>
                CLOSE
              </button>
            </div>

            {/* 3D viewer with frame */}
            <div style={viewerContainerStyle}>
              <div style={viewerFrameStyle}>
                <iframe
                  title={`${land_vehicle.name} 3D Model`}
                  frameBorder="0"
                  allowFullScreen
                  mozallowfullscreen="true"
                  webkitallowfullscreen="true"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  src={land_vehicle.sketchfab_embed_url}
                  style={iframeStyle}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Styles with military aviation theme
const cardContainerStyle = {
  position: "relative",
  backgroundColor: "rgba(20, 25, 20, 0.95)",
  border: "1px solid #4B5320",
  borderRadius: "2px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
  transition: "all 0.3s ease",
  fontFamily: "monospace",
  margin: "4px",
}

const cardInnerStyle = {
  padding: "2px",
}

const cornerBracketStyle = (isTop, isLeft) => ({
  position: "absolute",
  width: "12px",
  height: "12px",
  borderStyle: "solid",
  borderColor: "#8FBC8F",
  borderWidth: isTop ? "2px 0 0 2px" : "0 2px 2px 0",
  top: isTop ? "2px" : "auto",
  bottom: isTop ? "auto" : "2px",
  left: isLeft ? "2px" : "auto",
  right: isLeft ? "auto" : "2px",
  zIndex: 10,
})

const imageContainerStyle = {
  position: "relative",
  height: "200px",
  overflow: "hidden",
  backgroundColor: "#0A0A0A",
}

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.3s ease",
}

const hudOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(45deg, transparent 49%, rgba(143, 188, 143, 0.1) 50%, transparent 51%)",
  pointerEvents: "none",
}

const countryBadgeStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(10, 10, 10, 0.9)",
  border: "1px solid #4B5320",
  padding: "4px 6px",
  borderRadius: "1px",
}

const flagStyle = {
  width: "16px",
  height: "12px",
  marginRight: "4px",
  border: "1px solid #4B5320",
}

const countryTextStyle = {
  color: "#8FBC8F",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "0.5px",
}

const serviceBadgeStyle = {
  position: "absolute",
  bottom: "8px",
  left: "8px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(75, 83, 32, 0.9)",
  border: "1px solid #8FBC8F",
  padding: "4px 8px",
  borderRadius: "1px",
}

const statusLightStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "#8FBC8F",
  marginRight: "6px",
  boxShadow: "0 0 4px #8FBC8F",
}

const serviceTextStyle = {
  color: "#FFFFFF",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "1px",
}

const callsignStyle = {
  position: "absolute",
  top: "8px",
  left: "8px",
  backgroundColor: "rgba(139, 69, 19, 0.9)",
  color: "#FFD700",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold",
  border: "1px solid #8B4513",
  letterSpacing: "1px",
}

const contentStyle = {
  padding: "12px",
  backgroundColor: "rgba(30, 35, 30, 0.8)",
}

const headerSectionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "8px",
}

const land_vehicleNameStyle = {
  color: "#8FBC8F",
  fontSize: "16px",
  fontWeight: "bold",
  margin: 0,
  letterSpacing: "0.5px",
  flex: 1,
}

const roleBadgeStyle = {
  backgroundColor: "#4B5320",
  border: "1px solid #6B7532",
  padding: "2px 6px",
  borderRadius: "1px",
  marginLeft: "8px",
}

const roleTextStyle = {
  color: "#FFFFFF",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "0.5px",
}

const modelSectionStyle = {
  marginBottom: "10px",
  padding: "4px 0",
  borderBottom: "1px solid #4B5320",
}

const modelLabelStyle = {
  color: "#6B7532",
  fontSize: "10px",
  fontWeight: "bold",
  marginRight: "6px",
}

const modelValueStyle = {
  color: "#8FBC8F",
  fontSize: "12px",
  fontWeight: "bold",
}

const flightDataStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
}

const dataRowStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const dataLabelStyle = {
  color: "#6B7532",
  fontSize: "9px",
  fontWeight: "bold",
  marginBottom: "2px",
}

const dataValueStyle = {
  color: "#8FBC8F",
  fontSize: "14px",
  fontWeight: "bold",
}

const assessmentStyle = {
  color: "#FFD700",
  fontSize: "12px",
  fontWeight: "bold",
}

const dividerStyle = {
  height: "1px",
  backgroundColor: "#4B5320",
  margin: "10px 0",
  position: "relative",
}

const missionBriefStyle = {
  marginBottom: "12px",
}

const briefHeaderStyle = {
  color: "#6B7532",
  fontSize: "10px",
  fontWeight: "bold",
  marginBottom: "4px",
  letterSpacing: "1px",
}

const descriptionStyle = {
  color: "#CCCCCC",
  fontSize: "11px",
  lineHeight: "1.4",
  margin: 0,
}

const actionSectionStyle = {
  display: "flex",
  justifyContent: "center",
}

const actionButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  border: "1px solid",
  borderRadius: "1px",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1px",
  transition: "all 0.2s ease",
  cursor: "pointer",
  fontFamily: "monospace",
}

const activeButtonStyle = {
  backgroundColor: "#4B5320",
  borderColor: "#6B7532",
  color: "#FFFFFF",
}

const disabledButtonStyle = {
  backgroundColor: "#2A2A2A",
  borderColor: "#444444",
  color: "#666666",
  cursor: "not-allowed",
}

const buttonIconStyle = {
  marginRight: "6px",
  fontSize: "12px",
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  fontFamily: "monospace",
}

const modalContainerStyle = {
  backgroundColor: "#1A1A1A",
  border: "2px solid #4B5320",
  borderRadius: "2px",
  width: "90%",
  maxWidth: "1000px",
  height: "80%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: "#2A2A2A",
  borderBottom: "1px solid #4B5320",
}

const modalTitleSectionStyle = {
  display: "flex",
  alignItems: "center",
}

const modalStatusLightStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#8FBC8F",
  marginRight: "10px",
  boxShadow: "0 0 6px #8FBC8F",
}

const modalTitleStyle = {
  color: "#8FBC8F",
  fontSize: "16px",
  fontWeight: "bold",
  margin: 0,
  letterSpacing: "1px",
}

const closeButtonStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#654321",
  border: "1px solid #8B4513",
  color: "#FFFFFF",
  padding: "6px 12px",
  borderRadius: "1px",
  fontSize: "11px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
}

const closeIconStyle = {
  marginRight: "4px",
  fontSize: "12px",
}

const viewerContainerStyle = {
  flex: 1,
  padding: "8px",
  backgroundColor: "#0A0A0A",
}

const viewerFrameStyle = {
  width: "100%",
  height: "100%",
  border: "1px solid #4B5320",
  borderRadius: "1px",
  overflow: "hidden",
}

const iframeStyle = {
  width: "100%",
  height: "100%",
  border: "none",
}

export default LandCard
