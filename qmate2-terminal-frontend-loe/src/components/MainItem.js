import React, { useEffect, useState } from "react";
import "./main.css";
import {
  buttonStylesForDesktop,
  fontForButtonItemMenu,
  fontForButtonList,
} from "../constants/styles";

const TicketTable = ({
  item,
  handleIdChange,
  setCurrentPage,
  setId,
  setLastID,
  setBranchID,
  data,
  heightDisplay,
  widthDisplay,
  setServicePage,
}) => {
  const [componentHeight, setComponentHeight] = useState(0);

  const choiceHandler = (id, branchId, type) => {
    if (type === "SERVICE") {
      setServicePage(1);
    }
    handleIdChange(id);
    setCurrentPage(type === "NODE" ? "subMenu" : "choiceTime");
    setId(id);
    setLastID(id);
    setBranchID(branchId);
  };

  useEffect(() => {
    const headerHeight =
      document.querySelector(".header-desktop")?.offsetHeight;
    setComponentHeight(headerHeight);
  }, []);

  const height = window.innerHeight - componentHeight;

  return (
    <div
      style={
        data?.length > 2
          ? { paddingTop: widthDisplay < 900 ? 0 : 26 }
          : data?.length <= 2 && widthDisplay > 900
          ? { height: height, display: "flex", justifyContent: "center" }
          : data?.length <= 2 && widthDisplay < 900
          ? { paddingTop: 80 }
          : null
      }
    >
      <div className="main-item-block">
        <div>
          {widthDisplay > 900 ? (
            <button
              style={buttonStylesForDesktop}
              onClick={() => choiceHandler(item.id, item.branchId, item.type)}
            >
              {item.type === "NODE" ? (
                <span style={fontForButtonList}>
                  {heightDisplay > 1000 && item.title.length > 90
                    ? item.title.slice(0, 90) + "..."
                    : heightDisplay < 1000 && item.title.length > 60
                    ? item.title.slice(0, 60) + "..."
                    : item.title}
                </span>
              ) : (
                <span style={fontForButtonItemMenu}>
                  {heightDisplay > 1000 && item.title.length > 190
                    ? item.title.slice(0, 190) + "..."
                    : heightDisplay < 1000 && item.title.length > 110
                    ? item.title.slice(0, 110) + "..."
                    : item.title}
                </span>
              )}
            </button>
          ) : (
            <button
              className="buttonStylesA"
              onClick={() => choiceHandler(item.id, item.branchId, item.type)}
            >
              <span className="font-for-button">
                {heightDisplay < 1000 && item.title.length > 60
                  ? item.title.slice(0, 60) + "..."
                  : item.title}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
