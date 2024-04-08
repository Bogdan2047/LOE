import React from "react";
import "../main.css";
import {
  buttonStylesForDesktop,
  fontForButtonItemMenu,
  fontForButtonList,
} from "../../constants/styles";
import Loading from "../loading/Loading";

const SubItemMenu = ({
  item,
  setCurrentPage,
  setParentID,
  setBranchID,
  setId,
  resetTimer,
  widthDisplay,
  heightDisplay,
  setServicePage,
}) => {
  const choiceHandler = (parentId, branchId, id, type) => {
    if (type === "SERVICE") {
      setServicePage(3);
    }
    setCurrentPage(type === "NODE" ? "extraNode" : "choiceTime");
    setParentID(parentId);
    setBranchID(branchId);
    setId(id);
    resetTimer();
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {item ? (
        <div>
          {widthDisplay > 900 ? (
            <button
              style={buttonStylesForDesktop}
              onClick={() =>
                choiceHandler(item.parentId, item.branchId, item.id, item.type)
              }
            >
              <div
                style={{
                  textAlign: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
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
              </div>
            </button>
          ) : (
            <button
              className="buttonStylesA"
              onClick={() =>
                choiceHandler(item.parentId, item.branchId, item.id, item.type)
              }
            >
              <span className="font-for-button">
                {item.title.length > 60
                  ? item.title.slice(0, 40) + "..."
                  : widthDisplay < 475 && item.title.length > 50
                  ? item.title.slice(0, 35) + "..."
                  : item.title}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 150,
            textAlign: "center",
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SubItemMenu;
