import React from "react";

const BaseProcessLoading: React.FC = () => {
    
    return (
        <div className="base-process-loading-overlay">
            <div className="lds-circle-loading">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} />
                ))}
            </div>
        </div>
    );
};

export default BaseProcessLoading;