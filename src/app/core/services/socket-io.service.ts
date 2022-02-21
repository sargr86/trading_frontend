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

    addNewUser(user, login = false) {
        if (login) {
            this.setupSocketConnection();
        }
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
                // console.log('get connect')
                observer.next(msg);
            });
        });
    }

    disconnectUsers(data) {
        this.socket.emit('disconnectUsers', data);
    }

    getDisconnectUsers() {
        return new Observable(observer => {

            this.socket.on('getDisconnectUsers', msg => {
                observer.next(msg);
            });
        });
    }

    getConnectedUsers(data) {
        this.socket.emit('getConnectedUsers', data);
    }

    usersOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('usersConnected', msg => {
                observer.next(msg);
            });
        });
    }

    userOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('onGetOnlineUsers', msg => {
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
                // console.log('typing')
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
        // this.setupSocketConnection();
        this.socket.emit('acceptJoinGroup', data);
    }

    getAcceptedJoinGroup() {
        return new Observable(observer => {
            this.socket.on('acceptedJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }

    declineJoinToGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineJoinGroup', data);
    }

    getDeclinedJoinGroup() {
        return new Observable(observer => {
            this.socket.on('getDeclinedJoinGroup', msg => {
                observer.next(msg);
            });
        });
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

    removeFromGroup(data) {
        this.socket.emit('removeFromGroup', data);
    }

    removeFromGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeFromGroupNotify', msg => {
                console.log('remove from group')
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
                console.log('accept')
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

    cancelUsersConnecting(data) {
        this.socket.emit('cancelUsersConnection', data);
    }

    cancelledUsersConnecting() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('cancelledUsersConnection', msg => {
                observer.next(msg);
            });
        });
    }

    disconnect(data) {
        this.socket.emit('forceDisconnect', data);
    }

    onLogout() {
        return new Observable(observer => {
            this.socket.on('onLogout', msg => {
                observer.next(msg);
            });
        });
    }

}
