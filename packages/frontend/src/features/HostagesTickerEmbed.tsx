import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const HostagesTickerEmbed: React.FC = () => {
  const tickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tickerContainerRef.current;

    if (container) {
      const tickerDiv = document.createElement("div");
      tickerDiv.setAttribute("lang", "he");
      tickerDiv.id = "bthn";

      container.innerHTML = "";
      container.appendChild(tickerDiv);

      if (!document.getElementById("hostages-ticker-script")) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://bringthemhomenow.net/1.3.0/hostages-ticker.js";
        script.setAttribute(
          "integrity",
          "sha384-MmP7bD5QEJWvJccg9c0lDnn3LjjqQWDiRCxRV+NU8hij15icuwb29Jfw1TqJwuSv"
        );
        script.setAttribute("crossorigin", "anonymous");
        script.id = "hostages-ticker-script";

        document.head.appendChild(script);
      }
    }

    return () => {
      const existingScript = document.getElementById("hostages-ticker-script");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      if (container) {
       container.innerHTML = "";
      }
    };
  }, []);

  return (
    <Box
      ref={tickerContainerRef}
      sx={{
        textAlign: "center",
        mt: 2,
        mb: 2,
        display: {
      xs: "none", 
      sm: "block"}
      }}
    />
  );
};

export default HostagesTickerEmbed;
