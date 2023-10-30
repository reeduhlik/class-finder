import React, { useEffect } from "react";

const AdComponent = ({ adClient, adSlot }) => {
  useEffect(() => {
    // Load the Google Ads SDK
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2810278894704716"
        data-ad-slot="5805874373"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdComponent;
