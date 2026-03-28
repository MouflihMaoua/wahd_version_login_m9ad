import React from 'react';

const AnimatedReveal = ({ children, className = '', delay = 0 }) => {
    return (
        <div
            className={`transition-all duration-1000 ease-out opacity-0 translate-y-10 reveal-show ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
            ref={(el) => {
                if (el) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                el.classList.remove('opacity-0', 'translate-y-10');
                                el.classList.add('opacity-100', 'translate-y-0');
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(el);
                }
            }}
        >
            {children}
        </div>
    );
};

export default AnimatedReveal;
