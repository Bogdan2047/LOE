import "./pageTitle.css";

const PageTitle = ({ title }) => {
  return (
    <div className="component-title">
      <h1 className="title-style">{title}</h1>
      <div className="line-for-title" />
    </div>
  );
};

export default PageTitle;
