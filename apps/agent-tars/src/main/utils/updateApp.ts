import { UpdateInfo } from 'builder-util-runtime';
import { app, BrowserWindow } from 'electron';
import { logger } from '@main/utils/logger';
import {
  AppUpdater as ElectronAppUpdater,
  autoUpdater,
} from 'electron-updater';

export class AppUpdater {
  autoUpdater: ElectronAppUpdater = autoUpdater;
  constructor(mainWindow: BrowserWindow) {
    if (app.isPackaged) {
      autoUpdater.logger = logger;
      autoUpdater.autoDownload = true;

      autoUpdater.on('error', (error) => {
        logger.error('Update_Error', error);
        mainWindow.webContents.send('main:error', error);
      });

      autoUpdater.on('update-available', (releaseInfo: UpdateInfo) => {
        logger.info('new version', releaseInfo);
        mainWindow.webContents.send('app-update-available', releaseInfo);
      });

      this.autoUpdater = autoUpdater;

      if (app.isPackaged) {
        // Only check for updates in the packaged version!
        this.autoUpdater.checkForUpdatesAndNotify();
      }
    }
  }
}
