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
import PropTypes from "prop-types";

import {
  
} from "@elastic/eui";

import WzTabSelector from '../util-components/tab-selector';
import WzConfigurationLogCollectionLogs from './log-collection-logs';
import WzConfigurationLogCollectionCommands from './log-collection-commands';
import WzConfigurationLogCollectionSockets from './log-collection-sockets';
import withWzConfig from "../util-hocs/wz-config";

class WzConfigurationLogCollection extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let { currentConfig, agent } = this.props;
    currentConfig = {
      ...currentConfig,
      'logcollector-localfile' : {
        ...currentConfig['logcollector-localfile'],
        'localfile-logs': currentConfig['logcollector-localfile'].localfile.filter(item => item.file),
        'localfile-commands': currentConfig['logcollector-localfile'].localfile.filter(item => item.command)
      }
    }
    return (
      <Fragment>
        <WzTabSelector>
          <div label='Logs'>
            <WzConfigurationLogCollectionLogs currentConfig={currentConfig} agent={agent}/>
          </div>
          <div label='Commands'>
            <WzConfigurationLogCollectionCommands currentConfig={currentConfig} agent={agent}/>
          </div>
          <div label='Sockets'>
          <WzConfigurationLogCollectionSockets currentConfig={currentConfig} agent={agent}/>
          </div>
        </WzTabSelector>
      </Fragment>
    )
  }
}

const sections = [{component:'logcollector',configuration:'localfile'},{component:'logcollector',configuration:'socket'}];

WzConfigurationLogCollection.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withWzConfig(sections)(WzConfigurationLogCollection);