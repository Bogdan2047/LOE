import { useEffect, useState } from "react";
import "./popup.css";

const Popup = ({ config }) => {
  const [countdown, setCountdown] = useState(
    config !== null && config.REACT_APP_TIME_DOWN
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [countdown]);

  return (
    <div className="block-popup">
      <span className="popup-text">
        Через {countdown} секунд система повернеться до стартового екрану.
      </span>
      <span className="popup-text">
        Натисніть на екран, якщо бажаєте залишитись на цій сторінці.
      </span>
    </div>
  );
};

export default Popup;
