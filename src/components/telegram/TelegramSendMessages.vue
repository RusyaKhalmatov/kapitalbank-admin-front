<template>
    <div style="width: 100%;">
        <span class="header">
            <h1>{{msg}}</h1> 
            <h2>Количество пользователей - {{userCount}}</h2>
            <span class="lang-box">
                <span :class="[lang==='RU' ? 'lang-box-child': 'lang-box-tmp']">
                    <img draggable="false" @click="setLang('RU')" class="lang-flag" src="@/assets/russia.png" alt="">
                </span>
                <span :class="[lang==='UZ' ? 'lang-box-child': 'lang-box-tmp']">
                    <img draggable="false" @click="setLang('UZ')" class="lang-flag" src="@/assets/uzbekistan.png" alt="">
                </span>
            </span>
        </span>        
        <template v-if="isRemove">
            <div class="remove-box">
                <h3>Вы действительно хотите удалить кнопку?</h3>                
                <span style="display: flex">
                    <v-btn @click="deleteMessage(id)">Удалить</v-btn>
                    <v-btn @click="isRemove=false">Отмена</v-btn>
                </span>
            </div>
            <div class="bg" @click="isRemove=false"></div>
        </template>
        <transition name="fade">
            <div class="send-file">
                <h2 class="send-file-header">Отправить сообщение</h2>                    
                <div class="add-buttons">
                    <button @click="addImg('send')" :class="['btn', {'btn-selected': items.indexOf('image')!=-1}]">Добавить изображение</button>
                    <button @click="addVideo('send')" :class="['btn', {'btn-selected': items.indexOf('video')!=-1}]">Добавить видео</button>
                    <button @click="addFile('send')" :class="['btn', {'btn-selected': items.indexOf('file')!=-1}]">Добавить файл</button>
                    <button @click="addContent('send')" :class="['btn', {'btn-selected': items.indexOf('content')!=-1}]">Добавить контент</button>
                    <button @click="addBtns('send')" :class="['btn', {'btn-selected': items.indexOf('button')!=-1}]">Добавить кнопку</button>
                </div>
            
                <div v-if="isErrorMsg" class="error-div">{{errorMsg}}</div>
                <div v-if="isSuccessMsg" style="background: #54b323" class="error-div">{{successMsg}}</div>

                
                <div class="content">                             
                    <div v-for="(item, index) in items" :key="index" class="content-child">
                        <template v-if="item==='image'">
                            <div class="content-child-header">
                                <span class="order">{{orderMsg.indexOf('I')+1}}</span>
                                <img @click="closeImg('send')" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                            </div>
                            <div class="content-child-box">
                                <div v-if="!imgPreview" class="input-file-box">
                                    <p class="input-file-text">Выбрать изображение</p>
                                    <input  class="input-file" type="file" accept="image/*"  @change="onImageChange($event)" >
                                </div>
                                <div class="set-center" v-else>
                                    <img class="image-preview" :src="imgPreview" alt="">
                                    <v-btn style="position:absolute;" class="delete-preview" @click="deleteImg">Удалить</v-btn>
                                </div>
                            </div>
                        </template>
                        <template v-if="item==='video'">
                            <div class="content-child-header">
                                <span class="order">{{orderMsg.indexOf('V')+1}}</span>
                                <img @click="closeVideo('send')" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                            </div>
                            <div class="content-child-box">
                                <div v-if="!videoPreview"  class="input-file-box">
                                    <p class="input-file-text">Выбрать видео</p>
                                    <input class="input-file" type="file"  accept="video/*" @change="onVideoChange($event)" >
                                </div>
                                <div class="set-center" v-else>
                                    <video class="image-preview" autoplay  muted controls>
                                        <source :src="videoPreview" type="video/mp4">
                                    </video>
                                    <v-btn  style="position:absolute;" class="delete-preview" @click="deleteVideo">Удалить</v-btn>
                                </div>
                            </div>
                        </template>
                        <template v-if="item==='file'">
                            <div class="content-child-header">
                                <span class="order">{{orderMsg.indexOf('F')+1}}</span>
                                <img @click="closeFile('send')" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                            </div>
                            <div class="content-child-box">
                                <div v-if="!changeFile" class="input-file-box">
                                    <p class="input-file-text">Выбрать файл</p>
                                    <input class="input-file" type="file" @change="onFileChange($event)" >
                                </div>
                                <template v-if="changeFile">
                                    <p>{{changeFileName}}</p>
                                    <v-btn class="delete-preview" @click="changeFile=''">Удалить</v-btn>
                                </template>
                            
                            </div>
                        </template>
                        <template v-if="item==='content'">
                            <div class="content-child-header">
                                <span class="order">{{orderMsg.indexOf('C')+1}}</span>
                                <img @click="closeContent('send')" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                            </div>
                            <div class="content-child-box">
                                <textarea type="text" style="width: 95% !important" placeholder="Контент" class="form-control textarea" v-model="content"></textarea>
                            </div>
                        </template>
                        <template v-if="item==='button'">
                            <div class="content-child-header">
                                <span class="order">{{orderMsg.indexOf('B')+1}}</span>
                                <img @click="closeBtns('send')" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                            </div>
                            <div class="content-child-box">
                                <div class="button-list">                                 
                                    <span class="button-list-box" v-for="(item,index) in buttonList" :key="index">
                                        <img @click="closeButtonList(item)" draggable="false" class="button-list-cancel" src="@/assets/cancel.png" alt="cancel">
                                        <p class="button-list-box-child-1">{{item.buttonName}}</p> 
                                        <p class="button-list-box-child-2">{{item.buttonUrl}}</p>
                                    </span>
                                </div>
                                <input type="text" placeholder="Название кнопки" class="form-control" v-model="buttonName">
                                <input type="text" placeholder="Ссылка для кнопки" class="form-control" v-model="buttonUrl">
                                <v-btn @click="addButtons">Добавить</v-btn>
                            </div>                                
                        </template>
                    </div>  
                    <div style="margin:auto" v-if="items.length===0">
                        <h2 class="select-header">Выберите элемент &uarr;</h2>
                    </div>                                  
                </div>
                <div class="send-by-phone-box">
                    <v-checkbox v-model="isSendByPhone" id="send-by-phone" />
                    <label class="send-by-phone-label" for="send-by-phone">Отправить одному клиенту</label>
                </div>
                <template v-if="isSendByPhone">
                        <v-text-field
                            v-model="phoneInput"
                            label="Номер телефона"
                            placeholder="9989********"
                        ></v-text-field>
                    <button v-if="!isClick" @click="sendMessage" class="send-btn">Отправить</button>
                    <button v-else style="max-height: 41px; padding: 0;" class="send-btn"><img style="width:41px; height:41px;" draggable="false" src="@/assets/loader.svg" alt=""></button>
                </template>
                <template v-else>
                    <button v-if="!isClick" @click="sendMessage" class="send-btn">Отправить</button>
                    <button v-else style="max-height: 41px; padding: 0;" class="send-btn"><img style="width:41px; height:41px;" draggable="false" src="@/assets/loader.svg" alt=""></button>
                </template>
            </div>
        </transition>
        <div class="messages" v-if="listData.length">
            <h2 class="send-file-header">Отправленные сообщения</h2>
            <div class="message-box">
                <v-card v-for="(message, index) in listData" :key="index" class="messages-child">                       
                    <span class="messages-child-header">
                        <img @click="remove(message.id)" draggable="false" class="telegram-cancel" src="@/assets/telegram-cancel-btn.png" alt="">
                        <!-- {{message.status}} -->
                        <p style="margin: 10px;">Статус: {{checkStatus(message.status)}}</p>
                        <p style="margin: 10px;" v-if="showStatus(message.status)">{{message.count}} из {{message.maxCount}}</p>

                    </span> 

                    <div :class="[{'message-content': item.name==='C', 'message-video': item.name==='V', 'message-file': item.name==='F'}]" v-for="(item,index) in setPostOrder(message)" :key="index">
                        <template v-if="item.name==='I'">
                            <img class="message-image" :src="message.imageUrl" alt="">
                        </template>
                        <template v-if="item.name==='V'">
                            <video style="margin: 0 0 0 10px;" width="185" height="185" autoplay  muted controls>
                                <source :src="message.videoUrl" type="video/mp4">
                            </video> 
                        </template>
                        <template style="margin: 0px 10px;" v-if="item.name==='F'">
                            <a :href="message.fileUrl">{{message.fileUrl.split('/')[message.fileUrl.split('/').length-1]}}</a>
                        </template>
                        <template v-if="item.name==='C'">
                            <span class="message-text">
                                <template v-if="isEdit!=message.id">
                                    <!-- {{message.status}} -->
                                    <img  @click="edit(message)" draggable="false" class="change-btn" src="@/assets/edit.png"/>
                                    <textarea readonly="readonly" class="message-area" v-model="message.content"></textarea>       
                                </template>
                                <template v-else>
                                    <img  @click="cancelEdit()" draggable="false" class="change-btn" src="@/assets/cancel.png"/>
                                    <img  @click="editMessage()" draggable="false" class="change-btn" src="@/assets/success.png"/>
                                    <textarea type="text" placeholder="Контент" class="form-control textarea" v-model="editContent"></textarea>
                                </template>

                            </span>
                        </template>
                        <template v-if="item.name==='B'">        
                            <div class="message-button" v-for="(item, index) in message.postButtons" :key="index">
                                    <p class="message-button-child button-list-box-child-1">{{item.name}}</p>
                                    <p class="message-button-child button-list-box-child-2">{{item.url}}</p> 
                            </div>                                                            
                        </template>
                    </div>
                </v-card>    
            </div>            
        </div>
    </div>
