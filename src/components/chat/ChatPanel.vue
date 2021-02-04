<template>
    <div class="main">
        <!-- {{users}} -->
        <!-- <button @click="getActiveChatList">getActiveChatList</button> -->
        <div class="left-child">
            <div class="tmp">
                <img draggable="false" class="call-icon" src="@/assets/avatar.png" alt="icon"/>
                <p class="call-text">{{$store.state.userName}}</p>
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
                            :class="['chat-list',{'active': isActive === user.topicChatId, 'blink': isActive != user.topicChatId&&!lastSenderAdmin(user).isReply||isActive != user.topicChatId&&user.unreadCount}]"
                            v-for="(user, i) in setUsers"
                            :key="i"
                            @click.stop="changeChatRoom(user)"
                    >
                        <!-- <img draggable="false" v-if="ImageExist(url+user.phone+'.png')" class="user-icon" :src="url+user.phone+'.png'" alt/> -->
                        <img draggable="false" class="user-icon" src="@/assets/avatar-icon.png" alt/>
                        <!-- {{user.unreadCount}} -->

                        <span class="user-list">
                            <!-- {{setUsers}} -->
                            <span class="user-list-name">{{user.sender}}</span>
                            <span class="user-list-box">
                                <span class="user-list-lastmsg" v-if="user.messages">{{lastMsg(user.messages[user.messages.length - 1])}}</span>
                                <span v-if="user.unreadCount" class="user-list-msg">{{user.unreadCount}}</span>
                            </span>
                            <span class="user-list-lastmsg last-msg-date" v-if="user.messages">{{user.messages[user.messages.length - 1].messageTime | timestamp-to-date}}</span>
                            <span v-show="lastSenderAdmin(user)" :class="[{'user-list-admin-box': lastSenderAdmin(user).isReply, 'reply-to-customer': !lastSenderAdmin(user).isReply}]">{{lastSenderAdmin(user).answer}}</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-child" v-show="selectedUser.messages.length">
            <div class="right-child-header">{{selectedUser.sender}}</div> 
            <div v-if="isChatContentProgress" class="progress-circular">
                <v-progress-circular style="height:23px; width: 23px;"            
                indeterminate
                color="amber"
                ></v-progress-circular>  
            </div>           
            <div @scroll="scrollFunc" class="chat-content">
                <div
                        class="chat-box"
                        v-for="message in selectedUser.messages"
                        :key="message.messageId"
                        

                >
                    <span   :class="['chat-select',message.hover||isHover===message.id ? '' : 'opacity']"><p class="chat-select-text">&#10003;</p></span>
                    <div @click="selectChat(message)"  @mouseenter="message.hover = true" @mouseleave="message.hover=false" :class="[selectedUser.senderId===message.senderId ? 'chat-content-box' : 'call-chat-content', isSelectedChat===message.id ? 'select-chat' : '']">
                    
                    <!-- v-if="message.type!='READ'" -->
                    <!-- <p class="chat-content-text">{{message}}</p> -->
                    <img  @click="imagePreview(message.content)" class="image" v-if="message.type==='MEDIA'"
                        :src="message.content"/>
                    <p v-else class="chat-content-text">{{message.content}}</p>
                    <span class="chat-content-time">                        
                        <p v-if="selectedUser.senderId!=message.senderId" class="chat-content-time chat-content-sender">{{message.sender}}  </p>
                        <p v-else class="chat-content-time"></p>                        
                        <span style="display: flex;">
                            <p class="chat-content-time">{{message.messageTime | Timestamp}} {{message.messageTime | millis-to-time}}  </p>
                            <img draggable="false" v-if="message.senderId!=selectedUser.senderId" class="check-mark"
                                :src="checkOnRead(message.read)" alt="checkmark">
                        </span>
                    </span>
                    </div>
                </div>
                
            </div>
            <div v-if="isEdit" class="chat-edit-box">
                <span class="chat-edit-box-child">
                    <p class="chat-edit-box-header">Изменить сообщение</p>
                    <img @click="cancelEditMessage" class="edit-box-img" src="@/assets/cancel.png" alt="">
                </span>                
                <p class="chat-edit-box-text">{{editMessage}}</p>
            </div>
            <div v-if="isChatCommands">
                <chat-commands></chat-commands>
            </div>
            <div v-if="!isSelect" class="chat-input-box">
                <label class="file-box">
                    <img draggable="false" class="file-image" src="@/assets/paperclip-icon.png"/>
                    <input ref="input" type="file" :accept="accept" @change="onFileChange"/>
                </label>
                <!-- <textarea
                        class="chat-input"
                        type="text"
                        v-model="messageText"
                        @keyup.enter="sendMessage"
                        placeholder="Написать сообщение..."
                ></textarea> -->
                <!-- {{sendMessage}} -->
                <textarea-autosize
                placeholder="Написать сообщение..."
                @keyup.enter.native="sendMessage"
                class="chat-input"
                ref="myTextarea"
                v-model="messageText"
                :min-height="43"
                :max-height="350"
                
                />
                <img draggable="false" src="@/assets/send.png" @click="sendMessage" class="send-icon" alt="send"/>
            </div>
            <div v-else-if="!isEdit"  class="chat-input-box edit-input-box" >
                <v-btn @click="changeEditMessage">Изменить</v-btn>               
                <span class="cancel-edit-message" @click="cancelEditMessage">ОТМЕНА</span>
            </div>
            <div v-else class="chat-input-box">
                <label class="file-box">
                    <img draggable="false" class="file-image" src="@/assets/paperclip-icon.png"/>
                    <input ref="input" type="file" :accept="accept" @change="onFileChange"/>
                </label>
                <!-- <textarea
                        class="chat-input"
                        type="text"
                        v-model="messageText"
                        @keyup.enter="sendMessage"
                        placeholder="Написать сообщение..."
                ></textarea> -->
                <textarea-autosize
                placeholder="Написать сообщение..."
                @keyup.enter.native="sendEditMessage"
                class="chat-input"
                ref="myTextarea"
                v-model="messageText"
                :min-height="43"
                :max-height="350"
                
                />
                <img draggable="false" src="@/assets/send.png" @click="sendEditMessage" class="send-icon" alt="send"/>
            </div>

        </div>
        <div class="chat-info" v-show="selectedUser.messages.length">
            <!-- {{userInfo}} -->
            <div class="row">
                <p class="chat-info-header">Информация</p>
                <button class="close-chat" @click="closeChat(selectedUser.topicChatId)">Закрыть чат</button>
                <!-- <v-btn @click="closeChat(selectedUser.topicChatId)">Закрыть чат</v-btn> -->
            </div>
            <div v-if="isUserInfo" class="user-info">
                <!-- {{userInfo}} -->
                <!-- {{selectedUser.sender}} - {{selectedUser.senderId}} -->
                <button class="client-info" v-if="userInfo.customerId" @click="updateClientInfo(userInfo.userId)">Обновить клиентские данные</button>

                <p class="user-name">{{userInfo.firstName}} {{userInfo.lastName}}</p>
                <span class="deleted-user-box" v-if="userState">
                        <p class="deleted-user-child">{{userState}}</p>
                </span>
                <template v-if="!userState">
                    <span class="user-info-box" >
                            <p class="user-info-box-child-1">{{userInfo.phoneNumber}}</p>
                            <!-- <img style="width: 200px" :src="'https://dev.kapitalbank.uz/api/profile-pic/download/?fileName='+userInfo.phoneNumber+'.png'" alt=""> -->
                            <p class="user-info-box-child-2">Телефон</p>
                    </span>
                    <span class="user-info-box">
                            <p class="user-info-box-child-1">{{userInfo.email}}</p>
                            <p class="user-info-box-child-2" v-if="userInfo.email">email</p>
                    </span>
                    <span class="user-info-box">
                            <p class="user-info-box-child-1">{{userType}}</p>
                            <p class="user-info-box-child-2">Тип пользователя</p>
                    </span>
                    <span class="user-info-box">
                            <p class="user-info-box-child-1">{{userInfo.userId}}</p>
                            <p class="user-info-box-child-2">ID пользователя</p>
                    </span>
                    <span class="user-info-box" v-if="userInfo.customerId">
                            <p class="user-info-box-child-1">{{userInfo.customerId}}</p>
                            <p class="user-info-box-child-2">ID клиента</p>
                    </span>
                    <span class="user-info-box">
                        <p v-show="userInfo.appVersion[0]==='A'" class="user-info-box-child-1"><img draggable="false" class="version" src="@/assets/android.png" alt="version"> {{userInfo.appVersion}}</p>
                        <p v-show="userInfo.appVersion[0]==='I'" class="user-info-box-child-1"><img draggable="false" class="version" src="@/assets/apple.png" alt="version"> {{userInfo.appVersion}}</p>
                        <p v-show="userInfo.appVersion=='null'" class="user-info-box-child-1">Неопознанное устройство</p>                            
                        <p class="user-info-box-child-2">Версия приложения</p>
                    </span>
                    <v-btn style="height: 22px; margin: 10px 0;" @click="setChatOnHold(selectedUser, isActiveChat)">{{chatStatus}}</v-btn> 
                    <span class="rate-box">
                        <v-btn class="rate-box-child" @click="sendRateMessage('RUS')">Оценить (RUS)</v-btn> 
                        <v-btn class="rate-box-child" @click="sendRateMessage('UZB')">Оценить (UZB)</v-btn> 
                    </span>
                    <span class="user-cards-box">
                        <v-expansion-panel>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="list-box" @click="getCards(selectedUser.senderId)">Карты</div>
                                </template>
                                <div class="expansion-panel-child">
                                    <vcl-list v-if="!isCardsInfo"></vcl-list>
                                    <span                                   
                                    v-else
                                    :class="['user-card', card.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                    v-for="(card,index) in cardsInfo"
                                    :key="index"
                                    >
                                        <!-- {{card}} -->
                                        <span v-if="checkAdmin" class="settings-box">                                           
                                            <img @click="getCardHistory(card.id)" draggable="false" class="settings" src="@/assets/settings.png" alt="">
                                        </span>
                                        <span style="display: flex">
                                            <p class="user-card-child">{{card.type}}</p>
                                            <p class="user-card-child">{{card.maskedPan}}</p>
                                            <p class="user-card-child">{{card.expiry}}</p>
                                        </span>
                                        <p class="user-card-sms">SMS-информирование: {{checkSms(card.smsPhone)}}</p>
                                    </span>    
                                    <p v-if="isCardsInfo">{{emptyCard}}</p>                   

                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="list-box" @click="getWallets(selectedUser.senderId)">Кошельки</div>
                                </template>
                                <div class="expansion-panel-child">
                                    <vcl-list v-if="!isWalletsInfo"></vcl-list>
                                    <span                                   
                                    v-else
                                    :class="['user-card', wallet.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                    v-for="(wallet,index) in walletsInfo"
                                    :key="index"
                                    >
                                        <span style="display: flex; flex-direction: column;">
                                            <p class="user-card-child">{{wallet.walletId}}</p>
                                            <!-- <p style="margin:0 10px 10px" class="user-card-child">{{(parseFloat(wallet.balance) / Math.pow(10, wallet.currency.scale)).toLocaleString('us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}} {{wallet.currency.name}}</p>                                         -->
                                            <p style="margin:0 10px 10px" class="user-card-child">Счет: {{wallet.account}}</p>
                                        </span>
                                    </span>    
                                    <p v-if="isWalletsInfo">{{emptyWallet}}</p>                   

                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="list-box" @click="getAccounts(selectedUser.senderId)">Счета</div>
                                </template>
                                <div class="expansion-panel-child">
                                    <vcl-list v-if="!isAccountsInfo"></vcl-list>
                                    <span                                   
                                    v-else
                                    :class="['user-card', account.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                    v-for="(account,index) in accountsInfo"
                                    :key="index"
                                    >
                                        <span style="display: flex; flex-direction: column;">
                                            <p class="user-card-child">{{account.ownerName}}</p>
                                            <p class="user-card-child" style="margin: 0px 10px 10px;">{{account.account}}</p>
                                            <!-- <p style="margin:0 10px 10px" class="user-card-child">{{(parseFloat(account.balance) / Math.pow(10, account.currency.scale)).toLocaleString('us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}} {{account.currency.name}}</p>                                         -->
                                        </span>
                                    </span>    
                                    <p v-if="isAccountsInfo">{{emptyAccount}}</p>                   

                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="list-box" @click="getDeposits(selectedUser.senderId)">Вклады</div>
                                </template>
                                <div class="expansion-panel-child">
                                    <vcl-list v-if="!isDepositsInfo"></vcl-list>
                                    <span v-else
                                    :class="['user-card', deposit.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                    v-for="(deposit,index) in depositsInfo"
                                    :key="index"
                                    >
                                        <span style="display: flex">
                                            <p class="user-deposit-child">{{deposit.name}}</p>
                                            <p class="user-deposit-child">{{deposit.rate}}%</p>
                                        </span>
                                        <span style="display: flex">
                                            <p class="user-deposit-child">Начисление</p>
                                            <p class="user-deposit-child">{{(parseFloat(deposit.accrual) / Math.pow(10, deposit.currency.scale)).toLocaleString('us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}} {{deposit.currency.name}}</p>
                                        </span>
                                        <span style="display: flex">
                                            <p class="user-deposit-child">{{deposit.openDate  | Timestamp}}</p>
                                            <p class="user-deposit-child">&#8594;</p>                                            	
                                            <p class="user-deposit-child">{{deposit.closeDate | Timestamp}}</p>
                                        </span>
                                    </span> 
                                    <p v-if="isDepositsInfo">{{emptyDeposit}}</p>                   
                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="list-box" @click="getLoans(selectedUser.senderId)">Кредиты</div>
                                </template>
                                <div class="expansion-panel-child">
                                    <vcl-list v-if="!isLoansInfo"></vcl-list>
                                    <span v-else
                                    :class="['user-card', loan.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                    v-for="(loan,index) in loansInfo"
                                    :key="index"
                                    >
                                        <span style="display: flex">
                                            <p class="user-deposit-child">{{loan}}</p>
                                            <!-- <p class="user-deposit-child">{{loan.rate}}%</p> -->
                                        </span>
                                        <!-- <span style="display: flex">
                                            <p class="user-deposit-child">Начисление</p>
                                            <p class="user-deposit-child">{{(parseFloat(deposit.accrual) / Math.pow(10, deposit.currency.scale)).toLocaleString('us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}} {{deposit.currency.name}}</p>
                                        </span>
                                        <span style="display: flex">
                                            <p class="user-deposit-child">{{deposit.openDate  | Timestamp}}</p>
                                            <p class="user-deposit-child">&#8594;</p>                                            	
                                            <p class="user-deposit-child">{{deposit.closeDate | Timestamp}}</p>
                                        </span> -->
                                    </span> 
                                    <p v-if="isLoansInfo">{{emptyLoan}}</p>                   
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>  
                    
                    </span>
                </template>
            </div>
            <div class="user-info" v-else>
                <vcl-list></vcl-list>
                <vcl-list></vcl-list>
                <vcl-list></vcl-list>
                <vcl-list></vcl-list>
                <vcl-list></vcl-list>
            </div>

            
        </div>
        <div v-if="isImgPreview" class="image-preview">
            <img draggable="false" style="max-width: 500px; max-height: 500px;" :src="imgPreview" alt="">
            <v-btn class="close-image-preview" @click="closeImagePreviw">Закрыть</v-btn>
        </div>
    </div>
   
</template>

<script>
    import SockJs from "sockjs-client";
    import Stomp from "webstomp-client";
    import Vue from 'vue';
    import {VclList} from 'vue-content-loading';
    import { Collapse } from 'ant-design-vue';  
    import 'ant-design-vue/dist/antd.css';  
    import TextareaAutosize from 'vue-textarea-autosize'
    import ChatCommands from './ChatCommands.vue'
    Vue.use(TextareaAutosize)
    Vue.use(Collapse);

    export default {
        name: "ChatPanel",
        components: {
            VclList, ChatCommands
        },
        data() {
            return {
                search: "",
                isSelectedChat: false,
                isActive: false,
                navigation: true,
                navigationRight: true,
                selectedUser: {
                    messages: [],
                    topicChatId: "",
                    senderId: "",
                    sender: "",
                    messageTime: "",
                    read: "",
                    type: '',
                },
                users: [],
                waitUsers: [],
                clicked: false,
                userInfo: [],
                messageText: "",
                stompClient: null,
                lastMessage: "",
                message: {
                    content: "",
                    sender: "",
                    topicChatId: "",
                    type: "",
                    read: '',
                },
                status: "",
                roomId: "",
                userName: "",
                socketConnected: false,
                socketUrl: this.$store.getters.socketApi,
                chatContentHeight: '',
                chatContentPos: '',
                isTypeRead: false,
                url: 'https://mobile.kapitalbank.uz/profile-pic/download/',
                tmp: false,
                accept: {
                    type: String,
                    default: '*' // image/png, image/jpeg, application/pdf, application/vnd.ms-excel
                },
                imgPreview: '',
                isImgPreview: false,
                callCenterId: '',
                sum: 0,
                adminList: [],
                isUserInfo: false,
                loading: true,
                transition: 'scale-transition',
                cardsInfo: [],
                depositsInfo: [],
                isDepositsInfo: false,
                tmpUsers: [],
                isCardsInfo: false,
                setUsers: '',
                isActiveChat: true,
                isWaitChat: true,
                isSearch: false,
                isWalletsInfo: false,
                walletsInfo: [],
                isAccountsInfo: false,
                accountsInfo: [],
                isLoansInfo: false,
                loansInfo: [],
                isHover: false,
                isEdit: false,
                isSelect: false,
                isWaitBlink: false,      
                isChatCommands: false,   
                isChatContentProgress: false,
                contentPage: 1,
                contentTotalPages: '',    
                isCloseChat: false,   
            };
        },
        filters:{
            Timestamp(time){
                if(!time){
                    return '';
                }
                var unix_timestamp = time;
                var date = new Date(unix_timestamp);

                //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = date.getFullYear();
                //var month = months[date.getMonth()];
                var month = "0" + (parseFloat(date.getMonth())+1);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                date = "0" + date.getDate();

                var formattedTime = date.substr(-2) + '.' + month.substr(-2)+ '.' + year;
                return formattedTime;
            }
        },
        watch:{
            messageText(val){
                if(val.length===1&&val==='/'){
                    this.isChatCommands = true;
                }
                else{
                    this.isChatCommands = false;
                }
            },
            search(val){
                if(!this.isActiveChat){
                    this.selectedUser = {
                        messages: [],
                        topicChatId: "",
                        senderId: "",
                        sender: "",
                        messageTime: "",
                        read: "",
                        type: '',
                    };
                }
                this.isActiveChat = true;
                this.setUsers = this.users;
                if(this.isActiveChat){
                    if(this.users.length>0)
                        this.setUsers = this.users;
                    if(val.length>2){
                        // //console.log(val);
                        this.isSearch = true;
                        this.users = this.setUsers;
                        this.setUsers = this.setUsers.filter((x)=>{
                            var re = new RegExp(val.toLowerCase()+'.*')
                            if(x.sender.toLowerCase().match(re)){
                                return x.sender;
                            }
                            // //console.log(x.sender.toLowerCase().match(re))
                        })
                        console.log(this.users);
                    }
                    else if(val.length===0){
                        this.setUsers = this.users;
                        // this.users = '';
                        this.isSearch = false;
                    }
                    // this.setUsers = this.tmpUsers;
                }                              
            },
            // sendMessage(val){
            //     console.log(val)
            // }
        },
        methods: {
            getCardHistory(cardId){
                // this.$router.push({ name: 'cardHistory', params: {chat: 'Temp'}}) 
                let route = this.$router.resolve({ name: 'cardHistory' /*, query: {chat: 'Temp',temp:'1'}*/});
                console.log(cardId);
                this.$store.state.cardId = cardId;
                
                window.open(route.href, '_blank');
            },
            changeEditMessage(){
                this.isEdit= true;
                this.messageText = this.editMessage;
            },
            cancelEditMessage(){
                this.isSelect = false;
                this.isHover = false;
                this.isSelectedChat = false;
                this.isEdit = false;
                this.messageText = '';
            },
            selectChat(message){
                // alert(chatId)
                // this.cancelEditMessage();
                if(this.selectedUser.senderId!=message.senderId){
                    this.isSelectedChat = message.id;
                    this.isHover = message.id;
                    this.editMessage = message.content;
                    // this.isEdit = true;
                    this.isSelect = true;
                }


            },
            setChatOnHold(user, isActiveChat){
                this.search = '';
                let self = this;
                let formData = {
                    'userId': user.senderId,
                    'statusType': 'WAITING'
                }
                console.log(isActiveChat);
                if(isActiveChat){
                    var status = 'WAITING'
                }
                else{
                    var status = 'ACTIVE'
                }
                console.log(user);
                console.log(status);
                self.$http
                    .post(self.$store.getters.chatApiUrl + `/chat/status/${user.topicChatId}/${status}`)
                    .then((response) => {
                        console.log(response);
                        if(response.status === 200){

                            if(isActiveChat){
                                self.users = self.setUsers;
                                // var item = self.users.find( x => x.topicChatId  === user.topicChatId);
                                // self.users.splice(self.users.indexOf(item),1);
                                // self.waitUsers.unshift(item);
                                self.selectedUser = {
                                    messages: [],
                                    topicChatId: "",
                                    senderId: "",
                                    sender: "",
                                    messageTime: "",
                                    read: "",
                                    type: '',
                                };
                        
                            }
                            else{
                                self.waitUsers = self.setUsers;
                                // var item = self.waitUsers.find( x => x.topicChatId  === user.topicChatId);
                                // self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                                // self.users.unshift(item);
                                self.selectedUser = {
                                    messages: [],
                                    topicChatId: "",
                                    senderId: "",
                                    sender: "",
                                    messageTime: "",
                                    read: "",
                                    type: '',
                                };
                          
                            }

                        }

                    }, self.handleError);
            },
            setActiveChat(){
                this.search = '';
                this.setUsers = this.users;
                this.isActiveChat = true;
                this.isActive = false;
                this.isWaitChat = false;
                this.selectedUser = {
                    messages: [],
                    topicChatId: "",
                    senderId: "",
                    sender: "",
                    messageTime: "",
                    read: "",
                    type: '',
                };

            },
            setWaitingChat(){
                this.search = '';
                this.setUsers = this.waitUsers;
                this.isWaitChat = true;
                this.isActive = false;
                this.isActiveChat = false;
                this.selectedUser = {
                    messages: [],
                    topicChatId: "",
                    senderId: "",
                    sender: "",
                    messageTime: "",
                    read: "",
                    type: '',
                };
            },
            getHistory(page, user, size){
                let self = this;      
                console.log('\n\n----GETHISTORY-------------')
                console.log(user.senderId)
                console.log('--------GETHISTORY-------------\n\n')
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/chat/get/detailed/messages?page=${page-1}&size=${size}&senderId=${user.senderId}`)
                    .then(response => {
                        console.log('\n\n----GETHISTORY-------------')
                        console.log(response.data);
                        // let messages = [];
                        // response.data.data.reverse().forEach((x)=>{
                        //     messages = messages.concat(x.messages);
                        //     //console.log(x.messages)
                        // })
                        if(page===1){
                            self.contentPage = 1;
                            self.selectedUser.messages = [];
                        }
                        self.contentTotalPages = response.data.data.totalPages;

                        self.isChatContentProgress = false;

                        self.contentPage++;

                        response.data.data.content.forEach(x=>{
                            self.selectedUser.messages.unshift(x); 
                        })       
                        setTimeout(() => {
                            var elem = document.querySelector(".chat-content"); 
                            elem.scrollTop = 4150;     
                        }, 500)            

                        // self.selectedUser.messages = messages;
                        // self.selectedUser.sender = messages[0].sender;
                        // self.selectedUser.senderId = messages[0].senderId;

                        //console.log(messages)                        
                        
                        // messages.concat(self.selectedUser.messages);
                        // self.selectedUser.messages = messages;
                        // self.selectedUser.messages.reverse();
                        console.log('--------GETHISTORY-------------\n\n')
                        if(page===1)
                            self.scrollToBottom(100);


                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            getCards(senderId){
                ////console.log('getCards')
                let self = this;                
                self.isCardsInfo = false;          
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/user-info/cardInfo/${senderId}`)
                    .then(response => {
                        //self.isUserInfo = true;
                        //self.userInfo = response.data.data;
                        self.cardsInfo = response.data.data;
                        self.isCardsInfo = true;          

                        ////console.log('\n\n-------UserInfo------------')
                        ////console.log(response.data)
                        ////console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            getWallets(senderId){
                ////console.log('getCards')
                let self = this;                
                self.isWalletsInfo = false;          
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/wallet/${senderId}`)
                    .then(response => {
                        //self.isUserInfo = true;
                        //self.userInfo = response.data.data;
                        self.walletsInfo = response.data.data;
                        self.isWalletsInfo = true;          

                        console.log('\n\n-------UserInfo------------')
                        console.log(response.data)
                        console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            getAccounts(senderId){
                ////console.log('getCards')
                let self = this;                
                self.isAccountsInfo = false;          
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/account/${senderId}`)
                    .then(response => {
                        //self.isUserInfo = true;
                        //self.userInfo = response.data.data;
                        self.accountsInfo = response.data.data;
                        self.isAccountsInfo = true;          

                        console.log('\n\n-------UserInfo------------')
                        console.log(response.data)
                        console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            getDeposits(senderId){
                ////console.log('getDeposit: ', senderId)
                let self = this;      
                self.isDepositsInfo = false;          
                self.depositsInfo = []
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/user-info/deposit/${senderId}`)
                    .then(response => {
                        self.isDepositsInfo = true;
                        self.depositsInfo = response.data.data;
                        ////console.log('\n\n-------UserInfo------------')
                        ////console.log(response.data)
                        ////console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            getLoans(senderId){
                ////console.log('getDeposit: ', senderId)
                let self = this;      
                self.isLoansInfo = false;          
                self.loansInfo = []
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/user-info/loan/${senderId}`)
                    .then(response => {
                        self.isLoansInfo = true;
                        self.loansInfo = response.data.data;
                        ////console.log('\n\n-------UserInfo------------')
                        ////console.log(response.data)
                        ////console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            checkSms(number) {
                if (number)
                    return number
                else
                    return 'Нет'
            },
            lastSenderAdmin(user) {
                // //console.log('\n\n--------------------')
                // //console.log(user);
                // //console.log('--------------------\n\n')

                // let arr = user.messages.filter((x) => {
                //     return user.senderId != x.senderId

                // });

                // ////console.log(arr)
                // if(arr[arr.length-1].sender){
                //     return arr[arr.length-1].sender
                // }
                // else{
                //     return '';
                // }
                let adminArr = this.adminList.map((x)=>{
                    return x.userId
                })
                // //console.log(arr)

                // //console.log(arr[arr.length-1])
                // //console.log(arr[arr.length-1])

                // if (arr[arr.length - 1]){
                //     //console.log(arr[arr.length-1])
                //     if(adminArr.indexOf(arr[arr.length-1].senderId)!=-1){
                //         //console.log(arr[arr.length - 1].sender)
                //         return arr[arr.length - 1].sender;
                //     }
                //     else{
                //         //console.log('NO: '+arr[arr.length - 1].sender)
                //         return '';
                //     }
                // }
                // else
                //     return '';
                if(user.messages){
                    if (user.messages[user.messages.length - 1]){
                        // //console.log(user.messages[user.messages.length - 1])
                        if(adminArr.indexOf(user.messages[user.messages.length - 1].senderId)!=-1){
                            // //console.log(user.messages[user.messages.length - 1].sender)
                            return {'isReply' : true, 'answer': user.messages[user.messages.length - 1].sender};
                        }
                        else{
                            // //console.log('NO: '+user.messages[user.messages.length - 1].sender)
                            return {'isReply': false, 'answer' : 'Не игнорируй меня!'};
                        }
                    }
                    else
                        return {'isReply': false, 'answer' : 'Не игнорируй меня!'};
                }
            },
            imagePreview(img) {
                this.isImgPreview = true;
                this.imgPreview = img;
            },
            closeImagePreviw() {
                this.isImgPreview = false;
                this.imgPreview = '';
            },
            onFileChange(e) {
                // e.preventDefault();
                const files = e.target.files || e.dataTransfer.files
                if (!files.length)
                    return
                //this.createFile(files[0])
                // ////console.log(files)
                this.sendFile(files[0]);

            },
            ImageExist(url) {
                var img = new Image();
                img.src = url;
                return img.height != 0;
            },
            scrollFunc() {
                if (document.querySelector(".chat-content")) {
                    const elem = document.querySelector(".chat-content"); // overflow-qoygan class
                    // elem.scrollTop = elem.scrollHeight;
                    if(elem){                    
                        this.chatContentPos = elem.scrollHeight - elem.scrollTop;
                        this.chatContentHeight = elem.clientHeight;
                        console.log('\n\n*****************************************')
                        console.log(elem.scrollTop, ' - ',elem.scrollHeight)
                        console.log( elem.scrollHeight - elem.scrollTop , ' - ', elem.clientHeight)
                        console.log('*****************************************\n\n')
                        if (this.chatContentPos === this.chatContentHeight) {
                            // this.scrollToBottom(100);
                            console.log('READ1: ',this.selectedUser.topicChatId);
                            this.readMessages(this.selectedUser.topicChatId)
                        }
                        if(elem.scrollTop === 0&&!this.isChatContentProgress){
                            if(this.contentPage<=this.contentTotalPages+1){
                                this.isChatContentProgress = true;
                                this.getHistory(this.contentPage, this.selectedUser, 50)
                            }

                        }
                    }
                }
            },

            checkOnRead(read) {
                if (read === false) {
                    return require('@/assets/checkmark.png');
                } else {
                    return require('@/assets/doublecheckmark.png');
                }
            },
            lastMsg(val) {
                // ////console.log('\n\n----------------------')
                // ////console.log(val);
                // ////console.log('----------------------\n\n')

                if (val.sender === this.$store.getters.userName) {
                    if (val.type === "MEDIA") {
                        return "Вы: Фотография"
                    } else {
                        return "Вы: " + val.content;
                    }

                } else {
                    if (val.type === "MEDIA") {
                        return "Фотография"
                    } else {
                        return val.content;
                    }

                }
                // ////console.log('\n\n************** LAST MESSAGE ******************')
                // ////console.log(val)
                // ////console.log('************** LAST MESSAGE ******************\n\n')

            },
            readMessages(topicChatId) {
                let self = this;
                // self.stompClient.unsubscribe(topicChatId);
                console.log('QWERTY:')
                console.log(topicChatId)
                self.$http
                    .post(self.$store.getters.chatApiUrl + `/chat/read/${topicChatId}`)
                    .then((response) => {
                        console.log(response)
                        // self.socketConnected = false;
                        // self.users = [];
                        // self.selectedUser.messages = [];
                        // self.getActiveChatList();
                        // self.userInfo = [];
                        // ////console.log('\n\n----------TEST---------')
                        // ////console.log(response.data)
                        // ////console.log('----------TEST---------\n\n')


                    }, self.handleError);
            },
            closeChat(topicChatId) {
                console.log('\n\n-----TOPICCHATID------')
                console.log(topicChatId);
                console.log('------------------\n\n')
                let self = this;
                self.stompClient.unsubscribe(topicChatId);
                self.$http
                    .post(self.$store.getters.chatApiUrl + `/chat/close/${topicChatId}`)
                    .then(() => {
                        // self.socketConnected = false;
                        // self.users = [];
                        self.selectedUser.messages = [];
                        self.selectedUser = {
                            messages: [],
                            topicChatId: "",
                            senderId: "",
                            sender: "",
                            messageTime: "",
                            read: "",
                            type: '',
                        };
                        if(self.isActiveChat){
                            let item = self.users.find( x => x.topicChatId  === topicChatId);
                            self.users.splice(self.users.indexOf(item),1);
                        }
                        else{
                            let item = self.waitUsers.find( x => x.topicChatId  === topicChatId);
                            self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                        }
                        // self.getActiveChatList();
                        // self.userInfo = [];
                        self.depositsInfo = [];
                        self.cardsInfo = [];
                        self.isCloseChat = true;
                        setTimeout(self.connect, 1000);
                        
                        self.stompClient.connect({}, self.onConnected, self.onError);
                    }, self.handleError);
            },
            connect() {
                let self = this;
                let socket = new SockJs(self.socketUrl);
                self.stompClient = Stomp.over(socket);
                self.stompClient.connect('admin','admin', self.onConnected, self.onError);
                // self.stompClient.connect({}, self.onConnected);

            },
            onConnected() {
                let self = this;
                self.socketConnected = true;
                this.subscribeModerator();
                // this.getActiveChatList();
            },
            subscribeModerator() {
                let self = this;
                self.stompClient.subscribe(
                    "/topic/new-chat",
                    self.onModeratorMessageReceived,
                    {
                        id: "m1",
                        "auto-delete": false
                    }
                );
                //#############
                if(!this.isCloseChat)
                    this.getActiveChatList();


            },
            onModeratorMessageReceived(response) {
                let self = this;
                let message = JSON.parse(response.body);
                self.infoMessage(`${message.sender} is joined to the chat`);
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
                // if (self.users.length !== 0) {
                //     self.selectedUser = newUser;
                // }
                self.users.unshift(newUser);
                self.joinToUserChat(newUser.topicChatId);

                


            },
            joinToUserChat(chatId) {
                let self = this;
                self.status = "user is connected";
                // alert('new')
                self.search = '';
                self.stompClient.subscribe(
                    `/topic/${chatId}`,
                    self.onUserMessageReceived,
                    {id: "u1"}
                );
            },
            onUserMessageReceived(response) {
                let self = this;
                let message = JSON.parse(response.body);
                console.log(message)
                // if(message.userStatus=="ACTIVE"){
                    if(message.chatStatus==="ACTIVE"){
                        var senderUser = self.users.find(
                            user => user.topicChatId === message.topicChatId
                        );
                    }
                    else if(message.chatStatus==="WAITING"){
                        var senderUser = self.waitUsers.find(
                            user => user.topicChatId === message.topicChatId
                        );
                    }
                // }
                // else{
                //     var senderUser = self.waitUsers.filter(
                //         user => user.topicChatId === message.topicChatId
                //     )[0];
                // }
                console.log('\n\n-----Sender User')
                console.log(self.setUsers);
                console.log(senderUser);
                console.log('-------\n\n')

                console.log('\n\n------------------message--------------------')
                console.log(message);
                //console.log(self.users);

                console.log('-------------------------------------\n\n')
                // senderUser.messages.push(message);
                if (message.type === 'READ') {
                    // message.read =  true;
                    //    ////console.log(message);
                    //    message.senderId = 91;
                    // ////console.log('\n\n MSG: ')
                    // ////console.log(self.selectedUser.senderId)
                    // ////console.log(' === \n\n')

                    if (message.senderId == self.selectedUser.senderId) {
                        self.selectedUser.messages.forEach((msg) => {
                            if (message.read === false && msg.senderId != message.senderId) {
                                // if(msg.senderId==self.callCenterId)
                                msg.read = true;
                            }
                        });
                    } else {
                        if(self.isActiveChat){
                            var item = self.users.find(x => x.topicChatId === message.topicChatId);                    
                            if(item)
                                item.unreadCount = 0;
                        }
                        else{
                            var item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);                    
                            if(item)
                                item.unreadCount = 0;
                        }

                        ////console.log('\n\n***************TEST**TEST**TEST*********************')
                        // ////console.log(message.senderId);
                        // ////console.log(item);
                        ////console.log('***************TEST**TEST**TEST*********************\n\n')

                    }
                    self.isTypeRead = false;
                    // self.scrollToBottom(100);
                    // senderUser.messages.push(message);

                    // ////console.log(self.selectedUser.messages)
                } else if (message.type === "MEDIA") {
                    senderUser.messages.push(message);
                    // self.lastMessage = self.users.messages;
                    if (message.sender === self.$store.getters.userName)
                        self.lastMessage = "Вы: Фотография";
                    else self.lastMessage = 'Фотография';

                    self.infoMessage(`${message.sender} : ${message.content}`);
                    self.status = "message is received";
                    const elem = document.querySelector(".chat-content"); // overflow-qoygan class
                    // elem.scrollTop = elem.scrollHeight;
                    if(elem){
                        self.chatContentPos = elem.scrollHeight - elem.scrollTop;
                        self.chatContentHeight = elem.clientHeight;
                        // ////console.log('\n\n################################')
                        // ////console.log('test: ',self.chatContentPos, ' - ', self.chatContentHeight);
                        // ////console.log('################################\n\n')

                        if (message.senderId === self.selectedUser.senderId&&self.chatContentPos === self.chatContentHeight) {
                            self.scrollToBottom(100);
                        }
                    }
                    if(elem&&elem.scrollTop===0&&self.selectedUser.topicChatId===message.topicChatId){
                        // var audio = new Audio(require('@/assets/eventually.mp3')).play(); ****
                        console.log('READ TOP: ',self.selectedUser.topicChatId);
                        self.readMessages(self.selectedUser.topicChatId);                    
                    }

                    if (message.senderId != self.selectedUser.senderId) {
                        var audio = new Audio(require('@/assets/clearly.mp3')).play();
                    }

                    //message.senderId
                    if (message.senderId != self.selectedUser.senderId&&message.senderId!="") {
                        if(self.isActiveChat){
                            let item = self.users.find(x => x.topicChatId === message.topicChatId);
                            if(item){
                                item.unreadCount++;
                                self.users = self.users.filter(x=>x!=item);
                                self.users.unshift(item);

                            }
                        }
                        else{
                            let item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                            if(item){
                                item.unreadCount++;
                                self.waitUsers = self.waitUsers.filter(x=>x!=item);
                                self.waitUsers.unshift(item);

                            }
                        }
                    }
                    else if(message.senderId === self.selectedUser.senderId&&message.senderId!=""){
                        if(self.isActiveChat){
                            let item = self.users.find(x => x.topicChatId === message.topicChatId);
                            if(item){                            
                                    self.users = self.users.filter(x=>x!=item);
                                    self.users.unshift(item);
                            }
                        }
                        else{
                            let item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                            if(item){                            
                                    self.waitUsers = self.waitUsers.filter(x=>x!=item);
                                    self.waitUsers.unshift(item);
                            }
                        }
                    }


                    self.isTypeRead = true;

                } else if (message.type === "CHAT") {
                    senderUser.messages.push(message);
                    // self.lastMessage = self.users.messages;
                    if (message.sender === self.$store.getters.userName)
                        self.lastMessage = "Вы: " + message.content;
                    else self.lastMessage = message.content;

                    self.infoMessage(`${message.sender} : ${message.content}`);
                    self.status = "message is received";
                    const elem = document.querySelector(".chat-content"); // overflow-qoygan class
                    // elem.scrollTop = elem.scrollHeight;
                    console.log('\n\n-----ELEM SCROLL----')
                    console.log(elem)
                    console.log('-----------------\n\n')
                    if(elem){
                        // self.chatContentPos = elem.scrollHeight - elem.scrollTop;
                        // self.chatContentHeight = elem.clientHeight;
                        console.log('\n\n################################')
                        console.log('test: ',self.chatContentPos, ' - ', self.chatContentHeight);
                        console.log('################################\n\n');

                        if (message.senderId === self.selectedUser.senderId&&self.chatContentPos === self.chatContentHeight) {
                            self.scrollToBottom(100);
                        }
                    }
                    if(elem&&elem.scrollTop===0&&self.selectedUser.topicChatId===message.topicChatId){
                        //self.scrollToBottom(100);
                        console.log('READ TOp CHAT: ', self.selectedUser.topicChatId)
                        self.readMessages(self.selectedUser.topicChatId)

                        ////console.log('\n\n---------------------TYPE READ------------------\n')
                        // ////console.log(self.isTypeRead);
                        // ////console.log('\n---------------------########------------------\n\n')
                        // ////console.log('\n\n---------Kol-vo------------')
                        //     ////console.log(message)
                        // ////console.log('---------------------------\n\n')
                    }                   
                    if (message.senderId != self.selectedUser.senderId) {
                        var audio = new Audio(require('@/assets/clearly.mp3')).play();
                    }

                    //message.senderId
                    // //console.log('\n\n-----UNREAD COUNT TEST--------------------')
                    // //console.log(message)
                    // //console.log(self.selectedUser);

                    if (/*message.senderId != self.selectedUser.senderId&&*/message.senderId!="") {
                        if(self.isActiveChat){
                            var item = self.users.find(x => x.topicChatId === message.topicChatId);
                            if(item){
                                item.unreadCount++;
                                self.users.splice(self.users.indexOf(item),1);
                                self.users.unshift(item);
                            }
                        }
                        else{
                            var item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                            if(item){
                                item.unreadCount++;            
                                self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                                self.waitUsers.unshift(item);                            
                            }
                        }
                            // self.waitUsers.find( x => x.unreadCount > 0)
                            console.log("QR:")
                            console.log(self.waitUsers[0])
                            self.checkAnsrewedMessage();
                            console.log(!self.lastSenderAdmin(self.waitUsers[0]).isReply);
                           
                            
                    }

                    // else if(message.senderId === self.selectedUser.senderId&&message.senderId!=""){
                    //     if(self.isActiveChat){
                    //         var item = self.users.find(x => x.topicChatId === message.topicChatId);
                    //         if(item){                                                        
                    //             self.users.splice(self.users.indexOf(item),1);
                    //             self.users.unshift(item);                           
                    //         }
                    //     }
                    //     else{
                    //         var item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                    //         if(item){                                                        
                    //             self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                    //             self.waitUsers.unshift(item);                           
                    //         }
                    //     }
                    // }
                
                    // //console.log(item)
                    // //console.log('-----UNREAD COUNT TEST--------------------\n\n')



                    self.isTypeRead = true;

                } else if (message.type === "LEAVE") {
                    ////console.log(self.selectedUser.senderId);
                    if(self.isActiveChat){
                        let item = self.users.find(x => x.topicChatId === message.topicChatId);
                        self.users.splice(self.users.indexOf(item), 1);
                    }
                    else{
                        let item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                        self.waitUsers.splice(self.waitUsers.indexOf(item), 1);
                    }
                    if(message.topicChatId === self.selectedUser.topicChatId){
                        self.selectedUser = {
                            messages: [],
                            topicChatId: "",
                            senderId: "",
                            sender: "",
                            messageTime: "",
                            read: "",
                            type: '',
                        };
                    }

                }
                else if(message.type === 'CHANGESTATUS'){
                    if(message.chatStatus==='WAITING'){
                        

                        // self.users = self.setUsers;
                        var item = self.users.find( x => x.topicChatId  === message.topicChatId);
                        self.users.splice(self.users.indexOf(item),1);
                        self.waitUsers.unshift(item);

                        self.checkAnsrewedMessage();

                    }
                    else if(message.chatStatus==='ACTIVE'){
                        // let item = self.waitUsers.find(x => x.topicChatId === message.topicChatId);
                        // self.waitUsers.splice(self.waitUsers.indexOf(item), 1);
                        // self.users.unshift(self.item);
                        // self.setUsers = self.waitusers;

                        // self.waitUsers = self.setUsers;
                        var item = self.waitUsers.find( x => x.topicChatId  === message.topicChatId);
                        self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                        self.users.unshift(item);

                        self.checkAnsrewedMessage();
                    }

                }

                // ////console.log(
                //   "\n\n\n\n\n\n\n\n\n\n------------------------------------------------"
                // );
                // ////console.log(message);
                // ////console.log(self.selectedUser);

                // ////console.log(
                //   "---------------------------------------------\n\n\n\n\n\n\n\n\n\n"
                // );

                // self.scrollToBottom(100);
            },
            onError() {
                let self = this;
                // setTimeout(self.connect, 1000);
                self.stompClient.connect({}, self.onConnected, self.onError);
                // setTimeout(location.reload(), 1000);
                self.status = "Reconnecting in 10 seconds";
            },
            sendFile(file) {
                let self = this;
                let data = new FormData();
                data.append('file', file);

                self.$http
                    .post(self.$store.getters.chatApiUrl + "/chat/upload/" + self.selectedUser.topicChatId, data, {headers: {'Content-Type': 'multipart/form-data'}}
                    )
                    .then(() => {
                        self.messageText = "";
                    }, self.handleError);
                self.scrollToBottom(100);

            },
            sendRateMessage(lang){
                if(lang==='RUS')
                    this.messageText = 'Надеемся мы смогли вам помочь по вашему обращению, надеемся на вашу взаимопомощь. Оцените пожалуйста наше приложение по ссылке http://onelink.to/36gza5 . Заранее благодарим :)';
                else if(lang==='UZB')
                    this.messageText = "Murojaatingiz bo'yicha Sizga yordam bera oldik degan umiddamiz va o'zaro yordam berishingizni so'raymiz. Iltimos, bizning ilovamizni http://onelink.to/36gza5 havola bo'yicha baholang. Oldindan rahmat :)";
                this.sendMessage();
            },
            sendMessage() {
                let self = this;                
                // if(self.messageText==='\n'){
                //     alert('test')
                // }
                if(self.messageText ==='\n')
                    self.messageText = '';
                if (self.messageText && self.stompClient) {
                    if(self.messageText.slice(-1)==='\n')
                        self.messageText = self.messageText.slice(0,-1);
                    self.setChatMessage();
                    self.$http
                        .post(self.$store.getters.chatApiUrl + "/chat/send", self.message)
                        .then(() => {
                            self.messageText = "";                        
                                
                        //    if(self.isActiveChat){
                                // self.users = self.tmpUsers;
                                // self.setUsers = self.tmpUsers;
                                if(self.isSearch){
                                    self.setUsers = self.users;
                                    // self.users = self.tmpUsers;
                                }
                                let item = self.setUsers.find(x => x.topicChatId === self.selectedUser.topicChatId);
                                self.setUsers.splice(self.setUsers.indexOf(item),1);
                                if(item){                                        
                                    // self.users.unshift(...self.users.splice(item,1));                                        
                                    self.setUsers = self.setUsers.filter(x=>x!=item);
                                    console.log(item);                         
                                    item.unreadCount = 0;           
                                    self.setUsers.unshift(item);
                                    console.log(self.users);
                                    if(self.isActiveChat)
                                        self.users = self.setUsers;
                                    else    
                                        self.waitUsers = self.setUsers;
                                    // self.tmpUsers = self.users;
                                    if(self.isSearch){
                                        self.setUsers = self.users
                                        self.search = '';
                                    }                                    
                                }
                        //    } 
                            // else{
                            //     console.log(self.waitUsers)
                            //     console.log(self.selectedUser);
                            //     // self.waitUsers = self.tmpUsers;
                                
                            //     let item = self.waitUsers.find(x => x.topicChatId === self.selectedUser.topicChatId);
                            //     self.waitUsers.splice(self.waitUsers.indexOf(item),1);
                            //     if(item){                                        
                            //         // self.users.unshift(...self.users.splice(item,1));                                        
                            //         self.waitUsers = self.waitUsers.filter(x=>x!=item);
                            //         console.log(item);                         
                            //         item.unreadCount = 0;           
                            //         self.waitUsers.unshift(item);
                            //         // console.log(self.waitUsers);
                            //         self.setUsers=self.waitUsers;
                            //         // self.tmpUsers = self.waitUsers;
                            //     }
                            // }                                  
                            
                                
                        }, self.handleError);
                    // self.readMessages(self.message.topicChatId);
                    self.scrollToBottom(200);
                } else {
                    self.infoMessage("please enter message or connect to the chat!");
                }
            },
            setChatMessage() {
                let self = this;
                self.message.sender = self.$store.getters.userName;
                self.message.content = self.messageText;
                self.message.type = "CHAT";
                self.message.topicChatId = self.selectedUser.topicChatId;
                self.message.read = false;

            },
            sendEditMessage() {
                let self = this;              
                if(self.messageText==='\n')
                    self.messageText = '';
                if (self.messageText && self.stompClient) {
                    self.message.sender = self.$store.getters.userName;
                    self.message.id = self.isHover;
                    self.message.content = self.messageText;
                    self.message.type = "CHAT";
                    self.message.topicChatId = self.selectedUser.topicChatId;
                    self.message.read = false;
                    self.$http
                        .put(self.$store.getters.chatApiUrl + "/chat/message", self.message)
                        .then((response) => {
                            console.log(response);
                            if(response.status===200){
                                self.selectedUser.messages = self.selectedUser.messages.map(x=>{
                                    if(x.id===self.message.id){
                                        x.content = self.messageText;
                                        return x;
                                    }
                                    else{
                                        return x;
                                    }
                                    console.log(x)
                                });
                                self.cancelEditMessage();

                            }
                            
                                
                        }, self.handleError);
                
                } else {
                    self.infoMessage("please enter message or connect to the chat!");
                }
            },
            updateClientInfo(senderId){
                let self = this;
                self.$http
                .post(self.$store.getters.chatApiUrl + `/user/update/${senderId}`)
                .then(response => {
                
                    console.log('\n\n-------ClientInfo------------')
                    console.log(response.data)
                    console.log('---------ClientInfo------------\n\n')
                    if(response.status===200){
                        location.reload();
                    }

                })
                .catch(error => {
                    // ////console.log(error);
                })
            },
            getUserInformation(senderId) {
                // ////console.log('\nTEST\n');
                let self = this;
                self.userInfo = [];
                self.cardsInfo = [];
                self.depositsInfo = [];
                self.isUserInfo = false;
                self.$http
                    .get(self.$store.getters.chatApiUrl + `/user-info/${senderId}`)
                    .then(response => {
                        self.isUserInfo = true;
                        self.userInfo = response.data.data;
                        ////console.log('\n\n-------UserInfo------------')
                        ////console.log(self.userInfo)
                        ////console.log('---------UserInfo------------\n\n')

                    })
                    .catch(error => {
                        // ////console.log(error);
                    })
            },
            changeChatRoom(user) {
                this.cancelEditMessage();
                this.isHover = false;
                let self = this;
                this.isActive = user.topicChatId;
                self.selectedUser = user;
                if(this.isActiveChat){
                    let item = self.users.find(x => x.senderId === user.senderId);
                    console.log(user);
                    item.unreadCount = 0;


                }
                else{
                    let item = self.waitUsers.find(x => x.senderId === user.senderId);
                    item.unreadCount = 0;

                    console.log(item);
                }
                // //console.log('\n\n####################################\n\n')
                // //console.log(user)
                // //console.log('\n\n####################################\n\n')
                self.getHistory(1, user, 50)
                self.getUserInformation(user.senderId);
                console.log('READ: ',user.topicChatId);
                self.readMessages(user.topicChatId);
                self.scrollToBottom(100);

            },
            scrollToBottom(time) {
                setTimeout(() => {
                    if (document.querySelector(".chat-content")) {
                        const elem = document.querySelector(".chat-content"); // overflow-qoygan class
                        elem.scrollTop = elem.scrollHeight;
                        // ////console.log('\n\nScrollTOBottom\n\n')
                        // this.readMessages(this.selectedUser.topicChatId)
                    }
                }, time);
            },
            getActiveChatList() {
                let self = this;
                self.users = [];
                self.waitUsers = [];
                self.$http
                    .get(self.$store.getters.chatApiUrl + "/chat/online")
                    .then(response => {
                        // ////console.log("\n\n\n******************************************");
                        // ////console.log(response.data);
                        // ////console.log("******************************************\n\n\n");
                        // self.users = response.data.data;
                        // if(newUser.statusType==="ACTIVE")                
                        //     self.users.unshift(newUser);
                        // else if(newUser.statusType === "WAITING")
                        //     self.waitUsers.unshift(newUser);
                        response.data.data.forEach(user=>{
                            if(user.statusType==="ACTIVE"){
                                self.users.push(user);
                                self.joinToUserChat(user.topicChatId);
                            }
                            else if(user.statusType==="WAITING"){
                                self.waitUsers.push(user);
                                self.joinToUserChat(user.topicChatId);
                            }
                        })
                        self.setActiveChat();
                        self.checkAnsrewedMessage();
                        // self.users.forEach(user => {
                        //     // ////console.log('AAA: '+user);
                        //     self.joinToUserChat(user.topicChatId);
                        // });
                    }, self.handleError);
            },
            getUserInfo() {
                let self = this;
                self.$http.get(self.$store.getters.chatApiUrl + "/user")
                    .then(response => {
                        //self.userInfo = response.data.data;
                        // ////console.log(response.data.data);
                        self.callCenterId = response.data.data.userId;
                        self.phoneNumber = self.userInfo.phoneNumber;
                        self.firstname = self.userInfo.firstName;
                        self.lastname = self.userInfo.lastName;
                        this.$store.state.userName = response.data.data.firstName + " " + response.data.data.lastName;
                    }, self.handleError);
            },
            getAdminList() {
                let self = this;
                self.$http.get(self.$store.getters.chatApiUrl + "/admin-list")
                    .then(response => {
                        //self.userInfo = response.data.data;
                        self.adminList = response.data.data;
                        // let tmp = self.adminList.find(x=>x.firstName==='Хилола')
                        // console.log(tmp)
                        console.log('\n\n----------ADMIN LIST--------------')
                        console.log(response.data.data);
                        console.log('\n\n-----------=========--------------')

                    }, self.handleError);
            },   
            checkAnsrewedMessage(){
                for(var i=0;i<this.waitUsers.length;i++){
                    if(!this.lastSenderAdmin(this.waitUsers[i]).isReply){                        
                        this.isWaitBlink = true;
                        break;
                    }
                    else{
                        this.isWaitBlink = false;
                    }
                }
            }         
            
        },

        computed: {
            checkAdmin(){
                // alert(localStorage.getItem('roles'));
                if(localStorage.getItem('roles')==='"ADMIN"'||localStorage.getItem('roles')==='"HEAD_CALL_CENTER"'){
                    return true;
                }
                else{
                    return false;
                }
            },
            chatStatus(){
                if(this.isActiveChat){
                    return 'В ожидание'
                }
                else{
                    return 'В активные'
                }
            },
            emptyCard(){
                if(this.cardsInfo.length!=0){
                    return '';
                }
                else{
                    return 'Пусто';
                }
            },
            emptyDeposit(){
                if(this.depositsInfo.length!=0){
                    return '';
                }
                else{
                    return 'Пусто';
                }
            },
            emptyWallet(){
                if(this.walletsInfo.length!=0){
                    return '';
                }
                else{
                    return 'Пусто';
                }
            },
            emptyAccount(){
                if(this.accountsInfo.length!=0){
                    return '';
                }
                else{
                    return 'Пусто';
                }
            },
            emptyLoan(){
                if(this.loansInfo.length!=0){
                    return '';
                }
                else{
                    return 'Пусто';
                }
            },
            messagingUser() {
                return this.selectedUser;
            },
            userType() {
                if (this.userInfo.userType === "NON_CLIENT") {
                    return 'НЕ КЛИЕНТ'
                } else {
                    return 'КЛИЕНТ'
                }
            },
            userState() {
                if (this.userInfo.userState === "DELETED") {
                    return 'УДАЛЕН'
                } else {
                    return false; // чтобы если пользователь активен этого не показывать
                }
            }
        },
        mounted() {
            this.getAdminList();
            this.getUserInfo();
            this.connect();
            // this.getActiveChatList();
        }
    };
</script>

<style scoped src="../../assets/css/chat.css">
</style>
