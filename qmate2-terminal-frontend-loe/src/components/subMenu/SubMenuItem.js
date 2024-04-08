import React from "react";
import "../main.css";
import {
  buttonStylesForDesktop,
  fontForButtonItemMenu,
  fontForButtonList,
} from "../../constants/styles";
import Loading from "../loading/Loading";

const SubMenuItem = ({
  item,
  parentID,
  setId,
  setCurrentPage,
  setParentID,
  setBranchID,
  setLastID,
  resetTimer,
  heightDisplay,
  widthDisplay,
  setServicePage,
  setItemMenuId,
}) => {
  const choiceHandler = (parentId, id, branchId, type) => {
    if (type === "SERVICE") {
      setServicePage(2);
    }
    setId(id);
    setCurrentPage(type === "NODE" ? "itemMenu" : "choiceTime");
    setParentID(parentId);
    setBranchID(branchId);
    setLastID(parentID);
    setItemMenuId(id);
    resetTimer();
  };

  return (
    <div className="sub-menu-item-block">
      {item ? (
        widthDisplay > 900 ? (
          <button
            style={buttonStylesForDesktop}
            onClick={() =>
              choiceHandler(item.parentId, item.id, item.branchId, item.type)
            }
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
            onClick={() =>
              choiceHandler(item.parentId, item.id, item.branchId, item.type)
            }
          >
            <span className="font-for-button">
              {heightDisplay < 1000 && item.title.length > 60
                ? item.title.slice(0, 60) + "..."
                : item.title}
            </span>
          </button>
        )
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

export default SubMenuItem;
