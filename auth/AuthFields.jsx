import React from 'react';

const icons = {
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
};

export function InputField({ label, type = 'text', name, value, onChange, onBlur, error, touched, placeholder, right, extraClass = '', addon }) {
    const isValid = touched && value && !error;
    const isErr = touched && !!error;
    const cls = `auth-input ${isValid ? 'valid' : isErr ? 'invalid' : ''} ${extraClass}`;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', letterSpacing: '0.01em' }}>{label}</label>
            <div className="field-wrap" style={{ position: 'relative' }}>
                {addon && <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>{addon}</span>}
                <input
                    type={type} value={value} name={name}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={cls}
                    style={addon ? { paddingLeft: 38 } : {}}
                />
                <span className="icon-right" style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', gap: 4
                }}>
                    {isValid && <span style={{ color: '#22c55e' }}>{icons.check}</span>}
                    {right}
                </span>
            </div>
            {isErr && (
                <span style={{ fontSize: 12, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
}

export function SelectField({ label, value, onChange, onBlur, error, touched, options, placeholder }) {
    const isValid = touched && value && !error;
    const isErr = touched && !!error;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', letterSpacing: '0.01em' }}>{label}</label>
            <select
                value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur}
                className={`auth-input auth-select ${isValid ? 'valid' : isErr ? 'invalid' : ''}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B0BAC9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    backgroundSize: '16px',
                    paddingRight: '42px',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                }}
            >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {isErr && <span style={{ fontSize: 12, color: '#f43f5e' }}>{error}</span>}
        </div>
    );
}
