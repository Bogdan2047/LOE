import React, { useEffect, useState } from "react";
import "./Modal.css";
import { useTheme } from "../../constants/theme";
import { Styles } from "../../constants/styles";

const Modal = React.memo(({ showModal, returnTo, children }) => {
  const theme = useTheme();
  const s = new Styles(theme);
  const [intervalId, setIntervalId] = useState();
  const [typeModal, setTypeModal] = useState(showModal);

  const [seconds, setSeconds] = useState(
    theme.durationDisplayInactivityMessage
  );

  useEffect(() => {
    if (showModal && typeModal !== showModal) {
      setTypeModal(showModal);
      clearInterval(intervalId);
      setSeconds(theme.durationDisplayInactivityMessage);
    }

    let myInterval = null;
    let cleanupFunction = false;

    if (showModal === "timer") {
      myInterval = setTimeout(() => {
        if (cleanupFunction) return;

        setSeconds((prevValue) => {
          if (prevValue > 1) {
            return prevValue - 1;
          }

          if (prevValue === 1) {
            clearInterval(myInterval);
            returnTo(true);
            return null;
          }
        });
      }, 1000);
      setIntervalId(myInterval);
      return () => {
        cleanupFunction = true;
        clearInterval(intervalId);
      };
    }
  }, [seconds, showModal]);

  return (
    <>
      <div style={s.modalWrapper} onClick={() => returnTo(false)}>
        {showModal === "timer" && (
          <p>
            Через <span style={s.secondsValue}>{seconds}</span> секунд система
            повернеться до стартового екрану. Натисніть на екран, якщо бажаєте
            залишитись на цій сторінці.
          </p>
        )}
        {showModal === "error" && (
          <p>
            За цим питанням звертайтеся, будь ласка, до іншого центру
            обслуговування! Деталі запитуйте у адміністратора.
          </p>
        )}
      </div>
      <div
        style={s.modalOverlay}
        onClick={(e) => {
          e.preventDefault();
          returnTo(false);
        }}
      >
        {" "}
      </div>
    </>
  );
});

export default Modal;
