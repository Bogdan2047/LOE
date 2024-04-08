import { Button } from "../buttons/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import TimeItem from "./TimeItem";
import PageTitle from "../pageTitlte/PageTitle";
import Popup from "../popup/popup";
import "./choiceTime.css";
import {
  styleForNavigateButton,
  titleForNavigateButton,
} from "../../constants/styles";

const ChoiceTime = ({
  setCurrentPage,
  setParentID,
  setBranchID,
  id,
  branchID,
  setId,
  parendID,
  setServiceID,
  getDate,
  getTime,
  token,
  widthDisplay,
  setShowPopupDesktop,
  servicePage,
  config,
  heightDisplay,
}) => {
  const [title, setTitle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [dates, setDates] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [currentItems, setCurrentItems] = useState(0);
  const itemsPerItem = heightDisplay < 950 ? 12 : 16;

  useEffect(() => {
    subMenu?.map((item) => {
      if (item.id === id) {
        setTitle(item.title);
        setBranchId(item.branchId);
        setServiceId(item.serviceId);
      }
    });
  }, [subMenu]);

  useEffect(() => {
    if (config !== null) {
      const apiUrl = `${config.REACT_APP_API_URL}/api/terminal/read/service-node/list`;

      const requestBody = {
        parentId: parendID,
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
  }, [config]);

  useEffect(() => {
    if (config !== null) {
      if (branchId === null || serviceId === null) return;

      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      const data = {
        branchId: branchId,
        serviceId: serviceId,
      };

      axios
        .post(
          `${config.REACT_APP_API_URL}/api/pre-registration/v2/read/date/list`,
          data,
          { headers }
        )
        .then((response) => {
          const res = response.data;
          const dataArray = Object.keys(res).map((key) => res[key])[0];
          setDates(dataArray);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [branchId, serviceId]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const currentDateExists = dates?.includes(today);

    if (currentDateExists !== true) {
      setDate(today);
    }
  }, [dates]);

  useEffect(() => {
    if (config !== null) {
      if (branchId === null || serviceId === null || date === null) return;

      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      const data = {
        branchId: branchId,
        serviceId: serviceId,
        date: date,
      };

      axios
        .post(
          `${config.REACT_APP_API_URL}/api/pre-registration/v2/read/time/list`,
          data,
          { headers }
        )
        .then((response) => {
          const res = response.data;
          const dataArray = Object.keys(res).map((key) => res[key])[0];
          setTime(dataArray);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [branchId, serviceId, date]);

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

  const backHandler = () => {
    if (currentItems > 0) {
      setCurrentItems(currentItems - 1);
    }
    if (currentItems === 0) {
      if (servicePage >= 4) {
        setId(parendID);
        setCurrentPage("extraNode");
      }
      if (servicePage === 3) {
        setId(parendID);
        setCurrentPage("itemMenu");
      }

      if (servicePage === 2) {
        setId(parendID);
        setCurrentPage("subMenu");
      }
      if (servicePage === 1) {
        setId(parendID);
        setCurrentPage("main");
      }
    }
  };

  const handleNext = () => {
    setCurrentItems((prevItems) => prevItems + 1);
  };

  const isMoreItemsAvailable = () => {
    return time && (currentItems + 1) * itemsPerItem < time.length;
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        flexGrow: 1,
      }}
      onClick={resetTimer}
    >
      <div
        style={{
          width: "100%",
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
          position: "relative",
          flexGrow: 1,
        }}
      >
        <div className="block-title">
          <PageTitle title="ВИБЕРІТЬ ЧАС" />
          <div className="space-block-title-item">
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
        <div className="block-choiceTime">
          <TimeItem
            time={time}
            id={parendID}
            setId={setId}
            currentID={id}
            branchId={branchId}
            serviceId={serviceId}
            setCurrentPage={setCurrentPage}
            setParentID={setParentID}
            setBranchID={setBranchID}
            date={date}
            getTime={getTime}
            getDate={getDate}
            setServiceID={setServiceID}
            resetTimer={resetTimer}
            currentItems={currentItems}
            itemsPerItem={itemsPerItem}
            widthDisplay={widthDisplay}
            config={config}
          />
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
        <div className="button-for-choiceTime">
          <div onClick={() => backHandler()}>
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

export default ChoiceTime;
