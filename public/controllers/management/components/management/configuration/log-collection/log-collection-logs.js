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

import WzNoConfig from "../util-components/no-config";
import WzConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import WzConfigurationListSelector from '../util-components/configuration-settings-list-selector';
import { isString, renderValueOrDefault, renderValueOrNoValue } from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';
import helpLinks from './help-links';

const mainSettings = [
  { field: 'logformat', label: 'Log format', render: renderValueOrNoValue },
  { field: 'file', label: 'Log location', render: renderValueOrNoValue },
  { field: 'labels', label: 'Only receive logs occured after start', render: renderValueOrNoValue },
  { field: 'target', label: 'Redirect output to this socket', render: renderValueOrDefault('agent') },
];

class WzConfigurationLogCollectionLogs extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const { currentConfig } = this.props;
    const items = settingsListBuilder(currentConfig['logcollector-localfile']['localfile-logs'], 'file');
    return (
      <Fragment>
        {currentConfig['logcollector-localfile'] && isString(currentConfig['logcollector-localfile']) && (
          <WzNoConfig error={currentConfig['logcollector-localfile']} help={helpLinks}/>
          )}
        {currentConfig['logcollector-localfile'] && !isString(currentConfig['logcollector-localfile']) && !(currentConfig['logcollector-localfile']['localfile-logs'] || []).length ? (
          <WzNoConfig error='not-present' help={helpLinks}/>
        ) : null}
        {currentConfig['logcollector-localfile'] && !isString(currentConfig['logcollector-localfile']) && currentConfig['logcollector-localfile']['localfile-logs'] && currentConfig['logcollector-localfile']['localfile-logs'].length ? (
          <WzConfigurationSettingsTabSelector
          title='Logs files'
          description='List of log files that will be analyzed'
          currentConfig={currentConfig}
          helpLinks={helpLinks}>
            <WzConfigurationListSelector
              items={items}
              settings={mainSettings}
            />
          </WzConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    )
  }
}

export default WzConfigurationLogCollectionLogs;