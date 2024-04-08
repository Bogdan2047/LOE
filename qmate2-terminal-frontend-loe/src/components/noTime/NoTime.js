import { useEffect, useState } from "react";
import "../main.css";
import PageTitle from "../pageTitlte/PageTitle";
import Popup from "../popup/popup";
import {
  styleButtonMainMenu,
  titleForNavigateButton,
} from "../../constants/styles";

const NoTime = ({
  title,
  setCurrentPage,
  widthDisplay,
  setShowPopupDesktop,
  config,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (config !== null) {
      if (widthDisplay > 900) {
        const interval = setInterval(() => {
          setShowPopupDesktop(true);
        }, config.REACT_APP_TIMEOUT_PAGE);

        return () => clearInterval(interval);
      } else {
        const interval = setInterval(() => {
          setShowPopup(true);
        }, config.REACT_APP_TIMEOUT_PAGE);

        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
    if (config !== null) {
      let newTimer;
      if (showPopup) {
        newTimer = setTimeout(() => {
          setCurrentPage("main");
        }, config.REACT_APP_TIME_DOWN * 1000);
        setTimer(newTimer);
      }

      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    }
  }, [showPopup]);

  const resetTimer = () => {
    setShowPopup(false);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
      onClick={resetTimer}
    >
      <div className="block-title">
        <div style={{ paddingTop: 30, paddingBottom: 30 }}>
          <PageTitle title="ЗАВІТАЙТЕ ПІЗНІШЕ" />
        </div>
        <div style={{ paddingTop: 30 }}>
          <div className="block-title-item">
            <span className="title-item">
              {title !== null && title.length > 50
                ? title.slice(0, 50) + "..."
                : title}
            </span>
          </div>
        </div>
      </div>
      {showPopup && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Popup config={config} />
        </div>
      )}
      <div className="no-time-block">
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div>
            <span className="font-title">
              {config !== null && config.NOT_TIME}
            </span>
          </div>
          <div className="div-line-for-no-time">
            <div
              style={{ width: "307px", height: 5, backgroundColor: "black" }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <span className="font-title">
              {config !== null && config.VISIT_WEBSITE}
            </span>
          </div>
          <div style={{ paddingTop: "30px" }}>
            <div
              style={{
                textDecorationColor: "#83BD00",
              }}
            >
              <span className="link-size">www.loe.lviv.ua/equeue</span>
            </div>
          </div>
        </div>
      </div>
      <div className="button-for-choiceItem">
        <div>
          {widthDisplay > 900 ? (
            <button
              style={styleButtonMainMenu}
              onClick={() => setCurrentPage("main")}
            >
              <span style={titleForNavigateButton}>Головне меню</span>
            </button>
          ) : (
            <button
              className="buttonStylesC"
              onClick={() => setCurrentPage("main")}
            >
              <span className="button-name">Головне меню</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoTime;
