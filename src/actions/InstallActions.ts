/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { IIpcConnectionArgs, IResponse } from '../types/interfaces';
import { FTPInstallation, CLIInstallation } from './InstallationHandler';

export class InstallActions {
  mode: any;
  strategy: any;

  constructor() {
    this.mode = 'ftp'; // REVIEW: get from storage when picking strategy?
    this.strategy = this.getStartegy();
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  getStartegy(): any {
    switch (this.mode) {
      case 'ftp':
        return new FTPInstallation();
      case 'cli':
        return new CLIInstallation();
      default:
        throw new Error('Invalid type');
    }
  }

  runInstallation (
    connectionArgs: IIpcConnectionArgs, 
    installationArgs: {installationDir: string, installationType: string, userUploadedPaxPath: string, smpeDir: string},
    version: string, zoweConfig: any): Promise<IResponse> {
    return this.strategy.runInstallation(connectionArgs, installationArgs, version, zoweConfig);
  }

  initSecurity(connectionArgs: IIpcConnectionArgs,
    installationArgs: {installationDir: string}, zoweConfig: any): Promise<IResponse> {
    return this.strategy.initSecurity(connectionArgs, installationArgs, zoweConfig);
  }

  apfAuth(connectionArgs: IIpcConnectionArgs,
    installationArgs: {installationDir: string}, zoweConfig: any): Promise<IResponse> {
    return this.strategy.apfAuth(connectionArgs, installationArgs, zoweConfig);
  }

}