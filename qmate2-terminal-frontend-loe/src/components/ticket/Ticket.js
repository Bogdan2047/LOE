import { useEffect, useState, useRef } from "react";
import axios from "axios";
import NoTime from "../noTime/NoTime";
import html2canvas from "html2canvas";
import Loading from "../loading/Loading";
import PageTitle from "../pageTitlte/PageTitle";
import Popup from "../popup/popup";

import {
  styleButtonMainMenu,
  titleForNavigateButton,
} from "../../constants/styles";

function calculateLRCBytes(str) {
  var bytes = new TextEncoder().encode(str);
  var LRC = 0;
  for (var i = 0; i < bytes.length; i++) {
    LRC ^= bytes[i];
  }
  return LRC.toString(16);
}

const Ticket = ({
  id,
  branchID,
  serviceID,
  date,
  time,
  parendID,
  setCurrentPage,
  token,
  widthDisplay,
  setShowPopupDesktop,
  config,
}) => {
  const [title, setTitle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [fieldList, setFieldList] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [showNoTicket, setShowNoTicket] = useState(false);

  const [errorOutOfPaper, setErrorOutOfPaper] = useState(undefined);

  const componentRef = useRef();

  function generateJPEG(html) {
    return new Promise((resolve, reject) => {
      var container = document.getElementById("printContainer");
      container.innerHTML = html;

      if (widthDisplay > 476) {
        const img = document.querySelector(".root > img");
        img.style.marginLeft = "120px;";
        img.style.marginTop = "15px";
      }

      if (widthDisplay < 476) {
        const img = document.querySelector(".root > img");
        if (img) {
          // Проверка, что img не null или undefined
          img.style.height = "30px";
          img.style.marginLeft = "62px";
          img.style.marginTop = "15px";
        }

        const paragraphs = document.querySelectorAll(".root .center-row p");
        paragraphs.forEach((el) => {
          if (el) {
            // Проверка на наличие элементов
            el.style.fontSize = "12px";
            el.style.marginTop = 0;
            el.style.lineHeight = 1;
            el.style.paddingBottom = "3px";
          }
        });

        const spans = document.querySelectorAll(".root .center-row p span");
        if (spans.length > 0) {
          // Проверка, что spans содержит элементы
          // Ваш код изменения стилей для spans
          spans[0].style.fontSize = "25px";
          spans[0].style.lineHeight = 1;

          if (spans.length >= 5) {
            // Убедитесь, что есть достаточно элементов
            spans[1].style.fontSize = "12px";
            spans[4].style.fontSize = "25px";
            spans[4].style.lineHeight = 1;
          }
        }

        const spanBottom = document.querySelectorAll(
          ".root .bottom-row p span"
        );
        if (spanBottom.length > 1) {
          // Проверка на наличие элементов
          spanBottom[0].style.fontSize = "12px";
          spanBottom[0].style.lineHeight = 1;
          spanBottom[1].style.fontSize = "8px";
          spanBottom[1].style.lineHeight = 1;
        }

        const hrs = document.querySelectorAll(".root .center-row hr");
        if (hrs.length > 4) {
          // Убедитесь, что есть достаточно элементов
          hrs[3].style.display = "none";
          hrs[4].style.display = "none";
        }
      }

      var width = container.offsetWidth;
      var height = container.offsetHeight;

      html2canvas(container, { width: width, height: height })
        .then(function (canvas) {
          var imageBase64 = canvas.toDataURL("image/jpeg");
          resolve(imageBase64);

          if (widthDisplay > 1300 && window.electronAPI === undefined) {
            let printWindow = window.open("", "_blank");

            const scaledWidth = canvas.width * 0.7;
            const scaledHeight = canvas.height * 0.7;

            const marginLeft = (window.innerWidth - scaledWidth) / 2;
            const marginTop = (window.innerHeight - scaledHeight) / 2;

            printWindow.document.write(
              `<html><body style="text-align: center; padding-top: ${marginTop}px;"><img src='${imageBase64}' width='${scaledWidth}' height='${scaledHeight}'/></body></html>`
            );
            printWindow.document.close();
            printWindow.focus();

            printWindow.onload = function () {
              printWindow.print();
              printWindow.close();
            };
          }
        })
        .catch(function (error) {
          console.error("Error in html2canvas", error);
          reject(error);
        });
    });
  }

  useEffect(() => {
    if (config != null) {
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
  }, []);

  useEffect(() => {
    subMenu?.map((item) => {
      if (item.id === id) {
        setTitle(item.title);
      }
    });
  }, [subMenu]);

  useEffect(() => {
    if (config != null) {
      if (token === null) return;

      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      const data = {
        id: serviceID,
      };

      axios
        .post(
          `${config.REACT_APP_API_URL}/api/queue-config/read/service-ticketfield/list`,
          data,
          { headers }
        )
        .then((response) => {
          const inputArray = response.data.res;
          const transformedArray = inputArray.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.name,
          }));
          setFieldList(transformedArray);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [serviceID, token]);

  useEffect(() => {
    if (config != null) {
      if (fieldList === null || token === null) return;

      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      const data = {
        branchId: branchID,
        serviceId: serviceID,
        date: date,
        startTime: time,
        fieldList: fieldList,
      };

      axios
        .post(
          `${config.REACT_APP_API_URL}/api/pre-registration/v2/create/ticket`,
          data,
          { headers }
        )
        .then((response) => {
          setTicket(response.data);
          getPrintTicketData(response.data && response.data.ticketId);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [branchID, serviceID, date, time, fieldList, token]);

  const getPrintTicketData = (ticketId) => {
    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(
        `${config.REACT_APP_API_URL}/api/terminal/read/printer-ticket-data`,

        {
          ticketId: ticketId,
        },
        headers
      )
      .then((response) => {
        print(response.data.res);
      })
      .catch((e) => console.log("error", e.message));
  };

  const prepareTicketLayout = function (res) {
    if (!res) return;
    const textModel = res.textModel;
    const view = res.view;
    const imageModel = res.imageModel;

    let decodedView = b64DecodeUnicode(view);
    // replace placeholders
    for (var key in textModel) {
      if (decodedView.indexOf(key) >= 0) {
        let value = null;
        value = textModel[key];
        decodedView = decodedView.replace("${" + key + "}", " " + value + " ");
      }
    }

    // past logo
    if (imageModel && imageModel.img) {
      decodedView = decodedView.replace(
        "${img}",
        "data:image/png;base64," + imageModel.img
      );
    }

    return {
      data: decodedView,
      height: getHeightIframe(textModel.serviceTitle ?? ""),
    };
  };

  function getHeightIframe(str) {
    if (str.length <= 40) {
      return 350;
    } else if (str.length > 40 && str.length <= 60) {
      return 370;
    } else if (str.length > 60 && str.length <= 80) {
      return 390;
    } else {
      return 390;
    }
  }

  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  function removePrefix(base64Image) {
    var prefix = "data:image/jpeg;base64,";
    if (base64Image.startsWith(prefix)) {
      return base64Image.slice(prefix.length);
    }
    return base64Image;
  }

  const print = (data) => {
    const headers = {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Headers": "Content-Type, Authorization",
    };
    const html = prepareTicketLayout(data);

    generateJPEG(html.data)
      .then((base64code) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 384;
          canvas.height = (384 / image.width) * image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const resizedImageCode = canvas.toDataURL("image/jpeg");
          const receipt = `<receipt><image>${removePrefix(
            resizedImageCode
          )}</image></receipt>`;
          const payload =
            widthDisplay < 801
              ? {
                  method: "PRT",
                  step: 0,
                  reference: "000000000000000000000000000000000001",
                  params: {
                    receipt: receipt,
                    lrc: calculateLRCBytes(receipt),
                  },
                }
              : Object.assign({}, data);
          const promise =
            widthDisplay < 801
              ? config !== null &&
                fetch(`${config.REACT_APP_VERIFONE_PRINT_URL}/api/print`, {
                  headers,
                  method: "post",
                  mode: "no-cors",
                  body: JSON.stringify(payload),
                })
              : axios.post(
                  config !== null &&
                    `${config.REACT_APP_LOCAL_URL}/api/printer/print`,
                  payload,
                  {
                    headers,
                    timeout:
                      config !== null && config.REACT_APP_TIMEOUT_PRINT_REQUEST
                        ? config !== null &&
                          +config.REACT_APP_TIMEOUT_PRINT_REQUEST
                        : 10000,
                  }
                );

          promise
            .then((res) => {
              if (res.status === 405) {
                setErrorOutOfPaper(true);
              }
              if (res.status === 200) {
                setErrorOutOfPaper(false);
              }
              if (res.status !== 200) {
                throw new Error("Error print ticket");
              }
              return res;
            })
            .catch((e) => console.log("error", e.message));
        };
        image.src = base64code;
      })
      .catch((error) => {
        console.error("error", error.message);
      });
  };

  useEffect(() => {
    if (config !== null) {
      const timer = setTimeout(() => {
        setShowNoTicket(true);
      }, config.REACT_APP_ERROR_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, []);

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
        flexGrow: 1,
      }}
      onClick={resetTimer}
    >
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
      {ticket ? (
        <>
          <div className="block-title">
            <div className="space-page-title">
              <PageTitle title="ОТРИМАЙТЕ ТАЛОН" />
            </div>
            <div className="space-for-title-ticket">
              <div className="block-title-item">
                <span className="title-item">
                  {title !== null && title.length > 50
                    ? title.slice(0, 50) + "..."
                    : title}
                </span>
              </div>
            </div>
          </div>
          <div
            style={
              widthDisplay > 900
                ? {
                    paddingTop: "20px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: 1,
                  }
                : {}
            }
          >
            <div ref={componentRef} className="ticket-block">
              <div id="printContainer" className="print-containerA"></div>
            </div>
          </div>

          {errorOutOfPaper === true ? (
            <div className="error-message-for-print">
              <span className="error-message-for-print-title">
                НАЖАЛЬ СТАЛАСЯ ПОМИЛКА ДРУКУ, СФОТОГРАФУЙТЕ ЦЕЙ ТАЛОН ТА
                ПОКАЖІТЬ ФОТО СПІВРОБІТНИКУ
              </span>
            </div>
          ) : (
            <div className="block-button-ticket-page">
              <div
                style={{
                  width: "90%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
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
          )}
        </>
      ) : showNoTicket ? (
        <NoTime
          title={title}
          id={id}
          branchId={branchID}
          currentID={id}
          setCurrentPage={setCurrentPage}
          widthDisplay={widthDisplay}
          setShowPopupDesktop={setShowPopupDesktop}
          config={config}
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Ticket;
