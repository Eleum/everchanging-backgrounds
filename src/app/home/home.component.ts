import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { HttpClient } from '@angular/common/http';

declare var VK: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    accessToken = "";

    constructor(private http: HttpClient, private electron: ElectronService) { }

    ngOnInit(): void {
        return;
        var BrowserWindow = this.electron.remote.BrowserWindow;

        const authUrl = 'https://oauth.vk.com/authorize?client_id=&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,status&response_type=token&v=5.103&state=123456&revoke=1';

        let authWindow = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences: { nodeIntegration: false } });

        authWindow.webContents.on('will-redirect', (event, url) => {
            const parts = url.split('#');
            const params = parts[1]
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, pair) => {
                    const [key, value] = pair.map(decodeURIComponent);
                    return ({ ...obj, [key]: value })
                }, {});

            this.accessToken = params["access_token"];

            authWindow.close();
        });

        authWindow.on('close', () => {
            authWindow = null;
        });

        authWindow.loadURL(authUrl);
        authWindow.show();
    }

    public minimizeWindow() {
        this.electron.window.minimize();
    }

    public closeWindow() {
        this.electron.window.close();
    }

    public sendTestMessage(e: any) {
        debugger;
    }
}
