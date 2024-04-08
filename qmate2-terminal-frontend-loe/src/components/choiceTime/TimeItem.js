import { useEffect, useState } from "react";
import {
  buttonTimeStylesForDesktop,
  fontForButtonList,
} from "../../constants/styles";
import "../main.css";

const TimeItem = ({
  time,
  id,
  currentID,
  branchId,
  serviceId,
  date,
  setCurrentPage,
  setParentID,
  setBranchID,
  setId,
  getDate,
  getTime,
  setServiceID,
  resetTimer,
  currentItems,
  itemsPerItem,
  widthDisplay,
  config,
}) => {
  const choiceHandler = (time) => {
    setCurrentPage("ticket");
    setParentID(id);
    setBranchID(branchId);
    setId(currentID);
    getTime(time);
    getDate(date);
    setServiceID(serviceId);
    resetTimer();
  };
  const [noTime, setNoTime] = useState(false);

  useEffect(() => {
    if (config !== null) {
      const timer = setTimeout(() => {
        setNoTime(true);
      }, config.REACT_APP_ERROR_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="block-choice-time-item">
      {time && time.length > 0
        ? time
            .slice(
              currentItems * itemsPerItem,
              (currentItems + 1) * itemsPerItem
            )
            .map((item, i) => {
              const start = item.startTime;
              const newStartTime = start.slice(0, 5);
              return (
                <div className="block-choice-time">
                  {widthDisplay > 900 ? (
                    <button
                      style={buttonTimeStylesForDesktop}
                      onClick={() => choiceHandler(item.startTime)}
                    >
                      <span style={fontForButtonList}>{newStartTime}</span>
                    </button>
                  ) : (
                    <button
                      className="buttonStylesB"
                      onClick={() => choiceHandler(item.startTime)}
                    >
                      <span className="time-for-choice">{newStartTime}</span>
                    </button>
                  )}
                </div>
              );
            })
        : noTime && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
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
                      style={{
                        width: "307px",
                        height: 5,
                        backgroundColor: "black",
                      }}
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
            </div>
          )}
    </div>
  );
};

export default TimeItem;
