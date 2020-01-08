/*
* Wazuh app - React component for registering agents.
* Copyright (C) 2015-2020 Wazuh, Inc.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* Find more information about this on the LICENSE file.
*/

import React, { Component, Fragment } from "react";
import Proptypes from "prop-types";

import {
  
} from "@elastic/eui";

const withWodle = (wodle) => (WrappedComponent) => {
  class WithWodle extends Component{
    constructor(props){
      super(props);
    }
    render(){
      return (
        <WrappedComponent {...this.props}/>
      )
    }
  }
  return WithWodle
}

export default Wodle;