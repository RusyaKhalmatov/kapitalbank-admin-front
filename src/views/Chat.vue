<template>
    <v-layout column wrap>
        <v-card min-height="800">
            <v-toolbar flat>
                <span class="warning">{{status}}</span>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="connect">
                    Connect
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-list v-for="(text, index) in users" :key="index">
                                <v-list-tile two-line>
                                    <v-list-tile-title>
                                        {{text.sender}}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        {{text.content}}
                                    </v-list-tile-sub-title>
                                    <v-btn @click="closeChat(text.topicChatId)">
                                        Close Chat
                                    </v-btn>
                                </v-list-tile>
                            </v-list>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="userName" label="User Name"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="roomId" label="Room Id"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field v-model="messageText" label="Message"
                                          placeholder="Send message"></v-text-field>
                        </v-flex>
                        <v-flex xs2>
                            <v-btn color="info" @click="sendMessage">
                                Send
                                <v-icon>send</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12>
                            <v-list v-for="(text, index) in messages" :key="index">
                                <v-list-tile two-line>
                                    <v-list-tile-title>
                                        {{text.sender}}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        {{text.content}}
                                    </v-list-tile-sub-title>
                                </v-list-tile>
                            </v-list>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
    </v-layout>
</template>
<script>
    import SockJs from 'sockjs-client';
    import Stomp from 'webstomp-client';

    export default {
        name: 'ChatRoom',
        data() {
            return {
                users: [],
                messages: [],
                messageText: '',
                stompClient: null,
                message: {
                    sender: '',
                    content: '',
                    type: '',
                    topicChatId: ''
                },
                status: '',
                roomId: '',
                userName: '',
            }
        },
        methods: {
            closeChat(topicChatId) {
                let self = this;
                self.stompClient.unsubscribe(topicChatId);
                self.$http.post(self.$store.getters.apiUrl + `/chat/close/${topicChatId}`)
                    .then(response => {
                        self.success(response.data.message);
                    }, self.handleError);
            },
            connect() {
                let self = this;
                let socket = new SockJs(self.$store.getters.socketApi);
                self.stompClient = Stomp.over(socket);
                self.stompClient.connect({}, self.onConnected, self.onError);
            },
            onConnected() {
                let self = this;
                self.status = "connected";
                this.subscribeModerator();
            },
            subscribeModerator() {
                let self = this;
                self.stompClient.subscribe('/topic/new-chat', self.onModeratorMessageReceived, {
                    "id": 'm1',
                    "auto-delete": false
                });
            },
            onModeratorMessageReceived(response) {
                let self = this;
                let user = JSON.parse(response.body);
                self.infoMessage(`${user.sender} is joined to the chat`);
                self.joinToUserChat(user.topicChatId);
                self.users.push(user);
            },
            joinToUserChat(chatId) {
                let self = this;
                self.status = 'user is connected';
                self.stompClient.subscribe(`/topic/${chatId}`, self.onUserMessageReceived, {id: 'u1'});
            },
            onUserMessageReceived(response) {
                let self = this;
                let message = JSON.parse(response.body);
                self.messages.push(message);
                self.infoMessage(`${message.sender} : ${message.content}`);
                self.status = 'message is received';
            },
            onError() {
                let self = this;
                self.status = 'uh oh! service unavailable';
            },
            sendMessage() {
                let self = this;
                if (self.messageText && self.stompClient) {
                    self.setChatMessage();
                    self.$http.post(self.$store.getters.apiUrl + '/chat/send', self.message)
                        .then(response => {
                            self.success(response.data.message);
                        }, self.handleError)
                } else {
                    self.status = 'please enter message or connect to the chat!';
                }
            },
            setChatMessage() {
                let self = this;
                self.message.sender = self.userName;
                self.message.content = self.messageText;
                self.message.type = 'CHAT';
                self.message.topicChatId = self.roomId;
            }
        },
        computed: {},
        mounted() {
            this.connect();
        }
    }
    ;
</script>
<style>

</style>
