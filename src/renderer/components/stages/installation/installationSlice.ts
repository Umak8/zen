/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface InstallationState {
  installationStatus: boolean;
  installationArgs: {
    installationDir: string;
    workspaceDir: string;
    logDir: string,
    extensionDir: string,
    installationType?: string;
    downloadDir: string;
    userUploadedPaxPath?: string;
    smpeDir?: string;
    javaHome: string;
    nodeHome: string;
    setupConfig: any;
    jobName: string;
    jobPrefix: string;
    rbacProfile: string;
    cookieId: string;
    zosmfHost: string,
    zosmfPort: string,
    zosmfApplId: string
  };
  zoweVersion: string;
  licenseAgreement: boolean;
  smpeDirValid: boolean;
}

const initialState: InstallationState = {
  installationStatus: false,
  installationArgs: {
    installationDir: '',
    workspaceDir: '',
    logDir:'',
    extensionDir:'',
    installationType: 'download',
    userUploadedPaxPath: '',
    smpeDir: '',
    downloadDir: '',
    javaHome: '',
    nodeHome: '',
    setupConfig: {},
    jobName: 'ZWE1SV',
    jobPrefix: 'ZWE1',
    rbacProfile: '1',
    cookieId: '1',
    zosmfHost: '',
    zosmfPort: '443',
    zosmfApplId: 'IZUDFLT'
  },
  zoweVersion: '',
  licenseAgreement: false,
  smpeDirValid: false,
};

export const installationSlice = createSlice({
  name: 'installation',
  initialState,
  reducers: {
    setInstallationArgs: (state, action: PayloadAction<any>) => {
      state.installationArgs = action.payload;
    },
    setInstallationStatus: (state, action: PayloadAction<boolean>) => {
      state.installationStatus = action.payload;
    },
    setZoweVersion: (state, action: PayloadAction<string>) => {
      state.zoweVersion = action.payload;
    },
    setInstallationType: (state, action: PayloadAction<string>) => {
      state.installationArgs.installationType = action.payload;
    },
    setSmpeDir: (state, action: PayloadAction<string>) => {
      state.installationArgs.smpeDir = action.payload;
    },
    setLicenseAgreement: (state, action: PayloadAction<boolean>) => {
      state.licenseAgreement = action.payload;
    },
    setSmpeDirValid: (state, action: PayloadAction<boolean>) => {
      state.smpeDirValid = action.payload;
    },
  }
});

export const { setInstallationArgs, setInstallationStatus, setZoweVersion, setInstallationType, setSmpeDir, setLicenseAgreement, setSmpeDirValid} = installationSlice.actions;

export const selectInstallationArgs = (state: RootState) => state.installation.installationArgs;
export const selectZoweVersion = (state: RootState) => state.installation.zoweVersion;
export const selectInstallationStatus = (state: RootState) => state.installation.installationStatus;
export const selectInstallationType = (state: RootState) => state.installation.installationArgs.installationType;
export const selectSmpeDir = (state: RootState) => state.installation.installationArgs.smpeDir;
export const selectLicenseAgreement = (state: RootState) => state.installation.licenseAgreement;
export const selectSmpeDirValid = (state: RootState) => state.installation.smpeDirValid;

export default installationSlice.reducer;
