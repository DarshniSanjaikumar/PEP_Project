import ReactDOM from "react-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/Meteor.json";

const Loader = ({ page = "page" }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-96 h-96">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-white animate-pulse tracking-wide">
          Loading {page}...
        </h1>
      </div>
    </div>,
    document.body
  );
};

export default Loader;