import { useEffect, useState } from "react";
import { Button } from "../buttons/Button";
import SubMenuItem from "./SubMenuItem";
import PageTitle from "../pageTitlte/PageTitle";
import Popup from "../popup/popup";
import axios from "axios";
import "./subMenu.css";
import {
  styleForNavigateButton,
  titleForNavigateButton,
} from "../../constants/styles";

const SubMenu = ({
  id,
  setId,
  setCurrentPage,
  setParentID,
  setBranchID,
  setLastID,
  data,
  setSubMenuData,
  branchID,
  widthDisplay,
  setShowPopupDesktop,
  config,
  heightDisplay,
  setServicePage,
  setItemMenuId,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [currentItems, setCurrentItems] = useState(0);
  const itemsPerItem = 6;

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

  useEffect(() => {
    if (data && config !== null) {
      const apiUrl = `${config.REACT_APP_API_URL}/api/terminal/read/service-node/list`;

      const headers = {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      };

      const requestBody = {
        parentId: id,
        branchId: branchID,
      };

      return axios
        .post(apiUrl, requestBody, { headers })
        .then((response) => {
          if (response.status === 200) {
            setNextPage(response.data.res);
            setSubMenuData(response.data.res);
          }
          return null;
        })
        .catch((error) => {
          console.error("Error:", error);
          return null;
        });
    }
  }, [data]);

  const handleNext = () => {
    setCurrentItems((prevItems) => prevItems + 1);
  };

  const isMoreItemsAvailable = () => {
    return nextPage && (currentItems + 1) * itemsPerItem < nextPage.length;
  };

  const BackHandler = () => {
    if (currentItems > 0) {
      setCurrentItems(currentItems - 1);
    }
    if (currentItems === 0) {
      setCurrentPage("main");
    }
  };

  return (
    <div
      className="main-block-sub-menu"
      onClick={resetTimer}
      onTouchMove={resetTimer}
    >
      <div className="block-title">
        <PageTitle title="ВИБЕРІТЬ ПОСЛУГУ" />
      </div>

      {showPopup && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <Popup config={config} />
        </div>
      )}
      <div className="sub-menu-item">
        <div className="sub-menu-size-box">
          {nextPage !== null &&
            nextPage
              .slice(
                currentItems * itemsPerItem,
                (currentItems + 1) * itemsPerItem
              )
              .map((item) => {
                if (item.parentId === id) {
                  return (
                    <div className="space-sub-menu-item">
                      <SubMenuItem
                        key={item.id}
                        item={item}
                        parentID={id}
                        setId={setId}
                        setCurrentPage={setCurrentPage}
                        setParentID={setParentID}
                        setBranchID={setBranchID}
                        setLastID={setLastID}
                        resetTimer={resetTimer}
                        heightDisplay={heightDisplay}
                        widthDisplay={widthDisplay}
                        setServicePage={setServicePage}
                        setItemMenuId={setItemMenuId}
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
        <div className="sub-menu-block-button">
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

export default SubMenu;
