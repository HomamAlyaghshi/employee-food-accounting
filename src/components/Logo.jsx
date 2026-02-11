import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
    return (
        <div className={`logo ${className}`}>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 120 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Arabic "يلا فطور" text */}
                <text 
                    x="60" 
                    y="25" 
                    textAnchor="middle" 
                    fontFamily="Arial, sans-serif" 
                    fontSize="18" 
                    fontWeight="bold" 
                    fill="#FF5A3C"
                >
                    يلا فطور
                </text>
                
                {/* English "Yalla Breakfast" text */}
                <text 
                    x="60" 
                    y="38" 
                    textAnchor="middle" 
                    fontFamily="Arial, sans-serif" 
                    fontSize="10" 
                    fill="#1F2937"
                >
                    Yalla Breakfast
                </text>
                
                {/* Breakfast icon */}
                <g transform="translate(15, 8)">
                    {/* Plate */}
                    <ellipse cx="5" cy="8" rx="6" ry="2" fill="#FBBF24" opacity="0.8"/>
                    
                    {/* Egg */}
                    <circle cx="5" cy="6" r="3" fill="#FFFFFF"/>
                    <circle cx="5" cy="6" r="2.5" fill="#FF5A3C"/>
                    
                    {/* Toast/Bread */}
                    <rect x="2" y="4" width="6" height="1" rx="0.5" fill="#8B4513"/>
                    
                    {/* Steam lines */}
                    <path d="M 3 3 L 3 1" stroke="#FF5A3C" strokeWidth="1" opacity="0.6"/>
                    <path d="M 5 3 L 5 1" stroke="#FF5A3C" strokeWidth="1" opacity="0.6"/>
                    <path d="M 7 3 L 7 1" stroke="#FF5A3C" strokeWidth="1" opacity="0.6"/>
                </g>
            </svg>
        </div>
    );
};

export default Logo;
