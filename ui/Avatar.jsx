import React from 'react';

const Avatar = ({ name, size = 44, radius = 14, style = {} }) => {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

    const soraFont = "'Sora', 'Segoe UI', system-ui, sans-serif";

    return (
        <div style={{
            width: size, height: size, borderRadius: radius,
            background: `hsl(${hue},55%,50%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontFamily: soraFont,
            fontWeight: 900,
            fontSize: size * 0.33,
            flexShrink: 0,
            userSelect: 'none',
            ...style,
        }}>
            {initials}
        </div>
    );
};

export default Avatar;
