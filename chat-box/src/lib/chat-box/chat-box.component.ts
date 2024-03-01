import { animate,state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopoverComponent } from '@v-one/elements/popover';
import clone from 'lodash-es/clone';

import { Chat } from './chat.type';

@Component({
    selector: 'v-one-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('popOut', [
            transition(':enter', [
                style({
                    transform: 'scale(0)',
                    opacity: 0
                }),
                animate('0.2s ease-out', style({
                    transform: 'scale(1.1)',
                    opacity: 1
                })),
                animate('0.1s', style({
                    transform: 'scale(1)'
                }))
            ]),
            transition(':leave', [
                animate('0.2s ease-out', style({
                    transform: 'translateX(200px)',
                    opacity: 0
                }))
            ]),
        ])
    ]
})
export class ChatBoxComponent {

    @Output() newUserMessage = new EventEmitter<Chat>();
    @Output() chatBoxOpened = new EventEmitter<boolean>();
    @Output() chatsCleared = new EventEmitter<void>();

    @ViewChild('chatBoxPopover') chatBoxPopover: PopoverComponent;
    popoverShowing = false;
    popoverHeight = Math.max(window.innerHeight * 0.8, 400);
    popoverWidth = Math.max(window.innerWidth * 0.4, 400);

    @ViewChild('chatThreads') chatThreads: ElementRef<HTMLDivElement>;

    loading = false;
    chats: Array<Chat> = [];
    message: string;

    constructor(private _cd: ChangeDetectorRef) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.toggleChatBox();
        }, 800);
    }

    toggleChatBox() {
        if (!this.popoverShowing) {
            // this.chats = this.chats.map(chat => clone(chat));
            this.chatBoxPopover.show(window.innerWidth - this.popoverWidth - 16, window.innerHeight - this.popoverHeight - 80);
            this.chatBoxOpened.emit(true);
        } else {
            this.chatBoxPopover.hide();
            this.chatBoxOpened.emit(true);
        }
        this._cd.markForCheck();
    }

    getAllChats() {
        return this.chats;
    }

    clearAllChats() {
        this.chats = [];
        this._cd.markForCheck();
        setTimeout(() => {
            this.chatsCleared.emit();
        }, 300); // wait for animation to complete
    }

    setLoading(loading: boolean) {
        this.loading = loading;
        this._cd.detectChanges();
        this.scrollToBottom();
    }

    addMessage(chat: Chat, fromInputBox = false) {
        if (!chat.message && !chat.template || (this.loading && fromInputBox)) {
            return;
        }
        this.chats.push(chat);
        if (chat.role === 'user' && fromInputBox) {
            this.newUserMessage.emit(chat);
            this.message = '';
        }
        this._cd.detectChanges();
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatThreads.nativeElement.scrollTo({ 
            top: this.chatThreads.nativeElement.scrollHeight,
            behavior: 'smooth' 
        });
    }
}