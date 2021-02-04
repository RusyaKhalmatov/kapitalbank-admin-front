<template>
    <div class="main">
        <ChatList :isChatListProgress.sync="isChatListProgress" :socketConnected="socketConnected" :users="users"></ChatList>
    </div>
</template>

<script>
import SockJs from "sockjs-client";
import Stomp from "webstomp-client";
import ChatList from "./chatPanel/ChatList"
export default {
    name: 'ChatComponent',
    components:{
        ChatList
    },
    data(){
        return{
            socketUrl: this.$store.getters.socketUrl,
            socketConnected: false,
            status: '',
            stompClient: null,
            users: [],
            isCloseChat: false,
            topicChatIds: [],
            users: [],
            waitUsers: [],
            isChatListProgress: false,

        }
    },
    methods:{
        connect() {
            let socket = new SockJs(this.socketUrl);
            this.stompClient = Stomp.over(socket);
            // this.stompClient.reconnect_delay = 1000;

            this.stompClient.connect({}, this.onConnected,this.onError);
        },
        onConnected(){
            console.log('connected')
            this.socketConnected = true;

            this.subscribeModerator();
        },
        onError(){
            console.log('error ttests')
            this.socketConnected = false;


        },
        subscribeModerator() {
            this.stompClient.subscribe('/topic/new-chat', this.onModeratorMessageReceived);
            this.getTopicChatIds()
            if(!this.isCloseChat)
                this.getActiveChatList("ACTIVE");
        },
        onModeratorMessageReceived(response) {
                let self = this;
                let message = JSON.parse(response.body);
                self.infoMessage(`${message.sender} is joined to the chat`);
                console.log("######### message #############")
                console.log(message)
                console.log("###############################")
                let newUser = {};
                newUser.topicChatId = message.topicChatId;
                newUser.senderId = message.senderId;
                newUser.sender = message.sender;
                newUser.read = message.read;
                newUser.type = message.type;
                newUser.unreadCount = 0;
                newUser.chatStatus = message.chatStatus;
                newUser.messages = [];
                newUser.messages.push(message);
                self.users.unshift(newUser);
                self.joinToUserChat(newUser.topicChatId);
        },
        joinToUserChat(chatId,index) {
            this.status = "user is connected";
            // alert('new')
            this.search = '';
            this.stompClient.subscribe(
                `/topic/${chatId}`,
                this.onUserMessageReceived,
                {id: `u-${index}`}
            );
        },
        onUserMessageReceived(response) {
            let message = JSON.parse(response.body);
            console.log(message)
        },
        getTopicChatIds(){
            this.$http
                .get(this.$store.getters.newChatApiUrl + "/chat/chats/topicChatIds?status=ACTIVE_WAITING")
                .then(response => {
                    response.data.data.forEach((x, index)=>{
                        this.joinToUserChat(x, index);
                    })

                })
        },
        getActiveChatList(status) {
            this.users = [];
            this.waitUsers = [];
            this.isChatListProgress = true;
            this.$http
                .get(this.$store.getters.newChatApiUrl + `/chat/chats/list?page=0&size=20&status=${status}`)
                .then(response => {
                    this.users = response.data.data.content
                    this.isChatListProgress = false                
                }, this.handleError);
        },
    },
    mounted(){
        this.connect();
    }
}
</script>

<style scoped>
    .main {
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        left: 50%;
        position: absolute;
        background: #ebebeb;
        width: 90%;
        height: 90%;
        min-height: 425px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-shadow:  0px 0px 10px 0px rgb(187 187 187);
        /* box-shadow: 0px 0px 15px 0px rgba(183, 183, 183, 0.88); */
        box-shadow: 0px 0px 10px 0px rgb(187 187 187);
    }
</style>