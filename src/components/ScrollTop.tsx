import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

type ScrollTopProps = {
    children?: React.ReactNode;
};

const ScrollTop = ({ children }: ScrollTopProps) => {
    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, [pathname]);

    return children || null;
};

ScrollTop.propTypes = {
    children: PropTypes.node,
};

export default ScrollTop;