</template>

<script>
import ExpansionPanel from './ExpansionPanel.vue'
export default {
    name: 'TelegramBot',
    components:{
        ExpansionPanel,
    },
    data(){
        return {
            lang: 'RU',
            msg: 'Telegram Bot',
            listData: [],
            isShow: false,
            content: '',
            name:'',
            order: '',
            parentId: '',
            submit: '',
            id: '',
            // urlImg: 'http://192.168.120.9:8077/api/post',
            urlImg: this.$store.state.telegramBotUrl,
            // urlImg: 'http://192.168.118.37:8077/api',
            changeImg: '',
            buttonName: '',
            buttonUrl: '', 
            changeVideo:'',
            content:'',
            imgPreview: '',
            videoPreview: '',
            orderMsg: '',
            items: [],
            isClick: false,
            errorMsg: '',
            isErrorMsg: false,
            isSuccessMsg:  false,
            successMsg: '',
            isRemove: false,
            removeData: '',
            changeFile: '',
            changeFileName: '',   
            listData: '',         
            contentArr: [],
            isRemove: false,
            isEdit: false,
            editContent: '',
            userCount: '',
            buttonList: [],
            isSeveralBtns: false,
            isSendByPhone: false,
            phoneInput: '',
        }
    },
    watch:{
        isSendByPhone(val){
            if(!val){
                this.phoneInput = '';
            }
        }
    },
    methods:{
        closeButtonList(item){
            var idx = this.buttonList.indexOf(item);
            this.buttonList.splice(idx, 1);
            if(this.buttonList.length===0){
                this.isSeveralBtns = false;
            }
        },
        addButtons(){
            this.isSeveralBtns = true;
            this.buttonList.push({'buttonName': this.buttonName, 'buttonUrl': this.buttonUrl})
            this.buttonName = '';
            this.buttonUrl = '';
        },
        remove(id){
            this.isRemove = true;
            this.id = id;

        },
        cancelEdit(){
            this.isEdit = false;
            this.editContent = '';
        },
        edit(message){
            this.isEdit = message.id;
            this.id = message.id;
            console.log(message)
            this.editContent = message.content;
            console.log(this.edi)

        },
        getUserCount(){
            let self = this;
            self.$http.get(self.urlImg + '/user/count')
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    self.userCount = response.data;
                }            
            })
        },
        showStatus(status){
            if(status === 'SENT' || status === 'EDITED'){
                return false
            }
            else{
                return true;
            }
        },
        checkStatus(val){
            if(val==='SENT'){
                return 'Доставлено';
            }
            else if(val==='PENDING'){
                return 'В ожидании';
            }
            else if(val==='EDITED'){
                return 'Изменен';
            }   
            else if(val==='DELETED'){
                return 'Удален';
            }
            else if(val==='EDITING'){
                return 'Редактирование';
            }
            else if(val==='DELETING'){
                return 'Удаление';
            }
            else{
                return 'Не определен';
            }
        },
        editMessage(){
            let self = this;
            self.$http.post(self.urlImg + '/post/edit', {
                    id: this.id,
                    text: this.editContent
            })
            .then(response=>{                
                //console.log(response.data);
                if(response.status ===200){
                    self.isEdit = false;
                    self.getList(self.lang);

                }
            
            })
        },
        reloadSendMessage(){
            this.changeImg = '';
            this.buttonName = '';
            this.buttonUrl = ''; 
            this.changeFile = '';
            this.changeFileName = '';
            this.changeVideo = '';
            this.content = '';
            this.imgPreview = '';
            this.videoPreview = '';
            this.orderMsg = '';
            this.items = [];
            this.isShow = false;
            this.content = '';
            this.name = '';
            this.order = '';
            this.parentId = '';
            this.submit = '';
            this.id = '';
            this.isClick = false;
            this.errorMsg = '';
            this.isErrorMsg = false;
            this.isSuccessMsg = false;
            this.successMsg = false;
            this.isRemove = false;
            this.removeData = '';
            this.buttonList = [];
            this.isSeveralBtns = false;            
            this.isSendByPhone = false;
            this.phoneInput = '';
        },
        setLang(lang){
            this.lang = lang;
            this.getList(this.lang);
        },
        deleteImg(){
            this.imgPreview='';
            this.changeImg = '';
        },
        deleteVideo(){
            this.videoPreview='';
            this.changeVideo = '';
        },
        addImg(type){
            if(type==='send'){
                let item = 'image';
                if(this.items.indexOf('image')===-1||this.items.length===0){
                    this.items.push(item);
                    this.orderMsg += 'I'; 
                    //console.log(this.orderMsg)
                }
                //console.log(this.items)
            }
        
        },
        addVideo(type){
            if(type==='send'){
                let item = 'video';
                if( this.items.indexOf('video') === -1||this.items.length===0){
                    this.items.push(item);
                    this.orderMsg += 'V'; 
                    //console.log(this.orderMsg)
                }
                //console.log(this.items)
            }           
        },
        addFile(type){
            if(type==='send'){
                let item = 'file';
                if( this.items.indexOf('file') === -1||this.items.length===0){
                    this.items.push(item);
                    this.orderMsg+= 'F'; 
                    //console.log(this.orderMsg)
                }            
            }
        },
        addContent(type){
            if(type==='send'){
                let item = 'content';
                if(this.items.indexOf('content')===-1||this.items.length===0){
                    this.items.push(item);
                    this.orderMsg += 'C'; 
                    //console.log(this.orderMsg)            
                }
            }
        },
        addBtns(type){
            if(type==='send'){
                //console.log('ITEMS:')
                //console.log(this.items)
                let item = 'button';
                if(this.items.indexOf('button')===-1&&this.items.length!=0){
                    this.items.push(item);
                    this.orderMsg += 'B'; 
                    //console.log(this.orderMsg)                
                }
                else{
                    if(this.items.indexOf('button')!=-1){
                        this.errorMsg = 'Кнопка уже добавлена';
                        this.isErrorMsg = true;
                        setTimeout(() => {
                            this.isErrorMsg = false;
                            this.errorMsg = '';
                        }, 2000)
                    }                    
                    else if(this.items.length===0){
                        this.errorMsg = 'Кнопка всегда привязана к чему-то';
                        this.isErrorMsg = true;
                        setTimeout(() => {
                            this.isErrorMsg = false;
                            this.errorMsg = '';
                        }, 2000)
                    }
                }
            }
        },
        closeImg(type){
            if(type==='send'){
                this.imgPreview = '';
                this.items.splice(this.items.indexOf('image'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('I')) + this.orderMsg.slice(this.orderMsg.indexOf('I')+1);
                this.orderMsg = this.orderMsg.replace(/I/g,'');
                if(this.orderMsg[0]=='B'){
                    this.closeBtns('send');
                }
                //console.log(this.orderMsg);
            }
        },
        closeVideo(type){
            if(type==='send'){
                this.videoPreview = '';
                this.items.splice(this.items.indexOf('video'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('V')) + this.orderMsg.slice(this.orderMsg.indexOf('V')+1);
                this.orderMsg = this.orderMsg.replace(/V/g,'');
                if(this.orderMsg[0]=='B'){
                    this.closeBtns('send');
                }
                //console.log(this.orderMsg);
            }  
        },
        closeFile(type){
            if(type==='send'){
                this.changeFile = '';
                this.items.splice(this.items.indexOf('file'), 1);
                this.orderMsg = this.orderMsg.replace(/F/g,'');
                if(this.orderMsg[0]=='B'){
                    this.closeBtns('send');
                }
            }
        },
        closeContent(type){
            if(type==="send"){
                this.content = '';
                this.items.splice(this.items.indexOf('content'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('C')) + this.orderMsg.slice(this.orderMsg.indexOf('C')+1);
                this.orderMsg = this.orderMsg.replace(/C/g,'');
                if(this.orderMsg[0]=='B'){
                    this.closeBtns('send');
                }
                //console.log(this.orderMsg)
            }
        },
        closeBtns(type){
            if(type==='send'){
                this.buttonList = [];
                this.isSeveralBtns = false;
                this.buttonName = '';
                this.buttonUrl = '';
                this.items.splice(this.items.indexOf('button'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('B')) + this.orderMsg.slice(this.orderMsg.indexOf('B')+1) 
                this.orderMsg = this.orderMsg.replace(/B/g,'');
                //console.log(this.orderMsg);
            }
        },
        onImageChange(e){
            this.changeImg = e.target.files[0];
            this.imgPreview = URL.createObjectURL(e.target.files[0]);

        },
        onVideoChange(e){
            this.changeVideo = e.target.files[0];
            this.videoPreview = URL.createObjectURL(e.target.files[0]);
        },
        onFileChange(e){
            this.changeFile = e.target.files[0];
            this.changeFileName = e.target.files[0].name;
            // //console.log(this.changeFile)
        },
        sendMessage(){
            if(this.isSendByPhone){
                this.sendFileByPhone();
            }
            else{
                this.sendFile();
            }
                // setTimeout(() => {                        
                //     this.getList(this.lang);  
                // }, 1000);

        },
        sendFileByPhone(){
            if(this.changeImg||this.changeVideo||this.content||this.changeFile){
                this.isClick = true;
                let image = new FormData();
                let video = new FormData();
                let data = new FormData();

                if(this.changeImg){
                    data.append('image', this.changeImg);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/I/g,'');
                }
                if(this.changeVideo){
                    data.append('video', this.changeVideo);
                }
                else{
                    //console.log(this.orderMsg)
                    this.orderMsg = this.orderMsg.replace(/V/g,'');
                }
                if(this.changeFile){
                    data.append('file', this.changeFile);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/F/g,'');
                }
                if(!this.isSeveralBtns){
                    if(this.buttonUrl){
                        data.append('postButtons[0].url', this.buttonUrl);
                    }
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                    if(this.buttonName){
                        data.append('postButtons[0].name', this.buttonName);
                    }            
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                }
                else{
                    if(this.buttonList){
                        this.buttonList.forEach((x, index)=>{
                            data.append('postButtons['+index+'].name', x.buttonName);
                            data.append('postButtons['+index+'].url', x.buttonUrl);
                            console.log(index)
                        })
                        if(this.buttonName||this.buttonUrl){
                            data.append('postButtons['+this.buttonList.length+'].name', this.buttonName);
                            data.append('postButtons['+this.buttonList.length+'].url', this.buttonUrl);
                        }
                    }
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                }
                
                if(this.content){
                    data.append('content', this.content);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/C/g,'');
                }
                if(this.orderMsg){
                    data.append('order', this.orderMsg);
                }
                data.append('lang', this.lang);
                data.append('phone', this.phoneInput)
                // let formData = {
                //     'image': this.changeImg, 
                //     'video': this.changeVideo,
                //     'button_name' : this.buttonName,
                //     'button_url' : this.buttonUrl,
                //     'content': this.content,
                //     'order' : this.orderMsg,
                //     'phone' : this.phoneInput,

                // }
                let self = this;
                // console.log(formData)
                //console.log(this.orderMsg);
                self.$http.post(self.urlImg+'/post/byPhone', data, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                            self.isClick = false;
                            self.getList(self.lang);  
                            // self.reloadSendMessage();   
                            
                    })
                    .catch(error=>{
                        //console.log(error);
                        let self = this;
                        if(error.status===400||error.status===500){
                            self.errorMsg = 'Ошибка';
                            self.isErrorMsg = true;
                            setTimeout(() => {
                                self.isErrorMsg = false;
                                self.errorMsg = '';
                                self.reloadSendMessage();     

                            }, 1000);
                        }
                    })


            }
            else{
                
                this.errorMsg = 'Выберите элемент ↓';
                this.isErrorMsg = true;
                setTimeout(() => {
                    this.isErrorMsg = false;
                    this.errorMsg = '';
                }, 2000);
                //console.log('Выберите')
            }

        },
        sendFile(){
            if(this.changeImg||this.changeVideo||this.content||this.changeFile){
                this.isClick = true;
                let image = new FormData();
                let video = new FormData();
                let data = new FormData();

                if(this.changeImg){
                    data.append('image', this.changeImg);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/I/g,'');
                }
                if(this.changeVideo){
                    data.append('video', this.changeVideo);
                }
                else{
                    //console.log(this.orderMsg)
                    this.orderMsg = this.orderMsg.replace(/V/g,'');
                }
                if(this.changeFile){
                    data.append('file', this.changeFile);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/F/g,'');
                }
                if(!this.isSeveralBtns){
                    if(this.buttonUrl){
                        data.append('postButtons[0].url', this.buttonUrl);
                    }
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                    if(this.buttonName){
                        data.append('postButtons[0].name', this.buttonName);
                    }            
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                }
                else{
                    if(this.buttonList){
                        this.buttonList.forEach((x, index)=>{
                            data.append('postButtons['+index+'].name', x.buttonName);
                            data.append('postButtons['+index+'].url', x.buttonUrl);
                            console.log(index)
                        })
                        if(this.buttonName||this.buttonUrl){
                            data.append('postButtons['+this.buttonList.length+'].name', this.buttonName);
                            data.append('postButtons['+this.buttonList.length+'].url', this.buttonUrl);
                        }
                    }
                    else{
                        this.orderMsg = this.orderMsg.replace(/B/g,'');
                    }
                }
                
                if(this.content){
                    data.append('content', this.content);
                }
                else{
                    this.orderMsg = this.orderMsg.replace(/C/g,'');
                }
                if(this.orderMsg){
                    data.append('order', this.orderMsg);
                }
                data.append('lang', this.lang);
                let formData = {
                    'image': this.changeImg, 
                    'video': this.changeVideo,
                    'button_name' : this.buttonName,
                    'button_url' : this.buttonUrl,
                    'content': this.content,
                    'order' : this.orderMsg,

                }
                let self = this;

                //console.log(this.orderMsg);
                self.$http.post(self.urlImg+'/post', data, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                            self.getList(self.lang);  
                            self.reloadSendMessage();   
                            

                        // if(response.status===200){
                            
                        //     self.successMsg = 'Успех';
                        //     self.isSuccessMsg = true;
                        //     setTimeout(() => {
                        //         self.isSuccessMsg = false;
                        //         self.successMsg = '';
                        //         self.reloadSendMessage();   
                        //         self.getList(self.lang);  
                        //     }, 1000);
                        //     // self.reloadSendMessage();     


                        // }
                        // else{
                        //     self.errorMsg = 'Ошибка';
                        //     self.isErrorMsg = true;
                        //     setTimeout(() => {
                        //         self.isErrorMsg = false;
                        //         self.errorMsg = '';
                        //         self.reloadSendMessage();                              
                        //     }, 1000);

                        // }
                        //console.log(response.status);        
                    })
                    .catch(error=>{
                        //console.log(error);
                        let self = this;
                        if(error.status===400||error.status===500){
                            self.errorMsg = 'Ошибка';
                            self.isErrorMsg = true;
                            setTimeout(() => {
                                self.isErrorMsg = false;
                                self.errorMsg = '';
                                self.reloadSendMessage();     

                            }, 1000);
                        }
                    })


            }
            else{
                
                this.errorMsg = 'Выберите элемент ↓';
                this.isErrorMsg = true;
                setTimeout(() => {
                    this.isErrorMsg = false;
                    this.errorMsg = '';
                }, 2000);
                //console.log('Выберите')
            }

        },
        showAddBox(){
            this.isShow=true;
            this.content = '';
            this.name = '';
            this.order =  '';
            this.parentId = '';
            this.submit = 'Создать';
            this.contentBtn = '';
            this.orderMsgBtn = '';
            this.imgPreviewBtn = '';
            this.videoPreviewBtn = '';
            this.filePreviewBtn = ''; 
            this.buttonNameBtn = '';
            this.buttonUrl = '';
            this.itemsBtn  = [];
        },
        change(item){
            //console.log(item)
            this.itemsBtn = [];
            this.isShow = true;
            this.contentBtn = item.content;
            this.name = item.name;
            this.orderMsgBtn = item.contentOrder;
            this.order =  item.order;
            this.parentId = item.parentId;
            this.imgPreviewBtn = item.imageUrl;
            this.videoPreviewBtn = item.videoUrl;
            this.filePreviewBtn = item.fileUrl; 
            this.buttonNameBtn = item.buttonName;
            this.buttonUrl = item.buttonUrl;
            this.submit = 'Изменить';
            this.id = item.id;
            if(item.imageUrl&&this.itemsBtn.indexOf('image')===-1){
                this.itemsBtn.push('image');
            }
            if(item.videoUrl&&this.itemsBtn.indexOf('video')===-1){
                this.itemsBtn.push('video');
            }
            if(item.fileUrl&&this.itemsBtn.indexOf('file')===-1){
                this.itemsBtn.push('file');
            }
            if(item.content&&this.itemsBtn.indexOf('content')===-1){
                this.itemsBtn.push('content');
            }
            if(item.buttonUrl&&this.itemsBtn.indexOf('button')===-1){
                this.itemsBtn.push('button');
            }


        },
        sortByOrder(arr) {
            arr.sort((a, b) => a.order > b.order ? 1 : -1);
        },
        deleteMessage(id){
            let self = this;
            self.$http.delete(self.urlImg + `/post/delete/${id}`)
            .then(response=>{                
                //console.log(response.data);
                self.isRemove = false;

                self.getList(self.lang);

            })
        },
        getList(lang){
            let self = this;
            self.$http.get(self.urlImg + '/post/getList', {
                params:{
                    'lang': lang,
                }
            })
            .then(response=>{
                self.listData = response.data.reverse();
                console.log('-------LIST DATA--------')
                console.log(self.listData);
                console.log('------- -----  ---------')

                var item = self.listData.find(x=>x.id===self.id);
                console.log('------ITEM------')
                console.log(item)
                console.log(self.id)
                console.log('-----------------')

                if(item){
                    if(item.status==='EDITING'||item.status==='DELETING'){
                        setTimeout(() => {
                            console.log('test')
                            self.getList(self.lang);  
                        }, 5000)
                    }
                    else{
                        self.id = '';
                        self.editContent = '';
                    }
                }
                else{
                    if(self.listData[0].status==='PENDING'){
                        setTimeout(() => {
                            console.log('test')
                            self.getList(self.lang);  
                        }, 5000)
                    }
                }
                //console.log(response.data);
            })
        },
        setPostOrder(message){
            var arr = [];
            if(message.postOrder){
                if(message.postOrder.indexOf('I')!=-1)
                    arr.push({
                        name: 'I',
                        order: message.postOrder.indexOf('I'),

                    })
                if(message.postOrder.indexOf('V')!=-1)
                    arr.push({
                        name: 'V',
                        order: message.postOrder.indexOf('V'),

                    })
                if(message.postOrder.indexOf('C')!=-1)
                    arr.push({
                        name: 'C',
                        order: message.postOrder.indexOf('C'),

                    })
                if(message.postOrder.indexOf('F')!=-1)
                    arr.push({
                        name: 'F',
                        order: message.postOrder.indexOf('F'),

                    })
                if(message.postOrder.indexOf('B')!=-1)
                    arr.push({
                        name: 'B',
                        order: message.postOrder.indexOf('B'),

                    })
                this.sortByOrder(arr);
                return arr;
            }
        }
        
    },
    mounted(){
        this.getList(this.lang);
        this.getUserCount();
    }
}
</script>

