import {Injectable} from '@angular/core';
import {SOCKET_URL} from '@core/constants/global';
import {io, Socket} from 'socket.io-client';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SocketIoService {
    private socket: Socket;

    constructor() {
        this.setupSocketConnection();
    }

    setupSocketConnection() {
        this.socket = io(SOCKET_URL);
    }

    addNewUser(user) {
        this.setupSocketConnection();
        // console.log('add to socket!!!', user)
        // console.log(this.socket)
        this.socket.emit('newUser', user);
    }

    userOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('userConnected', msg => {
                observer.next(msg);
            });
        });
    }

    // EMITTER example
    sendMessage(data: any) {
        this.socket.emit('sendMessage', data);
    }

    // HANDLER example
    onNewMessage() {
        return new Observable(observer => {
            this.socket.on('newMessage', msg => {
                observer.next(msg);
            });
        });
    }

    setTyping(data) {
        this.socket.emit('setTyping', data);
    }

    getTyping() {
        return new Observable(observer => {
            this.socket.on('getTyping', msg => {
                observer.next(msg);
            });
        });
    }

    setSeen(data) {
        this.socket.emit('setSeen', data);
    }

    getSeen() {
        return new Observable(observer => {
            this.socket.on('getSeen', msg => {
                observer.next(msg);
            });
        });
    }

    setNewGroup(data) {
        this.socket.emit('setNewGroup', data);
    }

    inviteToNewGroup(data) {
        this.socket.emit('inviteToNewGroup', data);
    }

    inviteToGroupSent() {
        return new Observable(observer => {
            this.socket.on('inviteToGroupSent', msg => {
                observer.next(msg);
            });
        });
    }

    acceptJoinToGroup(data) {
        this.setupSocketConnection();
        this.socket.emit('acceptJoinGroup', data);
    }

    getChatNotifications() {
        return new Observable(observer => {
            this.socket.on('chatNotification', msg => {
                observer.next(msg);
            });
        });
    }

    leaveGroup(data) {
        this.socket.emit('leaveGroup', data);
    }

    leaveGroupNotify() {
        return new Observable(observer => {
            this.socket.on('leaveGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    disconnect(data) {
        this.socket.emit('forceDisconnect', data);
    }

}
