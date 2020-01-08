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

import WzNoConfig from '../util-components/no-config';
import WzConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import WzConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import { isString, renderValueNoThenEnabled } from '../utils/utils';

import { connect } from 'react-redux';

const mainSettings = [
  { field: 'disabled', label: 'Status of this active response', render: renderValueNoThenEnabled },
  { field: 'command', label: 'Command to execute' },
  { field: 'location', label: 'Execute the command on this location' },
  { field: 'agent_id', label: 'Agent ID on which execute the command' },
  { field: 'level', label: 'Match to this severity level or above' },
  { field: 'rules_group', label: 'Match to one of these groups' },
  { field: 'rules_id', label: 'Match to one of these rule IDs' },
  { field: 'timeout', label: 'Timeout (in seconds) before reverting' }
];

const helpLinks = [
  { text: 'Active response documentation', href: 'https://documentation.wazuh.com/current/user-manual/capabilities/active-response/index.html' },
  { text: 'Active response reference', href: 'https://documentation.wazuh.com/current/user-manual/reference/ossec-conf/active-response.html' }
];

class WzConfigurationActiveResponseActiveResponse extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const { currentConfig, wazuhNotReadyYet } = this.props;
    const items = currentConfig['analysis-active_response']['active-response'].map((item, key) => ({
      button: item.command,
      data: item
    }))
    return (
      <Fragment>
        {currentConfig['analysis-active_response'] && isString(currentConfig['analysis-active_response']) && (
          <WzNoConfig error={currentConfig['analysis-active_response']} help={helpLinks} />
        )}
        {currentConfig['analysis-active_response'] && !isString(currentConfig['analysis-active_response']) && currentConfig['analysis-active_response']['active-response'] && !currentConfig['analysis-active_response']['active-response'].length && (
          <WzNoConfig error='not-present' help={helpLinks} />
        )}
        {wazuhNotReadyYet && (!currentConfig || !currentConfig['analysis-active_response']) && (
          <WzNoConfig error={currentConfig['com-active-response']} help={helpLinks} />
        )}
        {currentConfig['analysis-active_response'] && !isString(currentConfig['analysis-active_response']) && currentConfig['analysis-active_response']['active-response'].length ? (
          <WzConfigurationSettingsTabSelector
            title='Active response settings'
            description='Find here all the currently defined Active responses'
            currentConfig={currentConfig['analysis-active_response']['active-response']}
            helpLinks={helpLinks}>
            <WzConfigurationSettingsListSelector
              items={items}
              settings={mainSettings}
            />
          </WzConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  wazuhNotReadyYet: state.configurationReducers.wazuhNotReadyYet
});

export default connect(mapStateToProps)(WzConfigurationActiveResponseActiveResponse);