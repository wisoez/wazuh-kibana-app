/*
 * Wazuh app - React component for registering agents.
 * Copyright (C) 2015-2019 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { cleanFileContent } from '../../../../../redux/actions/groupsActions';
import validateConfigAfterSent from './utils/valid-configuration';

// Eui components
import {
  EuiPage,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiToolTip,
  EuiButtonIcon,
  EuiButton,
  EuiCodeEditor,
  EuiPanel,
  EuiCodeBlock,
} from '@elastic/eui';

import GroupsHandler from './utils/groups-handler';

import { toastNotifications } from 'ui/notify';

class WzGroupsEditor extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.codeEditorOptions = {
      fontSize: '14px',
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    };
    this.groupsHandler = GroupsHandler;
    const { fileContent, itemDetail } = this.props.state;
    const { name, content, isEditable } = fileContent;

    this.state = {
      error: false,
      isSaving: false,
      content,
      name,
      isEditable,
      nameGroup: itemDetail.name,
    };
  }

  componentWillUnmount() {
    // When the component is going to be unmounted its info is clear
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  /**
   * Save the new content
   * @param {String} name
   * @param {Boolean} overwrite
   */
  async save(name) {
    if (!this._isMounted) {
      return;
    }
    try {
      const { content, nameGroup } = this.state;
      this.setState({ isSaving: true, error: false });
      let saver = this.groupsHandler.sendGroupConfiguration; // By default the saver is for rules
      await saver(name, nameGroup, content);
      try {
        await validateConfigAfterSent();
      } catch (error) {
        const warning = Object.assign(error, {
          savedMessage: `File ${name} saved, but there were found several error while validating the configuration.`,
        });
        this.setState({ isSaving: false });
        this.showToast('warning', warning.savedMessage, warning.details, 3000);
        return;
      }
      this.setState({ isSaving: false });
      const textSuccess = 'File successfully edited';
      this.showToast('success', 'Success', textSuccess, 3000);
    } catch (error) {
      this.setState({ error, isSaving: false });
      this.showToast('danger', 'Error', 'Error saving group configuration: ' + error, 3000);
    }
  }

  showToast = (color, title, text, time) => {
    toastNotifications.add({
      color: color,
      title: title,
      text: text,
      toastLifeTimeMs: time,
    });
  };

  render() {
    const { itemDetail } = this.props.state;
    const { name, content, isEditable } = this.state;

    const saveButton = (
      <EuiButton
        fill
        iconType="save"
        isLoading={this.state.isSaving}
        isDisabled={name.length <= 4}
        onClick={() => this.save(name, itemDetail.name, content)}
      >
        Save
      </EuiButton>
    );

    return (
      <EuiPage style={{ background: 'transparent' }}>
        <EuiPanel>
          <EuiFlexGroup>
            <EuiFlexItem>
              {/* File name and back button */}
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle>
                    <h2>
                      <EuiToolTip position="right" content={`Back to groups`}>
                        <EuiButtonIcon
                          aria-label="Back"
                          color="subdued"
                          iconSize="l"
                          iconType="arrowLeft"
                          onClick={() => this.props.cleanFileContent()}
                        />
                      </EuiToolTip>
                      {name}
                    </h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem />
                {/* This flex item is for separating between title and save button */}
                {isEditable && <EuiFlexItem grow={false}>{saveButton}</EuiFlexItem>}
              </EuiFlexGroup>
              <EuiSpacer size="m" />
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      {(isEditable && (
                        <EuiCodeEditor
                          width="100%"
                          height="calc(100vh - 250px)"
                          value={content}
                          onChange={newContent => this.setState({ content: newContent })}
                          mode="xml"
                          isReadOnly={false}
                          setOptions={this.codeEditorOptions}
                          aria-label="Code Editor"
                        ></EuiCodeEditor>
                      )) || (
                        <EuiCodeBlock language="xml" fontSize="m" paddingSize="m" isCopyable>
                          {content}
                        </EuiCodeBlock>
                      )}
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.groupsReducers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cleanFileContent: () => dispatch(cleanFileContent()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WzGroupsEditor);
