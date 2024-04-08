import Main from "./components/Main";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/header/Header";
import Ticket from "./components/ticket/Ticket";
import ChoiceTime from "./components/choiceTime/ChoiceTime";
import SubMenu from "./components/subMenu/SubMenu";
import ItemMenu from "./components/itemMenu/ItemMenu";

import "./App.css";
import {
  contentStylesDesktop,
  contentStylesTerminal,
} from "./constants/styles";
import Popup from "./components/popup/popup";
import ExtraNode from "./components/extraNode/extraNode";

function App() {
  const [config, setConfig] = useState(null);

  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);

  const [currentPage, setCurrentPage] = useState("main");
  const [lastID, setLastID] = useState(null);
  const [parendID, setParentID] = useState(null);
  const [branchID, setBranchID] = useState(null);
  const [id, setId] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [serviceID, setServiceID] = useState(null);
  const [subMenuData, setSubMenuData] = useState(null);
  const [widthDisplay, setWidthDisplay] = useState(null);
  const [heightDisplay, setHeightDisplay] = useState(null);
  const [showPopupDesktop, setShowPopupDesktop] = useState(false);
  const [currentItems, setCurrentItems] = useState(0);
  const [servicePage, setServicePage] = useState(0);

  const [parentIdHistory, setParentIdHistory] = useState([]);

  const [timer, setTimer] = useState(null);

  const [itemMenuId, setItemMenuId] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleIdChange = (newId) => {
    setId(newId);
  };

  let content = null;

  switch (currentPage) {
    case "main":
      content = (
        <Main
          data={data}
          setLastID={setLastID}
          handleIdChange={handleIdChange}
          setCurrentPage={handlePageChange}
          setId={setId}
          setBranchID={setBranchID}
          widthDisplay={widthDisplay}
          heightDisplay={heightDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
          setCurrentItems={setCurrentItems}
          currentItems={currentItems}
          setServicePage={setServicePage}
          setParentID={setParentID}
        />
      );
      break;
    case "subMenu":
      content = (
        <SubMenu
          setSubMenuData={setSubMenuData}
          data={data}
          id={id}
          branchID={branchID}
          setId={setId}
          setCurrentPage={handlePageChange}
          setParentID={setParentID}
          setBranchID={setBranchID}
          setLastID={setLastID}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
          heightDisplay={heightDisplay}
          setServicePage={setServicePage}
          setItemMenuId={setItemMenuId}
        />
      );
      break;
    case "itemMenu":
      content = (
        <ItemMenu
          subMenuData={subMenuData}
          id={id}
          setCurrentPage={handlePageChange}
          setParentID={setParentID}
          setBranchID={setBranchID}
          parendID={parendID}
          branchID={branchID}
          setId={setId}
          lastID={lastID}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
          heightDisplay={heightDisplay}
          setServicePage={setServicePage}
          servicePage={servicePage}
          setLastID={setLastID}
          setParentIdHistory={setParentIdHistory}
          parentIdHistory={parentIdHistory}
        />
      );
      break;
    case "choiceTime":
      content = (
        <ChoiceTime
          id={id}
          setCurrentPage={handlePageChange}
          setParentID={setParentID}
          setBranchID={setBranchID}
          parendID={parendID}
          branchID={branchID}
          setId={setId}
          getTime={setTime}
          getDate={setDate}
          setServiceID={setServiceID}
          token={token}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
          servicePage={servicePage}
          heightDisplay={heightDisplay}
        />
      );
      break;
    case "ticket":
      content = (
        <Ticket
          id={id}
          parendID={parendID}
          branchID={branchID}
          serviceID={serviceID}
          time={time}
          date={date}
          setCurrentPage={handlePageChange}
          token={token}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
        />
      );
      break;
    case "extraNode":
      content = (
        <ExtraNode
          subMenuData={subMenuData}
          id={id}
          setCurrentPage={handlePageChange}
          setParentID={setParentID}
          setBranchID={setBranchID}
          parendID={parendID}
          branchID={branchID}
          setId={setId}
          lastID={lastID}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
          heightDisplay={heightDisplay}
          setServicePage={setServicePage}
          servicePage={servicePage}
          setParentIdHistory={setParentIdHistory}
          parentIdHistory={parentIdHistory}
          itemMenuId={itemMenuId}
        />
      );
      break;
    default:
      break;
  }

  useEffect(() => {
    console.log("window.electronAPI", !!window.electronAPI);
    if (window.electronAPI) {
      console.log(
        "store?.data",
        window.electronAPI.store && window.electronAPI.store.data
      );
      const data = window.electronAPI.store && window.electronAPI.store.data;
      if (data) {
        setConfig(data);
      } else {
        console.error(
          "Could not load config:",
          window.electronAPI.store && window.electronAPI.store.path
        );
        return;
      }

      const configChangedListener = (event, newConfig) => {
        setConfig(newConfig);
      };

      window.electronAPI.onConfigChanged(configChangedListener);

      return () => {
        window.electronAPI.removeListener(
          "config-changed",
          configChangedListener
        );
      };
    } else {
      loadConfig();
    }
  }, []);

  function loadConfig() {
    fetch("config/config.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setConfig(json);
      })
      .catch((error) => {
        console.error("Could not load config:", error);
      });
  }

  useEffect(() => {
    if (config === null) return;

    const apiUrl = `${config.REACT_APP_API_URL}/api/auth/login`;

    const requestBody = {
      login: config.REACT_APP_TEST_LOGIN,
      password: config.REACT_APP_TEST_PASSWORD,
    };

    const headers = {
      Authorization: "Basic Og==",
      "Content-Type": "application/json",
    };

    axios
      .post(apiUrl, requestBody, { headers })
      .then((response) => {
        setToken(response.data.Authorization);
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });

    const width = window.outerWidth;
    const height = window.outerHeight;

    setWidthDisplay(width);
    setHeightDisplay(height);
  }, [config]);

  useEffect(() => {
    if (config === null) return;
    const apiUrl = `${config.REACT_APP_API_URL}/api/terminal/read/service-node/list`;

    const requestBody = {
      branchId: config.BRANCH_ID,
    };

    const headers = {
      Authorization: "Basic Og==",
      "Content-Type": "application/json",
    };

    axios
      .post(apiUrl, requestBody, { headers })
      .then((response) => {
        setData(response.data.res);
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  }, [token]);

  useEffect(() => {
    let newTimer;
    if (showPopupDesktop) {
      newTimer = setTimeout(() => {
        setShowPopupDesktop(false);
        currentItems > 0 ? setCurrentItems(0) : setCurrentPage("main");
      }, config.REACT_APP_TIME_DOWN * 1000);
      setTimer(newTimer);
    }

    return () => {
      if (newTimer) clearTimeout(newTimer);
    };
  }, [showPopupDesktop]);

  const resetTimer = () => {
    setShowPopupDesktop(false);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  return (
    <div
      style={{ maxWidth: "100vw", position: "relative", overflow: "hidden" }}
    >
      <div className="block-content">
        <Header />
        <div
          style={
            widthDisplay > 900
              ? data?.length > 2
                ? {
                    backgroundColor: "#94D500",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }
                : contentStylesDesktop
              : contentStylesTerminal
          }
        >
          {content}
        </div>
      </div>
      <div>
        {showPopupDesktop && (
          <div className="main-popup" onClick={() => resetTimer()}>
            <div className="popup-container">
              <Popup config={config} />
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 5, right: 0 }}>
        <span>{config !== null && config.version_project}</span>
      </div>
    </div>
  );
}

export default App;
