import React from 'react';
import PropTypes from 'prop-types';

/** */
const UserLayout = ({ children }) => (
    <>
        {children}
    </>
);
UserLayout.defaultProps = { children: '' };
UserLayout.propTypes = { children: PropTypes.any };

export default UserLayout;
