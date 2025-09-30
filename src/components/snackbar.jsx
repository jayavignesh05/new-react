import React, { useEffect } from 'react';
import "./loading.css"


function Snackbar({ message, type, onClose }) {
  // Automatically call the close function after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Cleanup the timer if the component is removed
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`snackbar ${type}`}>
      {message}
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
}

export default Snackbar;