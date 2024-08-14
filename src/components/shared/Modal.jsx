import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 h-screen w-[600px] max-[1080px]:w-full flex justify-center items-center z-[55] bg-black opacity-60"
      onClick={props.onCancel}
    ></div>
  );
};

const Overlay = (props) => {
  return (
    <motion.div
      initial={{ x: "-50%", y: "40%", opacity: 0 }}
      animate={{ x: "-50%", y: "0%", opacity: 1 }}
      exit={{ x: "-50%", y: "55%", opacity: 0 }}
      transition={{ duration: 0.2, type: "spring" }}
      className="fixed left-1/2 bottom-0 transform -translate-x-1/2 z-[60] w-[600px] max-w-full overflow-hidden"
    >
      {props.children}
    </motion.div>
  );
};

const Modal = (props) => {
  const backdropElement = document.querySelector("#backdrop-root");
  const overlayElement = document.querySelector("#overlay-root");

  return (
    <>
      {createPortal(<Backdrop onCancel={props.onCancel} />, backdropElement)}
      {createPortal(
        <Overlay state={props.state} onCancel={props.onCancel}>
          {props.children}
        </Overlay>,
        overlayElement
      )}
    </>
  );
};

export default Modal;