<style scoped>
    /* @import '../../assets/css/telegrambot.css';
     */
    .messages-child-header{
        display: flex;
    }
    .button-list-cancel{
        width: 12px;
        height: 12px;
        cursor: pointer;
    }
    .button-list{
        overflow: auto;
        height: 100px;
        width: 100%;
        padding: 12px;
        text-align: center;
        margin: 24px 0 5px;
    }
    .send-by-phone-box{
        display: flex;
        align-items: center;

    }
    .send-by-phone-label{
        cursor: pointer;
    }
    .button-list-box{
        display: flex;
        align-items: center;
    }
    .button-list-box-child-1{
        margin: 0 25px 0 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100px;
    }
    .button-list-box-child-2{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0;
    }
    .message-area{
        width: 100%;
        height: 224px;
    }
    .message-video{
        margin: 10px 0;
    }
    .message-file{
        margin: 0 10px;
    }
    .message-box{
        display: flex;
        flex-flow: wrap;
        /* margin: auto; */
        justify-content: center;
        flex-direction: column;
    }
    .message-button{
        background: #33333338;
        margin: 4px;
        padding: 7px;
        border-radius: 5px !important;
        display: flex;
    }
    .message-button-child{
        margin: 0;
    }
    .message-image{
        max-width: 185px;
        max-height: 185px;
        margin: 0 0 0 10px;
    }
    .message-content{
        /* width: 100%;
        height: 100%; */
        display: flex;
        justify-content: center;
        flex-direction: column;
        /* align-items: center; */
        margin: 10px;
        /* overflow: auto; */
    }
    :active, :hover, :focus {
        outline: 0;
        outline-offset: 0;
    }
    .messages-child{
        /* width: 365px; */
        /* padding: 10px; */
        display: flex;
        flex-direction: column;
        margin: 10px;
        /* max-height: 435px; */
        /* overflow: auto; */
    }
    .messages{
        background: #f1f1f1;
        margin: 10px 0;
        padding: 10px;
        width: 100%;
    }
    .remove-box-content{
    border: 1px solid #b3b3b3;
    padding: 20px;
    border-radius: 10px;
    margin: 20px;
}
.remove-box{
    width: 500px;
    border: 1px solid silver;
    margin: 0 0 15px 0;
    padding: 20px;
    border-radius: 10px;
    position: fixed;
    top: 223px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    background: #FFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.image-size{
    max-width: 200px;
    max-height: 200px;
}
.change-btn{
    width: 15px;
    height: 15px;
    /* margin: 5px; */
    cursor: pointer;
    margin: 20px 5px 5px;
}
.bg{
    position: fixed;
    background: #0000009e;
    width: 100%;
    height: 100%;
    z-index: 3;
    top: 0;
    left: 0;
}
.buttons-box{
    background: #f1f1f1;
    /* margin: 10px 0; */
    padding: 10px;
}
.error-div{
background-color: #ff4a4a;
width: 350px;
padding: 10px;
text-align: center;
position: absolute;
top: 2%;
left: 50%;
z-index: 2;
margin-left: -175px;
color: #FFFF;
border-radius: 10px;
}   
.fade-enter-active, .fade-leave-active {
transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
opacity: 0;
}
.select-header{
    color: #ffffffd1;
    font-size: 30px;
    font-style: italic;
}
.btn-selected{
    background: #9e9e9e !important;
}
.set-center{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
.delete-preview{
    /* position: absolute;  */
    background: #427e88 !important;
    color: #FFFF !important;
    margin: 0;
    border-radius: 10px 10px 0px 0px;
        box-shadow: 0 0 0 0 #FFFF !important;
}
.content-child-box{
    display: flex;
    justify-content: center;
    /* align-items: center; */
    /* margin: 35px 0; */
    flex-direction: column;
    align-items: center;
    width: 360px;
    height: 100%;
    margin-top: -25px;
}
.content-child-header{
    display: flex;
    justify-content: space-between;
}
.order{
    width: 25px;
    height: 25px;
    background: #17a2b8;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFF;
    z-index: 1;
}
.telegram-cancel{
    width: 25px;
    height: 25px;
    cursor: pointer;
    z-index: 1;
    /* position: absolute; */
}
.content-child{
    background: #FFFF;
    /* padding: 10px; */
    margin: 10px;
    flex: 1;
    border-radius: 5px;
    max-width: 360px;
}
.btn{
    margin: 5px;
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    cursor: pointer;
}
.header{
    display: flex;
    flex-direction: column;
    /* align-items: center; */
}
.lang-flag{
    width: 40px;
    height: 40px;
    cursor: pointer;
}
.lang-box{
    display: flex;
    align-items: center;
    width: 120px;
    justify-content: space-around;
}
.lang-box-child{
    background: #f1f1f1;
    padding: 10px;
    /* width: 135px; */
    display: flex;
    justify-content: space-between;
    border-radius: 10px 10px 0 0;
}
.lang-box-tmp{
    padding: 10px;
}
.send-btn{
    background: #419FD9;
    color: #FFFF;
    padding: 10px;
    width: 200px;
    margin: 10px;
    border-radius: 40px;
}
.content{
    background: #8caec3;
    padding: 10px;
    margin: 10px;
    width: 100%;
    height: 300px;
    display: flex;
    overflow: auto;
    /* justify-content: center; */
}
.add-buttons{

}
.input-btn{
    width: 500px;
    margin: 5px 0;
}
.textarea{
    height: 190px !important;
    width: 100% !important;
}
.image-preview{
    max-width: 360px;
    max-height: 260px;
    /* margin: -25px 0; */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.box{
    margin: 10px 5px;
}
.send-file-header-text{
    margin: 0;
    font-style: italic;
    color: #444444;
}
.input-file-text{
    color: #35457d;
    margin: 0;
}
.input-file-box{
    width: 225px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #35457d;
    position: relative;
}
.input-file{
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    position: absolute;
}
.send-file-header{
    text-align: center;
    margin: 10px;
}
.create{
    margin: 15px 0 !important;
}
.create-box{
    width: 810px;
    border: 1px solid silver;
    margin: 0 0 15px 0;
    padding: 20px;
    border-radius: 10px;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    background: #eaeaea;
    overflow: auto;
    max-height: 775px;
}
.mg{
    margin: 0 5px !important;
}
.textarea-btn{
    background-color: #FFFF;
    width: 100%;
    min-height: 195px;
    border: 1px solid #e6e6e6;
    padding: 10px;
}
.content-buttons{
    display: flex;
    flex-direction: column;
    margin: 15px 0;
}
.content-buttons-child{
    display: flex;
    margin: 10px 0;
}
.send-file{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background: #f1f1f1;
}
.form-control {
    display: block;
    width: 320px;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin: 5px auto;   
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
</style>