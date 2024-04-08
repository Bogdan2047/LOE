import config from "../configStyle/configStyle.json";

let widthScreen = window.innerWidth;
let heightScreen = window.innerHeight;

const updateScreenSize = () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  if (newWidth > widthScreen) {
    widthScreen = newWidth;
  }

  if (newHeight > heightScreen) {
    heightScreen = newHeight;
  }
};

window.addEventListener("resize", updateScreenSize);

export const contentStylesDesktop = {
  backgroundColor: config.backgroundColorDesktop,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const contentStylesTerminal = {
  backgroundColor: config.backgroundColorTerminal,
  display: "block",
};

export const buttonStylesForDesktop = {
  width: widthScreen > 1238 ? "600px" : "450px",
  height:
    heightScreen > 900 ? (heightScreen > 1000 ? "160px" : "140px") : "110px",
  borderRadius: "30px",
  backgroundColor: config.backgroundColorButtonList,
  border: config.borderColorForButtonList,
};

export const buttonTimeStylesForDesktop = {
  width: widthScreen > 1238 ? "300px" : "220px",
  height: heightScreen > 900 ? "110px" : "110px",
  borderRadius: "30px",
  backgroundColor: config.backgroundColorButtonList,
  border: config.borderColorForButtonList,
};

export const fontForButtonList = {
  fontWeight: config.weightSizeForButtonList,
  fontSize: config.textSizeForButtonList,
  color: config.colorForButtonList,
};

export const fontForButtonItemMenu = {
  fontWeight: config.weightSizeForButtonListMenuItem,
  fontSize: config.fontSizeForButtonListMenuItem,
  color: config.colorForButtonListMenuItem,
};

export const styleForNavigateButton = {
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  minHeight: "25px",
  backgroundColor: config.backgroundForNavigateButton,
  borderRadius: "16px",
  width: "300px",
  height: heightScreen > 900 ? "83px" : "73px",
  textTransform: "capitalize",
  borderStyle: "none",
};

export const titleForNavigateButton = {
  fontSize: config.fontSizeForNavigateButton,
  fontWeight: config.fontWeightForNavigateButton,
  color: config.colorForNavigateButton,
};

export const styleButtonMainMenu = {
  borderStyle: "none",
  width: "300px",
  height: "83px",
  borderRadius: "16px",
  backgroundColor: config.backgroundForNavigateButton,
  color: config.colorForNavigateButton,
  textAlign: "center",
};
