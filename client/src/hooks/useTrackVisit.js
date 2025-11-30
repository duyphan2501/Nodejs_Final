import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../API/axiosInstance";
import * as UAParser from "ua-parser-js";

export default function useTrackVisit(userId) {
  const location = useLocation();

  useEffect(() => {
    const fetchVisit = async () => {
      const parser = new UAParser.UAParser(); // nếu cần tạo instance

      const result = parser.getResult();

      const payload = {
        userId: userId || null,
        deviceType: result.device.type || "desktop",
        browser: result.browser.name || "unknown",
        page: location.pathname,
      };

      try {
        await API.post("/api/visit/", payload);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVisit();
  }, [location.pathname, userId]);
}
