import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../buttons/Button";

import PageTitle from "../pageTitlte/PageTitle";
import Popup from "../popup/popup";
import "./extraNode.css";
import {
  styleForNavigateButton,
  titleForNavigateButton,
} from "../../constants/styles";
import ExtraNodeItem from "./extraNodeItem";

const ExtraNode = ({
  setCurrentPage,
  setParentID,
  setBranchID,
  id,
  branchID,
  setId,
  subMenuData,
  widthDisplay,
  setShowPopupDesktop,
  config,
  heightDisplay,
  setServicePage,
  servicePage,
  setParentIdHistory,
  parentIdHistory,
  itemMenuId,
}) => {
  const [subMenu, setSubMenu] = useState(null);
  const [title, setTitle] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(null);
  const [currentItems, setCurrentItems] = useState(0);

  const itemsPerItem = 6;

  useEffect(() => {
    if (parentIdHistory[parentIdHistory.length - 1] !== id) {
      setParentIdHistory((prevHistory) => prevHistory.concat(id));
    }
  }, [id, parentIdHistory, setParentIdHistory]);

  useEffect(() => {
    subMenuData?.map((item) => {
      if (item.id === id) {
        setTitle(item.title);
      }
    });
  }, []);

  useEffect(() => {
    if (config !== null) {
      const apiUrl = `${config.REACT_APP_API_URL}/api/terminal/read/service-node/list`;

      const requestBody = {
        parentId: id,
        branchId: branchID,
      };

      const headers = {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      };

      axios
        .post(apiUrl, requestBody, { headers })
        .then((response) => {
          setSubMenu(response.data.res);
        })
        .catch((error) => {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        });
    }
  }, [title, id, branchID]);

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

  const handleNext = () => {
    setCurrentItems((prevItems) => prevItems + 1);
  };

  const isMoreItemsAvailable = () => {
    return subMenu && (currentItems + 1) * itemsPerItem < subMenu.length;
  };

  const BackHandler = () => {
    if (currentItems > 0) {
      setCurrentItems(currentItems - 1);
    } else {
      setParentIdHistory((prevHistory) => {
        if (prevHistory.length > 1) {
          const newHistory = prevHistory.slice(0, -1);
          const lastParentId = newHistory[newHistory.length - 1];
          setId(lastParentId);
          return newHistory;
        } else {
          setId(itemMenuId);
          setCurrentPage("itemMenu");
          return [];
        }
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
      onClick={resetTimer}
    >
      <div className="block-title">
        <PageTitle title="ВИБЕРІТЬ ПОСЛУГУ" />
        <div className="space-block-title-item">
          <div className="block-title-item">
            <span className="title-item">{title}</span>
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
      <div className="item-menu">
        <div className="item-menu-size-block">
          {subMenu &&
            subMenu
              .slice(
                currentItems * itemsPerItem,
                (currentItems + 1) * itemsPerItem
              )
              .map((item) => {
                if (item.parentId === id) {
                  return (
                    <div className="space-sub-menu-item">
                      <ExtraNodeItem
                        key={item.id}
                        item={item}
                        setCurrentPage={setCurrentPage}
                        setParentID={setParentID}
                        setBranchID={setBranchID}
                        setId={setId}
                        resetTimer={resetTimer}
                        widthDisplay={widthDisplay}
                        heightDisplay={heightDisplay}
                        setServicePage={setServicePage}
                        servicePage={servicePage}
                        setParentIdHistory={setParentIdHistory}
                      />
                    </div>
                  );
                }
                return null;
              })}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="block-button-item-menu">
          <div onClick={() => BackHandler()}>
            <Button>назад</Button>
          </div>
          {isMoreItemsAvailable() ? (
            <div className="button-next-block" onClick={() => handleNext()}>
              <button style={styleForNavigateButton}>
                <span style={titleForNavigateButton}>Далі</span>
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraNode;
