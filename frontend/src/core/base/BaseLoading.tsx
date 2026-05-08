import React from 'react'

/* https://loading.io/css/ */
const BaseLoading: React.FC = () => {
    return (
        <div className="linear-progress-wrapper">
            <div className="linear-progress-bar"></div>
        </div>
    );
}

export default BaseLoading;