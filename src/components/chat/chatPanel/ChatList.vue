<template>
    <div class="left-child">
        <div class="tmp">
            <img draggable="false" class="call-icon" src="@/assets/avatar.png" alt="icon"/>
            <p class="call-text">{{$store.getters.userName}}</p>
            <v-btn icon small dark v-if="socketConnected">
                <v-icon color="success">mdi-checkbox-blank-circle</v-icon>
            </v-btn>
            <v-btn icon small v-else>
                <v-icon color="error">mdi-checkbox-blank-circle-outline</v-icon>
            </v-btn>
        </div>
        <div class="search-input">
            <img draggable="false" src="@/assets/search-icon.png" class="search-icon" alt/>
            <input type="text" class="search-input-text" v-model="search" placeholder="Поиск по активным чатам"/>
        </div>
        <div class="active-box">
            <div @click="setActiveChat" :class="{'active-chat': isActiveChat, 'waiting-chat': isWaitChat}">Активные</div>
            <div @click="setWaitingChat" :class="[{'active-chat': !isActiveChat, 'waiting-chat': !isWaitChat, 'blink': isWaitBlink}, 'waiting-chat']">В ожидании</div>
        </div>
        <div class="left-child-box">
            <ul style="padding: 0;">
                <li
                        :class="['chat-list',{'active': isActive === user.topicChatId, 'blink': isActive != user.topicChatId||isActive != user.topicChatId&&user.unreadCount}]"
                        v-for="(user, i) in users"
                        :key="i"
                        @click.stop="changeChatRoom(user)"
                >
                    <img draggable="false" class="user-icon" src="@/assets/avatar-icon.png" alt/>

                    <span class="user-list">
                        <span class="user-list-name">{{user.clientFullName}}</span>
                        <span class="user-list-box">
                            <span class="user-list-lastmsg" v-if="user.lastMessage">{{user.lastMessage.content}}</span>
                            <span v-if="user.unreadCount" class="user-list-msg">{{user.unreadCount}}</span>
                        </span>
                        <span class="user-list-lastmsg last-msg-date" v-if="user.lastMessage">{{user.lastMessage.messageTime | timestamp-to-date}}</span>
                        <span v-show="lastSenderAdmin(user)" :class="[{'user-list-admin-box': lastSenderAdmin(user).isReply, 'reply-to-customer': !lastSenderAdmin(user).isReply}]">{{lastSenderAdmin(user).answer}}</span>
                    </span>
                </li>
            </ul>
        </div>
        <div v-if="isChatListProgress" class="d-flex justify-content-center ma-1">
            <v-progress-circular style="height:23px; width: 23px;"            
            indeterminate
            color="amber"
            ></v-progress-circular>  
        </div>
    </div>
</template>
<script>
export default {
    name: 'ChatList',
    props:{
        socketConnected: Boolean,
        users: Array,
        isChatListProgress: Boolean
    },
    data(){
        return {
            isActiveChat: true,
            isWaitChat: true,
            isSearch: false,
            search: '',
            isWaitBlink: false,      
            isActive: false,


        }
    },
    methods:{
        lastSenderAdmin(user){
            let result = {};
            if(user.clientId != user.lastMessage.senderId){
                result = {
                    isReply: true,
                    answer: user.lastMessage.sender
                }
            }
            else{
                result = {
                    isReply: false,
                    answer: "Не игнорируй меня!"
                }
            }
            return result
        },
        setActiveChat(){

        },
        setWaitingChat(){

        }
    }
}
</script>
<style scoped src="../../../assets/css/chat.css">

</style>