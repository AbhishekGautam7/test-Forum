import { useState, useEffect } from "react";

function useIsMobileView({ onLoad = true, onResize = true }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const [isMobileViewNull, setIsMobileViewNull] = useState(null);
  const [isTabletView, setIsTabletView] = useState(false);
  const [isSmallTabletView, setIsSmallTabletView] = useState(true);
  const [isSmallDesktopView, setIsSmallDesktopView] = useState(false);
  const [isLowResLaptop, setIsLowResLaptop] = useState(false);

  useEffect(() => {
    if (onResize) {
      window?.addEventListener("resize", updateDimensions);
    }

    if (onLoad) {
      window?.addEventListener("load", updateDimensions);
    }

    updateDimensions();

    return () => {
      //unsubscribe all
      if (onResize) {
        window.removeEventListener("resize", updateDimensions);
      }

      if (onLoad) {
        window.removeEventListener("load", updateDimensions);
      }
    };
  }, [onLoad, onResize]);

  function updateDimensions() {
    // console.log("update dimension called");
    if (window.innerWidth < 540) {
      setIsMobileView(true);
      setIsMobileViewNull(true);
    } else {
      setIsMobileView(false);
      setIsMobileViewNull(false);
    }

    if (window.innerWidth < 992) {
      setIsSmallTabletView(true);
      setIsSmallDesktopView(true);
    } else {
      setIsSmallTabletView(false);
      setIsSmallDesktopView(false);
    }

    if (window.innerWidth < 1199) {
      setIsTabletView(true);
    } else {
      setIsTabletView(false);
    }

    if (window.innerHeight > 400 && window.innerHeight < 800) {
      setIsLowResLaptop(true);
    } else {
      setIsLowResLaptop(false);
    }

    if (window.innerWidth > 1248) {
      setIsDesktopView(true);
    } else {
      setIsDesktopView(false);
    }
  }

  return {
    isTabletView,
    isMobileView,
    isDesktopView,
    isLowResLaptop,
    setIsMobileView,
    isMobileViewNull,
    isSmallTabletView,
    isSmallDesktopView,
    setIsMobileViewNull,
  };
}

export { useIsMobileView };
