<template>
    <div>
        <div class="main">
            <div class="left-child">
                <div class="tmp">                    
                    <p class="call-text">Архив чат</p>                    
                </div>
                <div class="search-input">
                    <img draggable="false" src="@/assets/search-icon.png" class="search-icon" alt/>
                    <input type="text" class="search-input-text" v-model="search" placeholder="Поиск"/>
                    <v-btn text small depressed v-if="search.length!=0" class="search-btn" @click="searchUsers(0)">Найти</v-btn>
                </div>
                <div class="left-child-box" @scroll="scrollFunc">
                    <div
                            :class="['chat-list',{'active': isActive === user.senderId}]"
                            v-for="(user, i) in users"
                            :key="i"
                            @click.stop="changeChatRoom(user)"
                    >
                        <!-- <img draggable="false" v-if="ImageExist(url+user.phone+'.png')" class="user-icon" :src="url+user.phone+'.png'" alt/> -->
                        <img draggable="false" class="user-icon" src="@/assets/avatar-icon.png" alt/>
                        <!-- {{user.unreadCount}} -->

                        <span class="user-list">
                    <!-- <v-btn @click="closeChat(selectedUser.topicChatId)">Закрыть чат</v-btn> -->
                            <!-- {{user}} -->
                            <span class="user-list-name">{{user.sender}}</span>
                            <span class="close-chat-box">{{user.call_center_name}}</span>

                        </span>
                    </div>
                </div>
            </div>
            <div class="right-child" v-show="selectedUser.messages.length">
                <!-- {{selectedUser}} -->
                <div class="right-child-header">{{selectedUser.sender}}</div>
                <div v-if="isChatContentProgress" class="progress-circular">
                    <v-progress-circular style="height:23px; width: 23px;"            
                    indeterminate
                    color="amber"
                    ></v-progress-circular>  
                </div>  
                <div @scroll="scrollMessage" class="chat-content">
                    <div
                            :class="[selectedId===message.messages[0].senderId ? 'chat-content-box' : 'call-chat-content']"
                            v-for="message in selectedUser.messages"
                            :key="message.messageId"
                    >
                        <!-- <p class="chat-content-text">{{message.messages}}</p> -->
                        <img  @click="imagePreview(message.messages[0].content)" class="image" v-if="message.messages[0].type==='MEDIA'"
                            :src="message.messages[0].content"/>
                        <p v-else class="chat-content-text">{{message.messages[0].content}}</p>
                        <span class="chat-content-time">
                            <p v-if="selectedId!=message.messages[0].senderId" class="chat-content-time chat-content-sender">{{message.messages[0].sender}}</p>
                            <p v-else class="chat-content-time"></p>
                            <span style="display: flex;">
                                <p class="chat-content-time">{{message.messages[0].messageTime | Timestamp}} {{message.messages[0].messageTime | millis-to-time}}</p>
                                <img draggable="false" v-if="message.messages[0].senderId!=selectedUser.senderId" class="check-mark"
                                    :src="checkOnRead(message.messages[0].read)" alt="checkmark">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="chat-info" v-show="selectedUser.messages.length">
                <!-- {{userInfo}} -->
                <div class="row">
                    <p class="chat-info-header">Информация</p>
                </div>
                <div v-if="isUserInfo" class="user-info">
                    <!-- {{userInfo}} -->
                    <!-- {{selectedUser.sender}} - {{selectedUser.senderId}} -->
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
                                <!-- {{userInfo}} -->
                                <p v-show="userInfo.appVersion[0]==='A'" class="user-info-box-child-1"><img draggable="false" class="version" src="@/assets/android.png" alt="version"> {{userInfo.appVersion}}</p>
                                <p v-show="userInfo.appVersion[0]==='I'" class="user-info-box-child-1"><img draggable="false" class="version" src="@/assets/apple.png" alt="version"> {{userInfo.appVersion}}</p>
                                <p v-show="userInfo.appVersion=='null'" class="user-info-box-child-1">Неопознанное устройство</p>
                                <p class="user-info-box-child-2">Версия приложения</p>
                        </span>
                        <span class="user-cards-box">
                            <v-expansion-panel>
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="list-box" @click="getCards(selectedId)">Карты</div>
                                    </template>
                                    <div class="expansion-panel-child">
                                        <vcl-list v-if="!isCardsInfo"></vcl-list>
                                        <span                                   
                                        v-else
                                        :class="['user-card', card.state==='ACTIVE' ? 'active-card' : 'passive-card']"
                                        v-for="(card,index) in cardsInfo"
                                        :key="index"
                                        >
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
                                        <div class="list-box" @click="getDeposits(selectedId)">Вклады</div>
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
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import {VclList} from 'vue-content-loading';
export default {
    name: 'ArchiveChat',
    components:{
        VclList
    },
    data(){
        return {
            users: [],
            isActive: false,
            search: '',
            tmpUsers: [],
            selectedUser: {
                messages: [],
                topicChatId: "",
                senderId: "",
                sender: "",
                messageTime: "",
                read: "",
                type: '',
            },
            userInfo : [],
            cardsInfo : [],
            depositsInfo : [],
            isUserInfo : false,
            imgPreview: '',
            isImgPreview: false,
            isDepositsInfo: false,
            isCardsInfo: false,
            cardsInfo: [],
            depositsInfo: [],
            totalPages: '',
            curPage: 1,
            isSearch: false,
            contentTotalPages: '',
            isChatContentProgress: false,
            contentPage: 1,
            selectedId: '',
            

        }
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
    computed:{
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
    },
    watch:{
        search(val){
            if(!val){
                this.getArchiveChat(0);
            }
        }
    },
    methods:{
        scrollMessage(){
            const elem = document.querySelector(".chat-content"); // overflow-qoygan class
            // elem.scrollTop = elem.scrollHeight;
            if(elem){                    
                this.chatContentPos = elem.scrollHeight - elem.scrollTop;
                this.chatContentHeight = elem.clientHeight;
                console.log('\n\n*****************************************')
                console.log(elem.scrollTop, ' - ',elem.scrollHeight)
                console.log( elem.scrollHeight - elem.scrollTop , ' - ', elem.clientHeight)
                console.log('*****************************************\n\n')
                if(elem.scrollTop === 0&&!this.isChatContentProgress){
                    if(this.contentPage<=this.contentTotalPages+1){
                        this.isChatContentProgress = true;
                        console.log(this.selectedUser);
                        this.getHistory(this.contentPage, 50, this.selectedId)
                    }

                }
            }
        },
        scrollFunc() {
            if (document.querySelector(".left-child-box")) {
                const elem = document.querySelector(".left-child-box"); // overflow-qoygan class
                // elem.scrollTop = elem.scrollHeight;
                if(elem){                    
                    this.chatContentPos = elem.scrollHeight - elem.scrollTop;
                    this.chatContentHeight = elem.clientHeight;
                    console.log('\n\n*****************************************')
                    console.log(this.chatContentPos, ' - ', this.chatContentHeight)
                    console.log( elem.scrollHeight - elem.scrollTop)
                    console.log('*****************************************\n\n')
                    if(this.chatContentPos===this.chatContentHeight){
                        console.log(this.curPage, ' - ', this.totalPages)
                        if(this.curPage<=this.totalPages+1){
                            if(this.isSearch)
                                this.searchUsers(this.curPage);
                            else
                                this.getArchiveChat(this.curPage);
                            this.curPage++;
                        }
                    }
                
                }
            }
        },
        checkSms(number) {
            if (number)
                return number
            else
                return 'Нет'
        },
        // getTotalChats(){
        //     let self = this;
        //     self.$http
        //         .get(self.$store.getters.apiUrl + '/chat/admin/archive/total-chats')
        //         .then(response=>{
        //             console.log(response.data);
        //             self.totalPages = response.data.data;
        //             self.getArchiveChat(0);

        //         })
        // },
        searchUsers(page){
            let self = this;
            if(page===0){
                self.users = [];
                self.curPage = 1;
                const elem = document.querySelector(".left-child-box");
                elem.scrollTop = 0;
            }
            self.isSearch = true;
            self.$http
                .get(self.$store.getters.apiUrl + '/chat/admin/archive', {
                    params:{
                        sender: this.search,
                        page: page,
                        size: 20,
                    }
                })
                .then(response=>{
                    console.log(response.data);
                    // self.users = response.data.data;
                    response.data.data.content.forEach((x)=>{
                        self.users.push(x);
                    })
                    self.totalPages = response.data.data.totalPages;
                
                })
        },
        getArchiveChat(page){
            let self = this;
            if(page===0){
                self.users = [];
                self.curPage = 1;
                const elem = document.querySelector(".left-child-box");
                elem.scrollTop = 0;
            }
            this.isSearch = false;
            self.$http
                .get(self.$store.getters.apiUrl + "/chat/admin/archive", {
                    params:{
                        page: page,
                        size: 20,
                    }
                })
                .then(response => {
                    // console.log(response.data.data)
                    response.data.data.content.forEach((x)=>{
                        self.users.push(x);
                    })
                    self.totalPages = response.data.data.totalPages;

                    // console.log(self.users)
                }, self.handleError);
        },
        checkOnRead(read) {
            if (read === false) {
                return require('@/assets/checkmark.png');
            } else {
                return require('@/assets/doublecheckmark.png');
            }
        },
        changeChatRoom(user) {
                let self = this;
                this.isActive = user.senderId;
                self.selectedId = user.senderId;      
                console.log(user)      
                self.getHistory(1,50, user.senderId)
                self.getUserInformation(user.senderId);
                self.scrollToBottom(300);

        },
        getHistory(page, size, userId){
            let self = this;      
            self.$http
                .get(self.$store.getters.apiUrl + '/chat/admin/history', {
                    params:{
                        'userId': userId,
                        page: page-1,
                        size: size,
                    }
                })
                .then(response => {
                    console.log('\n\n----GETHISTORY-------------')
                    console.log(response.data);
                    console.log('--------GETHISTORY-------------\n\n')
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
                    if(page===1)
                        self.scrollToBottom(100);



                })
                .catch(error => {
                    // ////console.log(error);
                })
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
        getUserInformation(senderId) {
            // ////console.log('\nTEST\n');
            let self = this;
            self.userInfo = [];
            self.cardsInfo = [];
            self.depositsInfo = [];
            self.isUserInfo = false;
            self.$http
                .get(self.$store.getters.apiUrl + `/user-info/${senderId}`)
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
        imagePreview(img) {
            this.isImgPreview = true;
            this.imgPreview = img;
        },
        closeImagePreviw() {
            this.isImgPreview = false;
            this.imgPreview = '';
        },
        checkAndroid(val){
            if(val[0] ==="A"){
                return true;
            }
            else if(val[0] ==="I"){
                return false;
            }

        },
        getCards(senderId){
                ////console.log('getCards')
            let self = this;                
            self.isCardsInfo = false;          
            self.$http
                .get(self.$store.getters.apiUrl + `/user-info/cardInfo/${senderId}`)
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
        getDeposits(senderId){
            ////console.log('getDeposit: ', senderId)
            let self = this;      
            self.isDepositsInfo = false;          
            self.depositsInfo = []
            self.$http
                .get(self.$store.getters.apiUrl + `/user-info/deposit/${senderId}`)
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
    },
    mounted(){
        // this.getTotalChats();
        this.getArchiveChat(0);

    }
}
</script>

<style scoped>
    .active-chat{
        background: linear-gradient(133deg, #e6e6e6, #bcbcbc2b);
        color: #A3A3A3;
        padding: 10px;
        height: 48px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 7px 7px 0px 7px;
        border-radius: 7px 7px 0 0;
        background: #FFFF;
    }
    .progress-circular{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
    }
    .waiting-chat{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 10px;
        /* background: #DDDDDD;
        margin: 10px;
        border-radius: 10px;
        color: #FFFF; */
    }   
    .search-btn{
        border-radius: 16px;
        color: #205a69;
        background: #f9ca038c !important;
    }
    .active-box{
        background: #F3F3F3;
        width: 100%;
        margin: 10px 0;
        display: flex;
    }
    .version{
        width: 35px;
        height: 35px;
    }
    .list-box{
        margin: -23px;
        width: 100%;
        height: 100%;
        padding: 15px;
    }
    .user-deposit-child{
        margin: 5px 8px;
        font-size: 11px;
    }
    .expansion-panel-child{
        background: #FFFF;
        padding: 10px;
    }
    .v-expansion-panel__container{
        background-color: #f9df6f !important;
    }
    .v-expansion-panel{
        width: 99% !important;
    }
    .user-card-sms {
        margin: 0px 10px 10px;
        font-size: 11px;
    }

    .user-list-admin-box {
        /* background: #82d05b; */
        background: #76d680;
        margin: 8px 0 0px 0px;
        /* padding: 2px 2px 2px 10px; */
        padding: 2px;
        text-align: center;
        width: 145px;
        -o-text-overflow: ellipsis;
           text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        border-radius: 15px;
        color: #1d1d1d;
        /* font-weight: 600; */
        font-size: 11px;
    }
    .close-chat-box{
        background: #f57a7a;
        margin: 8px 0 0px 0px;
        /* padding: 2px 2px 2px 10px; */
        padding: 2px;
        text-align: center;
        width: 145px;
        -o-text-overflow: ellipsis;
           text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        border-radius: 15px;
        color: #fdfdfd;
        /* font-weight: 600; */
        font-size: 11px;
    }
    .reply-to-customer {
        /* background: #82d05b; */
        background: #ff6d6a;
        margin: 8px 0 0px 0px;
        /* padding: 2px 2px 2px 10px; */
        padding: 2px;
        text-align: center;
        width: 145px;
        -o-text-overflow: ellipsis;
           text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        border-radius: 15px;
        color: #ffffff;
        /* font-weight: 600; */
        font-size: 11px;
    }

    .user-list-msg {
        background: #ffce00;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        height: 20px;
        padding: 10px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        border-radius: 40px;
        font-weight: 700;
        color: #403b03;
    }

    .user-list-box {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
    }

    .close-image-preview {
        margin: 15px;
        background: #4a4a4aa8 !important;
        color: #d4d4d4 !important;
    }

    .image-preview {
        position: fixed;
        background: #000000d1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    input[type="file"] {
        display: none;
    }

    .chat-content-sender {
        margin: 10px 20px 0 0 !important;
        background: #b2dab091;
        padding: 2px 5px;
        border-radius: 8px;
    }

    .file-box {
        margin: auto
    }

    .file-image {
        width: 35px;
        height: 35px;
        margin: auto 0px auto 7px;
        cursor: pointer;
    }

    .image {
        /* width: 345px; */
        height: 215px;
        cursor: pointer;
    }

    .close-chat:hover {
        background: #FF6565;
    }

    .close-chat {
        width: 125px;
        height: 30px;
        background: #9a9898;
        border-radius: 50px;
        color: #FFFF;
        margin-top: 10px;
    }

    .deleted-user-child {
        margin: 0;
    }

    .deleted-user-box {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        background: #f96666;
        padding: 10px;
        border-radius: 10px;
        margin: 0 0 10px;
        color: #FFFF;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
    }

    .check-mark {
        width: 15px;
        height: 12px;
        margin: 5px 0px 5px 10px;
    }

    .row {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .cards-box {
        overflow: auto;
        height: 210px;
    }

    .user-cards-header {
        text-align: center;
    }

    .user-cards-info {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .user-cards-info-child {
        margin: 0 8px 8px;
        font-style: italic;
        color: #9c9c9c;
        font-size: 12px;
        text-align: center;
    }

    .active-card {
        background-color: #76d680;
    }

    .passive-card {
        background-color: #ec6f6f;
    }

    .user-card {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;

        border-radius: 10px;
        margin: 5px 0;
        width: 100%;
        width: 100%;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-flow: wrap;
            flex-flow: wrap;
        /* line-height: 11px; */
        padding: 5px;
        
    }

    .user-card-child {
        margin: 10px;
        font-size: 11px;
    }

    .user-cards-box {
        overflow: auto;
        height: 100%;
    }

    .user-info {
        margin: 20px 10px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow: auto;
        height: 84%;
    }

    .user-name {
        font-size: 17px;
        font-weight: 600;
    }

    .user-info-box-child-1 {
        margin: 0;
    }

    .user-info-box-child-2 {
        font-style: italic;
        color: #9c9c9c;
    }

    .chat-info-header {
        margin: 10px;
        font-size: 20px;
    }

    .chat-info {
        width: 300px;
        background-color: #ffff;
        border-left: 1px solid #c0c0c094;
        padding: 10px;
    }

    .send-icon {
        height: 29px;
        margin: auto 15px;
        cursor: pointer;
    }

    .chat-content-box {
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        background: #ffff;
        /* padding: 10px; */
        padding: 10px 10px 3px 10px;
        border-radius: 10px;
        margin: 10px 0;
        -webkit-transform: translateX(0%);
        -ms-transform: translateX(0%);
        transform: translateX(0%);
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        max-width: 500px;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .chat-content-time {
        margin: 0;
        font-style: italic;
        /* margin: 0 0 0 45px; */
        /* margin: 10px 0 0 10px; */
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: end;
        -ms-flex-align: end;
        align-items: flex-end;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        font-size: 12px;
    }

    .chat-content-text {
        margin: 0;
    }

    .chat-content {
        height: 100%;
        overflow: auto;
        padding: 15px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .call-chat-content {
        -webkit-transform: translateX(-100%);
        -ms-transform: translateX(-100%);
        transform: translateX(-100%);
        position: relative;
        left: 100%;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        background: #effdde;
        padding: 10px 10px 3px 10px;
        border-radius: 10px;
        margin: 10px 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        max-width: 500px;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .chat-input-box {
        background-color: #ffff;
        /* height: 75px; */
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .chat-input {
        width: 100%;
        margin: 10px;
    }

    .right-child-header {
        width: 100%;
        height: 60px;
        background: #ffff;
        border-bottom: 1px solid silver;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 20px;
    }

    .left-child-box {
        height: 100%;
        overflow: hidden;
    }

    .right-child {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 5px;
        background: #eaeaea;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }

    .left-child-box:hover {
        overflow: auto;
    }

    .user-list-lastmsg {
        color: #969696;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 170px;
    }

    .user-list-name {
        font-weight: 600;
        color: #655454;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .user-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        margin: 0 0 0 10px;
        width: 200px;
        justify-content: center;
    }

    .user-icon {
        width: 50px;
        height: 50px;
        margin: auto 0;
        border-radius: 40px;
    }

    .chat-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 10px 10px;
        cursor: pointer;
    }

    .chat-list:hover {
        background-color: #ffc40026;
    }

    .active {
        background-color: #fbc10075;
    }

    .active:hover {
        background-color: #fbc10075;
    }

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
        -webkit-box-shadow: 0px 0px 15px 0px rgba(183, 183, 183, 0.88);
        box-shadow: 0px 0px 15px 0px rgba(183, 183, 183, 0.88);
    }

    .left-child {
        background: white;
        width: 300px;
        height: 100%;
        /* border-radius: 10px; */
        /* margin: 15px; */
        border-right: 1px solid silver;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .tmp {
        background: #f9ca038c;
        height: 56px;
        width: 95%;
        border-radius: 9px;
        margin: 10px auto;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .call-icon {
        width: 35px;
    }

    .call-text {
        margin: 0 10px;
        color: #205b69;
        font-size: 17px;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .search-input {
        background: #dededebd;
        height: 50px;
        margin: 14px;
        border-radius: 29px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .search-input:active,
    :hover,
    :focus {
        outline: 0;
        outline-offset: 0;
    }

    .search-icon {
        width: auto;
        height: 16px;
        margin: auto 10px auto 14px;
    }

    .search-input-text {
        width: 75%;
    }

    .blink {
    animation-name: blinker;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(1.0,2.0,0,1.0);
    animation-duration: 1s;
    -webkit-animation-name: blinker;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: cubic-bezier(1.0,2.0,0,1.0);
    -webkit-animation-duration: 1s;
    }
    
    @keyframes blinker {
    from { opacity: 1.0; background-color: #ffc3c3 }
    to { opacity: 1.0;  }
    }
    
    @-webkit-keyframes blinker {
    from { opacity: 1.0; }
    to { opacity: 1.0; }
    }
</style>