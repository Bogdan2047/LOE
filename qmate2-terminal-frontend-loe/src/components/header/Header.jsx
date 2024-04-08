import React from "react";
import "./header.css";

function Header() {
  return (
    <div>
      <div className="header-terminal">
        <header
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            height: "96px",
            left: "0px",
            top: "0px",
            backgroundColor: "#FFF",
          }}
        >
          <img
            // Here is relative path to images without first slash
            src={"assets/headerVector.svg"}
            alt="VECTOR"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <img
            // Here is relative path to images without first slash
            src={"assets/headerFixed.png"}
            alt="LOGO"
            className="logo-img"
          />
        </header>
      </div>
      <div className="header-desktop">
        <img src={"assets/logoLOE.svg"} alt="" className="logoLOE" />
      </div>
    </div>
  );
}

export default Header;
