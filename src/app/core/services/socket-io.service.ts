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

    connectWithUser(data) {
        this.socket.emit('connectWithUser', data);
    }

    getConnectWithUser() {
        return new Observable(observer => {
            this.socket.on('getConnectWithUser', msg => {
                observer.next(msg);
            });
        });
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

    unreadLastMessages(data) {
        this.socket.emit('unreadLastMessages', data);
    }

    blockUnblockUser(data) {
        this.socket.emit('blockUnblockUser', data);
    }

    getBlockUnblockUser() {
        return new Observable(observer => {
            this.socket.on('getBlockUnblockUser', dt => {
                observer.next(dt);
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

    declineJoinToGroup(data) {
        this.setupSocketConnection();
        this.socket.emit('declineJoinGroup', data);
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

    removeGroup(data) {
        this.socket.emit('removeGroup', data);
    }

    removeGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    disconnect(data) {
        this.socket.emit('forceDisconnect', data);
    }

    acceptConnection(data) {
        // this.setupSocketConnection();
        this.socket.emit('acceptConnection', data);
    }

    declineConnection(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineConnection', data);
    }

    acceptedConnection() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('acceptedConnection', msg => {
                observer.next(msg);
            });
        });
    }

    declinedConnection() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('declinedConnection', msg => {
                observer.next(msg);
            });
        });
    }

}
