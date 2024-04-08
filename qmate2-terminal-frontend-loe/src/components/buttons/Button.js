import { useEffect, useState } from "react";
import "./button.css";
import {
  styleForNavigateButton,
  titleForNavigateButton,
} from "../../constants/styles";

export const Button = ({ children }) => {
  const [widthDisplay, setWidthDisplay] = useState(null);

  useEffect(() => {
    const width = window.outerWidth;
    setWidthDisplay(width);
  }, []);

  return (
    <div>
      {widthDisplay > 900 ? (
        <button style={styleForNavigateButton}>
          <span style={titleForNavigateButton}>{children}</span>
        </button>
      ) : (
        <button className="button-main">
          <span className="title-button-back">{children}</span>
        </button>
      )}
    </div>
  );
};
