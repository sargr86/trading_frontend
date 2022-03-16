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
        // console.log('add to socket!!!', users)
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

    getConnectedGroupMembers(data) {
        this.socket.emit('getConnectedGroupMembers', data);
    }

    membersOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('onGetOnlineMembers', msg => {
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

    setNewPageGroup(data) {
        this.socket.emit('setNewPageGroup', data);
    }

    setNewChatGroup(data) {
        this.socket.emit('setNewChatGroup', data);
    }

    inviteToNewChatGroup(data) {
        this.socket.emit('inviteToNewChatGroup', data);
    }

    inviteToChatGroupSent() {
        return new Observable(observer => {
            this.socket.on('inviteToChatGroupSent', msg => {
                observer.next(msg);
            });
        });
    }

    inviteToNewPageGroup(data) {
        this.socket.emit('inviteToNewPageGroup', data);
    }

    inviteToPageGroupSent() {
        return new Observable(observer => {
            this.socket.on('inviteToPageGroupSent', msg => {
                observer.next(msg);
            });
        });
    }

    acceptJoinToChatGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('acceptJoinToChatGroup', data);
    }

    getAcceptedJoinChatGroup() {
        return new Observable(observer => {
            this.socket.on('acceptedJoinChatGroup', msg => {
                observer.next(msg);
            });
        });
    }

    acceptJoinPageGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('acceptJoinPageGroup', data);
    }

    getAcceptedJoinPageGroup() {
        return new Observable(observer => {
            this.socket.on('acceptedJoinPageGroup', msg => {
                observer.next(msg);
            });
        });
    }

    declineJoinToChatGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineJoinChatGroup', data);
    }

    getDeclinedJoinChatGroup() {
        return new Observable(observer => {
            this.socket.on('getDeclinedJoinChatGroup', msg => {
                observer.next(msg);
            });
        });
    }

    declineJoinPageGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineJoinPageGroup', data);
    }

    getDeclinedJoinPageGroup() {
        return new Observable(observer => {
            this.socket.on('getDeclinedJoinPageGroup', msg => {
                observer.next(msg);
            });
        });
    }

    joinGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('joinGroup', data);
    }

    getJoinGroup() {
        return new Observable(observer => {
            this.socket.on('getJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }


    confirmJoinGroup(data) {
        this.socket.emit('confirmJoinGroup', data);
    }

    getConfirmedJoinGroup() {
        return new Observable(observer => {
            this.socket.on('confirmedJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }

    ignoreJoinGroup(data) {
        this.socket.emit('ignoreJoinGroup', data);
    }

    getIgnoredJoinGroup() {
        return new Observable(observer => {
            this.socket.on('ignoredJoinGroup', msg => {
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

    leaveChatGroup(data) {
        this.socket.emit('leaveChatGroup', data);
    }

    leaveChatGroupNotify() {
        return new Observable(observer => {
            this.socket.on('leaveChatGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    leavePageGroup(data) {
        this.socket.emit('leavePageGroup', data);
    }

    leavePageGroupNotify() {
        return new Observable(observer => {
            this.socket.on('leavePageGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    removeFromPageGroup(data) {
        this.socket.emit('removeFromPageGroup', data);
    }

    removeFromPageGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeFromPageGroupNotify', msg => {
                console.log('remove from group')
                observer.next(msg);
            });
        });
    }

    removeFromChatGroup(data) {
        this.socket.emit('removeFromChatGroup', data);
    }

    removeFromChatGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeFromChatGroupNotify', msg => {
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
