import React, { useState, useEffect } from "react";
import MainItem from "./MainItem";
import PageTitle from "./pageTitlte/PageTitle";
import {
  styleForNavigateButton,
  titleForNavigateButton,
} from "../constants/styles";
import { Button } from "./buttons/Button";

const Main = ({
  data,
  handleIdChange,
  setCurrentPage,
  setId,
  setLastID,
  setBranchID,
  widthDisplay,
  heightDisplay,
  setShowPopupDesktop,
  config,
  currentItems,
  setCurrentItems,
  setServicePage,
  setParentID,
}) => {
  const [nextPage, setNextPage] = useState(null);
  const itemsPerItem = 6;

  useEffect(() => {
    setParentID(null);
  }, []);

  useEffect(() => {
    if (config !== null) {
      if (widthDisplay > 900 && currentItems > 0) {
        const interval = setInterval(() => {
          setShowPopupDesktop(true);
        }, config.REACT_APP_TIMEOUT_PAGE);

        return () => clearInterval(interval);
      }
    }
  }, [currentItems]);

  useEffect(() => {
    if (data) {
      setNextPage(data);
    }
  }, [data]);

  const handleNext = () => {
    setCurrentItems((prevItems) => prevItems + 1);
  };

  const isMoreItemsAvailable = () => {
    return nextPage && (currentItems + 1) * itemsPerItem < nextPage.length;
  };

  const BackHandler = () => {
    if (currentItems === 2) {
      setCurrentItems(1);
    }
    if (currentItems === 1) {
      setCurrentItems(0);
    }
  };

  return (
    <div
      style={{
        flexGrow: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <div className="block-title">
        <PageTitle title="ВИБЕРІТЬ СПОЖИВАЧА" />
      </div>
      <div className={nextPage?.length > 2 ? "main-menu-item" : ""}>
        <main className="main-size-box">
          {nextPage !== null &&
            nextPage
              .slice(
                currentItems * itemsPerItem,
                (currentItems + 1) * itemsPerItem
              )
              .map((item) => {
                return (
                  <div className="main-space">
                    <MainItem
                      key={item.id}
                      item={item}
                      handleIdChange={handleIdChange}
                      setCurrentPage={setCurrentPage}
                      setId={setId}
                      setLastID={setLastID}
                      setBranchID={setBranchID}
                      widthDisplay={widthDisplay}
                      data={data}
                      heightDisplay={heightDisplay}
                      setServicePage={setServicePage}
                    />
                  </div>
                );
              })}
        </main>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="main-menu-block-button">
          {currentItems * itemsPerItem > 5 ? (
            <div
              onClick={() =>
                BackHandler({ count: currentItems * itemsPerItem })
              }
            >
              <Button>назад</Button>
            </div>
          ) : (
            <div></div>
          )}

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

export default Main;
