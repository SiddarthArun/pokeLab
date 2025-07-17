import ReactDom from "react-dom";

function Modal({ children, onClose }) {
  return ReactDom.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          display:"flex"
        }}
      >
        {children}
        <button onClick={onClose} style={{ height:'35px'}}>
          X
        </button>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
