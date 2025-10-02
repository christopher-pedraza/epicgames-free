import React from 'react';
import { CircleLoader } from 'react-spinners';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loader-container">
            <CircleLoader color="#007bff" size={80} />
        </div>
    );
};

export default LoadingSpinner;