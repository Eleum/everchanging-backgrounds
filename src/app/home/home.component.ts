import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

declare var VK: any;
declare var document: any;
declare var window: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    accessToken = "";

    messages: object[] = [];
    messageNotifier = new Subject<string>();

    timers = {};
    timersFinished = false;
    addTimer: Function;

    constructor(private http: HttpClient, private electron: ElectronService) { }

    ngOnInit() {
        let timers = this.timers;
        let messages = this.messages;
        let shouldSeparateMessages = false;
        let separateMessagesTimer: NodeJS.Timeout;

        this.messageNotifier.subscribe({ next: (value) => addMessage(value) });

        this.addTimer = function (fn, delay) {
            var id = window.setTimeout(() => {
                fn();
                delete timers[id];
            }, delay);

            timers[id] = true;
            return id;
        }

        var _clearTimeout = window.clearTimeout;
        window.clearTimeout = function (id) {
            delete timers[id];
            _clearTimeout(id);
        }

        function addMessage(message: string) {
            messages.push({ shouldSeparateMessages, message, firstMessage: messages.length === 0 });
            
            clearTimeout(separateMessagesTimer);
            shouldSeparateMessages = false;
            separateMessagesTimer = setTimeout(() => {
                shouldSeparateMessages = true;
            }, 4000);
        }

        function activeTimers() {
            return Object.keys(timers).length > 0;
        }

        let i = 0;
        function increment(messages: string[]) {
            i++;
            addMessage("this is " + i.toString());
        }

        let timer = setTimeout(function sendTimedMessage(messages: string[]) {
            increment(messages);
            timer = setTimeout(sendTimedMessage, 1000, messages);
        }, 0, this.messages);

        this.addTimer(() => { clearTimeout(timer) }, 2000);
        this.addTimer(() => { addMessage('42') }, 7000);
        
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

    public sendTimedMessage(e: any) {
        if (!e) {
            return;
        }

        document.getElementById('message-input').value = '';
        this.timersFinished = false;
        this.addTimer(() => { this.messageNotifier.next(e); }, 3000);
    }

    public minimizeWindow() {
        this.electron.window.minimize();
    }

    public closeWindow() {
        this.electron.window.close();
    }
}
