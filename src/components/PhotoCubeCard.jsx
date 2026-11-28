import React, { useState, useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";

// SVG Placeholder with Cyan/Navy gradient & person silhouette
const FALLBACK_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230d2847"/><stop offset="50%" stop-color="%230a1929"/><stop offset="100%" stop-color="%230891b2"/></linearGradient></defs><rect width="800" height="1000" fill="url(%23g)"/><circle cx="400" cy="380" r="140" fill="rgba(255,255,255,0.15)"/><path d="M220 780 C220 600, 580 600, 580 780 Z" fill="rgba(255,255,255,0.15)"/></svg>`;

const CubeContainer = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  maxWidth: "440px",
  margin: "0 auto",
  perspective: "1200px",
  WebkitPerspective: "1200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  outline: "none",
  "&:focus-visible": {
    outline: "2px solid #67e8f9",
    outlineOffset: "8px",
    borderRadius: "24px",
  },
}));

const CubeViewport = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  aspectRatio: "4 / 5",
  maxHeight: "70svh",
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",
}));

const Cube3DBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "rotationIndex" && prop !== "reducedMotion",
})(({ rotationIndex, reducedMotion }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",
  transition: reducedMotion
    ? "opacity 0.4s ease"
    : "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
  transform: reducedMotion
    ? "none"
    : `translateZ(-220px) rotateY(${-rotationIndex * 90}deg)`,
  "@media (max-width: 600px)": {
    transform: reducedMotion
      ? "none"
      : `translateZ(-170px) rotateY(${-rotationIndex * 90}deg)`,
  },
}));

const CubeFace = styled(Box, {
  shouldForwardProp: (prop) => prop !== "faceIndex" && prop !== "active" && prop !== "reducedMotion",
})(({ faceIndex, active, reducedMotion }) => {
  // 4 faces around Y axis: 0deg, 90deg, 180deg, 270deg
  const deg = faceIndex * 90;
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "24px",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    background: "#0d2847",
    transform: reducedMotion
      ? "none"
      : `rotateY(${deg}deg) translateZ(220px)`,
    opacity: reducedMotion ? (active ? 1 : 0) : 1,
    transition: reducedMotion ? "opacity 0.4s ease" : "none",
    pointerEvents: active ? "auto" : "none",
    "@media (max-width: 600px)": {
      transform: reducedMotion
        ? "none"
        : `rotateY(${deg}deg) translateZ(170px)`,
    },
  };
});

const FloorShadow = styled(Box)(() => ({
  position: "absolute",
  bottom: "-32px",
  left: "10%",
  width: "80%",
  height: "24px",
  background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, transparent 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
  zIndex: 1,
}));

const DotsRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginTop: "24px",
  zIndex: 10,
}));

const Dot = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  width: active ? "26px" : "10px",
  height: "10px",
  borderRadius: "999px",
  border: "none",
  background: active ? "#67e8f9" : "rgba(255, 255, 255, 0.25)",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: active ? "#67e8f9" : "rgba(255, 255, 255, 0.5)",
  },
  "&:focus-visible": {
    outline: "2px solid #67e8f9",
    outlineOffset: "2px",
  },
}));

const PhotoCubeCard = ({ photos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSources, setImageSources] = useState({});
  const intervalRef = useRef(null);

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Hover: rotate 90 degrees every 1.9s, always in same direction. Leave: glide back to photo 1 (index 0).
  const handleMouseEnter = () => {
    if (reducedMotion) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1900);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Return gracefully to photo 1
    setCurrentIndex(0);
  };

  // Touch tap advances by one face
  const handleTouchTap = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCurrentIndex((prev) => prev + 1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setCurrentIndex((prev) => prev + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 3));
    }
  };

  // Fallback for failed image loads
  const handleImageError = (index) => {
    setImageSources((prev) => ({
      ...prev,
      [index]: FALLBACK_PLACEHOLDER,
    }));
  };

  // Active face modulo 4 for dots & attributes
  const activeNormalizedIndex = ((currentIndex % 4) + 4) % 4;

  return (
    <CubeContainer
      tabIndex={0}
      role="region"
      aria-label="3D Customer Photo Cube Carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouchTap}
      onKeyDown={handleKeyDown}
    >
      <CubeViewport>
        <Cube3DBox rotationIndex={currentIndex} reducedMotion={reducedMotion}>
          {photos.map((photo, index) => {
            const isFirst = index === 0;
            const imgSrc = imageSources[index] || photo.src;
            const isActive = activeNormalizedIndex === index;

            return (
              <CubeFace
                key={index}
                faceIndex={index}
                active={isActive ? 1 : 0}
                reducedMotion={reducedMotion ? 1 : 0}
              >
                <img
                  src={imgSrc}
                  alt={photo.alt || `Credit Dost Customer ${index + 1}`}
                  loading={isFirst ? "eager" : "lazy"}
                  onError={() => handleImageError(index)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  width="800"
                  height="1000"
                />
              </CubeFace>
            );
          })}
        </Cube3DBox>

        {/* Floor Shadow */}
        <FloorShadow />
      </CubeViewport>

      {/* Dots Indicator below cube */}
      <DotsRow
        role="tablist"
        aria-label="Customer Photo Selectors"
        onClick={(e) => e.stopPropagation()} // Prevent triggering parent cube tap
      >
        {photos.map((_, dotIdx) => (
          <Dot
            key={dotIdx}
            active={activeNormalizedIndex === dotIdx ? 1 : 0}
            role="tab"
            aria-selected={activeNormalizedIndex === dotIdx}
            aria-label={`Show customer ${dotIdx + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(dotIdx);
            }}
          />
        ))}
      </DotsRow>
    </CubeContainer>
  );
};

export default PhotoCubeCard;

