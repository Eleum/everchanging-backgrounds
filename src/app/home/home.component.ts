import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import fetch from 'node-fetch';
import Unsplash, { toJson } from 'unsplash-js';

declare var document: any;
declare var window: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    unsplash = new Unsplash({ accessKey: 'Q66eSgkxjkKhmJny2qln7Ep8K-lpxaKWzxF8LYEvw4E', timeout: 1500 });

    darkMode = true;
    descriptionHidden = false;

    messages: object[] = [];
    messageNotifier = new Subject<string>();

    timers = {};
    timersFinished = false;
    addTimer: Function;

    regexUrl: RegExp;

    constructor(private http: HttpClient, private electron: ElectronService) {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        this.regexUrl = new RegExp(expression);
    }

    items = [
        { title: 'Slide 1' },
        { title: 'Slide 2' },
        { title: 'Slide 3' },
    ];

    ngOnInit() {
        const regexUrl = this.regexUrl;
        const timers = this.timers;
        const messages = this.messages;
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
            messages.push({
                message,
                shouldSeparateMessages,
                firstMessage: messages.length === 0,
                hasLink: message.match(regexUrl)
            });

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

        const tags = document.getElementsByClassName('tags')[0];
        tags.addEventListener('wheel', (e: any) => {
            if (e.deltaY > 0) {
                tags.scrollLeft += 50;
            } else {
                tags.scrollLeft -= 50;
            }
        });

        const wallpaperDescr = document.getElementsByClassName('wallpaper-info-container')[0];
        const descrHideLink = document.getElementById('hideLink');
        const descrShowButton = document.getElementsByClassName('btn-show-description')[0];
        descrHideLink.addEventListener('click', (e: any) => {
            if (descrShowButton.hidden === true) {
                descrShowButton.hidden = false;
            }
            if (!this.descriptionHidden) {
                descrShowButton.classList.remove('fadeOutDown');
                descrShowButton.classList.add('fadeInUp');
                wallpaperDescr.classList.remove('fadeInUp');
                wallpaperDescr.classList.add('fadeOutDown');
                this.descriptionHidden = !this.descriptionHidden;
            }
            e.preventDefault();
        });
        descrShowButton.addEventListener('click', (e: any) => {
            if (this.descriptionHidden) {
                descrShowButton.classList.remove('fadeInUp');
                descrShowButton.classList.add('fadeOutDown');
                wallpaperDescr.classList.remove('fadeOutDown');
                wallpaperDescr.classList.add('fadeInUp');
                this.descriptionHidden = !this.descriptionHidden;
            }
        });
        document.addEventListener('keyup', (e: any) => {
            if (e.keyCode !== 32) {
                return;
            }
            if (this.descriptionHidden) {
                descrShowButton.click();
            } else {
                descrHideLink.click();
            }
        });
    }

    public sendTimedMessage(e: any) {
        if (!e) {
            return;
        }

        document.getElementById('message-input').value = '';
        this.addTimer(() => { this.messageNotifier.next(e); }, 0);
    }

    public getRandomPhoto() {
        this.unsplash.photos.getRandomPhoto({ query: 'dark minimal', orientation: 'landscape' })
            .then(toJson)
            .then(json => {
                console.log(json);

                // window.open(json.urls.full, '_blank');
                // window.open(json.urls.regular, '_blank');
                // window.open(json.urls.small, '_blank');
                // window.open(json.urls.thumb, '_blank');
            })
            .catch(err => {
                console.error(err);
            });
    }

    public switchColorMode() {
        let mode = "";
        let runTransition = () => {
            document.documentElement.classList.add('transition');
            window.setTimeout(() => {
                document.documentElement.classList.remove('transition');
            }, 1000);
        }

        runTransition();

        if (this.darkMode) {
            mode = 'light';
        } else {
            mode = 'dark';
        }

        this.darkMode = !this.darkMode;
        document.documentElement.setAttribute('data-theme', mode);
    }

    public minimizeWindow() {
        this.electron.window.minimize();
    }

    public closeWindow() {
        this.electron.window.close();
    }
}
