import { useEffect, useState } from "react";

function getDeviceType() {
  if (window.innerWidth >= 1280) {
    return "desktop";
  }

  if (window.innerWidth >= 744) {
    return "tablet";
  }

  return "mobile";
}

function useDeviceType() {
  const [deviceType, setDeviceType] = useState(getDeviceType);

  useEffect(() => {
    function handleResize() {
      setDeviceType(getDeviceType());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
}

export default useDeviceType;
