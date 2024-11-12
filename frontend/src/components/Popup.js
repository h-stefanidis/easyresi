import React, { useEffect } from 'react';
const Popup = ({ error, onClose }) => {
    useEffect(() => {
        if (error) {
            // Auto-close the toast after 4 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 10000);
            return () => clearTimeout(timer); // Clear timeout if component unmounts
        }
    }, [error, onClose]);
    if (!error) return null; // Don't render if there's no error
    return (
        <div className="popup">
            <span>{error}</span>
            <button className="popup-close" onClick={onClose}>×</button>
        </div>
    );
}
export default Popup;