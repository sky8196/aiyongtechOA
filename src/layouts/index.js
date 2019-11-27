import React from 'react';
import '../assets/css/public.css'
// import '../assets/css/base.css'
import Header from './Header';

const BasicLayout = props => {
  return (
    <div>
      <Header pathname={props.location.pathname}/>
      <div className="router-box">{props.children}</div>
      
    </div>
  );
};

export default BasicLayout;
