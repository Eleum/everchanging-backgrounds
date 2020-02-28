import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';

declare var VK: any;
declare var window: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    accessToken = "";
    messages: string[] = [];

    timers = {};
    addTimer: Function;
    removeTimer: Function;

    constructor(private http: HttpClient, private electron: ElectronService) { }

    ngOnInit() {
        let timers = this.timers;

        this.addTimer = function(fn, delay) {
            var id = window.setTimeout(() => {
                fn();
                delete timers[id];
            }, delay);

            timers[id] = true;
            return id;
        }

        var _clearTimeout = window.clearTimeout;
        window.clearTimeout = function(id) {
            delete timers[id];
            _clearTimeout(id);
        }

        setTimeout(() => {
            let listener = setInterval(() => {
                if (!this.activeTimers()) {
                    this.messages.push('finished');
                    clearTimeout(listener);
                }
            }, 100);
        }, 0);

        let i = 0;
        function increment(messages: string[]) {
            i++;
            messages.push("this is " + i.toString());
        }

        let timer = setTimeout(function sendTimedMessage(messages: string[]) {
            increment(messages);
            timer = setTimeout(sendTimedMessage, 1000, messages);
        }, 0, this.messages);

        this.addTimer(() => { clearTimeout(timer) }, 7000);
        this.addTimer(() => {this.messages.push('1')}, 3000);

        // var BrowserWindow = this.electron.remote.BrowserWindow;

        // const authUrl = 'https://oauth.vk.com/authorize?client_id=&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,status&response_type=token&v=5.103&state=123456&revoke=1';

        // let authWindow = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences: { nodeIntegration: false } });

        // authWindow.webContents.on('will-redirect', (event, url) => {
        //     const parts = url.split('#');
        //     const params = parts[1]
        //         .split('&')
        //         .map(p => p.split('='))
        //         .reduce((obj, pair) => {
        //             const [key, value] = pair.map(decodeURIComponent);
        //             return ({ ...obj, [key]: value })
        //         }, {});

        //     this.accessToken = params["access_token"];

        //     authWindow.close();
        // });

        // authWindow.on('close', () => {
        //     authWindow = null;
        // });

        // authWindow.loadURL(authUrl);
        // authWindow.show();
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

    private activeTimers() {
        return Object.keys(this.timers).length > 0;
    }
}
