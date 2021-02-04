<template>
    <div style="width: 100%;">
        <span class="header">
            <h1>{{msg}}</h1>
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
                    <v-btn @click="removeConfirm(removeData)">Удалить</v-btn>
                    <v-btn @click="isRemove=false">Отмена</v-btn>
                </span>
            </div>
            <div class="bg" @click="isRemove=false"></div>
        </template>        
        <div class="main">
            <h2 class="send-file-header">Список сообщений</h2>    
            <div class="error-div" v-if="isError">{{errMsg}}</div>                    

            <div class="add-box">
                <v-btn @click="showAddBox" class="create">Добавить</v-btn>
                            <template v-if="isShow">                
                                <div class="bg" @click="isShow=false"></div>
                                <div class="create-box">
                                    <v-text-field v-model="name" label="Ключ"></v-text-field>
                                    <div class="add-buttons">
                                        <button @click="addImg('btn')" :class="['btn', {'btn-selected': itemsBtn.indexOf('image')!=-1}]">Добавить изображение</button>
                                        <button @click="addVideo('btn')" :class="['btn', {'btn-selected': itemsBtn.indexOf('video')!=-1}]">Добавить видео</button>
                                        <button @click="addFile('btn')" :class="['btn', {'btn-selected': itemsBtn.indexOf('file')!=-1}]">Добавить файл</button>
                                        <button @click="addContent('btn')" :class="['btn', {'btn-selected': itemsBtn.indexOf('content')!=-1}]">Добавить контент</button>
                                        <button @click="addBtns('btn')" :class="['btn', {'btn-selected': itemsBtn.indexOf('button')!=-1}]">Добавить кнопку</button>
                                    </div>
                                    <div class="content-buttons">
                                        <div class="content-buttons-child" v-for="(item, index) in itemsBtn" :key="index">
                                            <template v-if="item==='image'">
                                                <img @click="closeImg('btn')" draggable="false" class="change-btn" src="@/assets/cancel.png"/>
                                                <span class="order mg">{{orderMsgBtn.indexOf('I')+1}}</span>   
                                                <p>Изображение: </p>                             
                                                <input type="file" accept="image/*"  @change="onImageChangeBtn($event)" >
                                                <img v-if="imgPreviewBtn" class="image-size" :src="imgPreviewBtn" alt="image">
                                            </template>
                                            <template v-if="item==='video'">
                                                <img @click="closeVideo('btn')" draggable="false" class="change-btn"  src="@/assets/cancel.png"/>
                                                <span class="order mg">{{orderMsgBtn.indexOf('V')+1}}</span>                                
                                                <p>Видео: </p>                             
                                                <input type="file" accept="video/*"  @change="onVideoChangeBtn($event)" >
                                                <video v-if="videoPreviewBtn" style="margin:15px" width="250" height="250" autoplay  muted controls>
                                                    <source :src="videoPreviewBtn" type="video/mp4">
                                                </video> 
                                            </template>                     
                                            <template v-if="item==='file'">
                                                <img @click="closeFile('btn')" draggable="false" class="change-btn" src="@/assets/cancel.png"/>
                                                <span class="order mg">{{orderMsgBtn.indexOf('F')+1}}</span>                                
                                                <p>Файл: </p>
                                                <input type="file" @change="onFileChangeBtn($event)">
                                                <p v-if="filePreviewBtn">{{filePreviewBtn.split('/')[filePreviewBtn.split('/').length-1]}}</p>
                                            </template>
                                            <template v-if="item==='content'">
                                                <img @click="closeContent('btn')" draggable="false" class="change-btn" src="@/assets/cancel.png"/>
                                                <span class="order mg">{{orderMsgBtn.indexOf('C')+1}}</span>
                                                <textarea type="text" placeholder="Контент" class="textarea-btn" v-model="contentBtn"></textarea>
                                            </template>     
                                            <template v-if="item==='button'">
                                                <img @click="closeBtns('btn')" draggable="false" class="change-btn" src="@/assets/cancel.png"/>
                                                <span class="order mg">{{orderMsgBtn.indexOf('B')+1}}</span>
                                                <input type="text" placeholder="Название кнопки" class="mg form-control" v-model="buttonNameBtn">
                                                <input type="text" placeholder="Ссылка для кнопки" class="mg form-control" v-model="buttonUrlBtn">
                                            </template>       
                                        </div>
                                    </div>
                                    <span style="display:flex">
                                        <v-btn v-if="submit==='Создать'" @click="add">{{submit}}</v-btn>
                                        <v-btn v-else @click="edit">{{submit}}</v-btn>
                                        <v-btn @click="isShow=false">Отмена</v-btn>
                                    </span>        
                                </div>
                            </template>
            </div>
            
            <v-text-field
                class="search-box"
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            
            <v-data-table
                :headers="headers"
                :items="listData"
                class="elevation-1"
                :search="search"
                :pagination.sync=pagination
            >
            <v-alert type="warning" slot="no-data">Пусто</v-alert>
            <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{props.item.key}}</td>
                        <td>{{props.item.content}}</td>                      
                        <td style="width: 300px;">
                            <span class="change-box">                                
                                <span class="change-box-child">                                
                                    <v-btn class="change-box-info" @click="change(props.item)">Подробнее</v-btn>
                                    <!-- <img src="@/assets/edit.png" draggable="false" class="change-btn" @click="change(props.item)"> -->
                                </span>
                                <span class="change-box-child">
                                    <img src="@/assets/cancel.png" draggable="false" class="change-btn" @click="remove(props.item)">
                                </span>
                            </span>
                        </td>
                    </tr>    
            </template>
            </v-data-table>
        </div>   
    </div>
    

</template>

<script>
export default {
    name: 'telegramMessages',
    components:{
        
    },
    data(){
        return{
            url: 'http://192.168.120.5:8077/api',
            listData: [],
            lang: 'RU',
            headers: [
                {text: "Ключ", value: "key"},
                {text: "Контент", value: "content"},
            ],       
            msg: 'Telegram Bot',
            // url: 'http://192.168.120.9:8077/api',
            url: this.$store.state.telegramBotUrl,
            // url:'http://192.168.118.37:8077/api',
            search:'',
            pagination: {
                rowsPerPage: 10
            },

               listData: [],
            isShow: false,
            content: '',
            name:'',
            order: '',
            parentId: '',
            submit: '',
            id: '',
            changeImg: '',
            buttonName: '',
            buttonUrl: '', 
            changeVideo:'',
            search: '',
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
            itemsBtn: [],
            orderMsgBtn: '',
            errorMsgBtn: '',
            isErrorMsgBtn: false,
            changeImgBtn: '',
            changeVideoBtn: '',
            contentBtn: '',
            buttonNameBtn: '',
            buttonUrlBtn: '',
            imgPreviewBtn: '',
            videoPreviewBtn: '',
            isError : false,
            errMsg : '',
        }
    },
    methods:{
        setLang(lang){
            this.lang = lang;
            this.messageGetList(this.lang);
        },
        messageGetList(lang){
            let self = this;
            self.$http.get(self.url + "/message/getList", {
                params:{
                    'lang': lang,
                }
            })
            .then(response => {
                self.isError = false;
                self.errMsg = '';
                console.log(response.data);
                if(response.status===200){
                    self.listData = response.data;
                    console.log(self.listData);
                }      
            })
            .catch(error=>{
                self.isError = true;
                self.errMsg = 'Ошибка сервера';
            })
        },
            onChildClick(value){
            console.log('check')
            this.listData = this.$store.state.listData;
        },
        deleteImg(){
            this.imgPreview = '';
            this.changeImg = '';
        },
        deleteVideo(){
            this.videoPreview='';
            this.changeVideo = '';
        },
        addImg(type){
            if(type==='btn'){
                let item = 'image';
                if(this.itemsBtn.indexOf('image')===-1||this.itemsBtn.length===0){
                    this.itemsBtn.push(item);
                    this.orderMsgBtn += 'I'; 
                    console.log(this.orderMsgBtn)
                }
                console.log(this.itemsBtn)
            }
        },
        addVideo(type){
            if(type==='btn'){
                let item = 'video';
                if( this.itemsBtn.indexOf('video') === -1||this.itemsBtn.length===0){
                    this.itemsBtn.push(item);
                    this.orderMsgBtn += 'V'; 
                    console.log(this.orderMsgBtn)
                }
                console.log(this.itemsBtn);                
            }
        },
        addFile(type){
            if(type==='btn'){
                let item = 'file';
                if( this.itemsBtn.indexOf('file') === -1||this.itemsBtn.length===0){
                    this.itemsBtn.push(item);
                    this.orderMsgBtn += 'F'; 
                    console.log(this.orderMsgBtn)
                }
                console.log(this.itemsBtn)
            }
        },
        addContent(type){
            if(type==='btn'){
                let item = 'content';
                if(this.itemsBtn.indexOf('content')===-1||this.itemsBtn.length===0){
                    this.itemsBtn.push(item);
                    this.orderMsgBtn += 'C'; 
                    console.log(this.orderMsgBtn)            
                }
            }
        },
        addBtns(type){
            if(type==='btn'){
                console.log('ITEMS:')
                console.log(this.itemsBtn)
                let item = 'button';
                if(this.itemsBtn.indexOf('button')===-1&&this.itemsBtn.length!=0){
                    this.itemsBtn.push(item);
                    this.orderMsgBtn += 'B'; 
                    console.log(this.orderMsgBtn)                
                }
                else{
                    if(this.itemsBtn.indexOf('button')!=-1){
                        this.errorMsgBtn = 'Кнопка уже добавлена';
                        this.isErrorMsgBtn = true;
                        setTimeout(() => {
                            this.isErrorMsgBtn = false;
                            this.errorMsgBtn = '';
                        }, 2000)
                    }                    
                    else if(this.itemsBtn.length===0){
                        this.errorMsgBtn = 'Кнопка всегда привязана к чему-то';
                        this.isErrorMsgBtn = true;
                        setTimeout(() => {
                            this.isErrorMsgBtn = false;
                            this.errorMsgBtn = '';
                        }, 2000)
                    }
                }
            }
        },
        closeImg(type){
            if(type==='btn'){
                this.imgPreviewBtn = '';
                this.changeImgBtn = '';
                this.itemsBtn.splice(this.itemsBtn.indexOf('image'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('I')) + this.orderMsg.slice(this.orderMsg.indexOf('I')+1);
                this.orderMsgBtn = this.orderMsgBtn.replace(/I/g,'');
                if(this.orderMsgBtn[0]=='B'){
                    this.closeBtns('btn');
                }
                console.log(this.orderMsgBtn);
            }

        },
        closeVideo(type){
            if(type==='btn'){
                this.videoPreviewBtn = '';
                this.changeVideoBtn = '';
                this.itemsBtn.splice(this.itemsBtn.indexOf('video'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('V')) + this.orderMsg.slice(this.orderMsg.indexOf('V')+1);
                this.orderMsgBtn = this.orderMsgBtn.replace(/V/g,'');
                if(this.orderMsgBtn[0]=='B'){
                    this.closeBtns('btn');
                }
                console.log(this.orderMsgBtn);
            }            
        },
        closeFile(type){
            if(type==='btn'){
                this.changeFileBtn = '';
                this.itemsBtn.splice(this.itemsBtn.indexOf('file'), 1);
                this.orderMsgBtn = this.orderMsgBtn.replace(/F/g,'');
                if(this.orderMsgBtn[0]=='B'){
                    this.closeBtns('btn');
                }
            }
        },
        closeContent(type){
            if(type==='btn'){
                this.contentBtn = '';
                this.itemsBtn.splice(this.itemsBtn.indexOf('content'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('C')) + this.orderMsg.slice(this.orderMsg.indexOf('C')+1);
                this.orderMsgBtn = this.orderMsgBtn.replace(/C/g,'');
                if(this.orderMsgBtn[0]=='B'){
                    this.closeBtns('btn');
                }
            }

        },
        closeBtns(type){
            if(type==='btn'){
                this.buttonNameBtn = '';
                this.buttonUrlBtn = '';
                this.itemsBtn.splice(this.itemsBtn.indexOf('button'), 1);
                // this.orderMsg = this.orderMsg.slice(0,this.orderMsg.indexOf('B')) + this.orderMsg.slice(this.orderMsg.indexOf('B')+1) 
                this.orderMsgBtn = this.orderMsgBtn.replace(/B/g,'');
                    console.log(this.orderMsgBtn)
            }
            

        },
        onImageChangeBtn(e){
            this.changeImgBtn = e.target.files[0];
        },
        onVideoChangeBtn(e){
            this.changeVideoBtn = e.target.files[0];
        },
        onFileChangeBtn(e){
            this.changeFileBtn = e.target.files[0];
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
            this.changeImgBtn = '';
            this.changeVideoBtn = '';
            this.itemsBtn  = [];
        },
        change(item){
            console.log(item)
            this.itemsBtn = [];
            this.isShow = true;
            this.contentBtn = item.content;
            this.name = item.key;
            if(item.messageOrder){
                this.orderMsgBtn = item.messageOrder;
            }
            else{
                this.orderMsgBtn = '';
            }
            this.parentId = item.parentId;
            this.imgPreviewBtn = item.imageUrl;
            this.changeVideoBtn = item.videoUrl;

            this.videoPreviewBtn = item.videoUrl;
            this.filePreviewBtn = item.fileUrl; 
            this.buttonNameBtn = item.buttonName;
            this.buttonUrlBtn = item.buttonUrl;
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
        reload(){
            this.isShow = false;
            this.content = '';
            this.name = '';
            this.order =  '';
            this.parentId = '';
            this.changeImgBtn = '';
            this.changeVideoBtn = '';
            this.changeFileBtn = '';
            this.orderMsgBtn = '';
            this.contentBtn = '';
            this.buttonUrlBtn = '';
            this.buttonNameBtn = '';
            this.imgPreviewBtn = '';
            this.videoPreviewBtn = '';
            // this.getList(this.lang);

        },
        add(){
            console.log(this.parentId)
            let formData = {};
            var data = new FormData();                
                if(this.name){
                    data.append('key', this.name);
                }
                if(this.changeImgBtn){
                    data.append('image', this.changeImgBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/I/g,'');
                }
                if(this.changeVideoBtn){
                    data.append('video', this.changeVideoBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/V/g,'');
                }
                if(this.changeFileBtn){
                    data.append('file', this.changeFileBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/F/g,'');
                }
                if(this.contentBtn){
                    data.append('content', this.contentBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/C/g,'');
                }
                if(this.buttonUrlBtn){
                    data.append('buttonUrl', this.buttonUrlBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/B/g,'');
                }
                if(this.buttonNameBtn){
                    data.append('buttonName', this.buttonNameBtn);
                }
                else{
                    this.orderMsgBtn = this.orderMsgBtn.replace(/B/g,'');
                }
                if(this.orderMsgBtn){
                    data.append('order', this.orderMsgBtn);
                }            
                data.append('lang', this.lang);
            
            if(this.name){
                let self = this;
                self.$http.post(self.url + "/message/add", data, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                        console.log(response.data)
                        self.messageGetList(self.lang);
                        self.reload();                
                    });
            }

        },
        edit(){
            let formData = {}
            console.log('Edit: ', this.orderMsgBtn);
            var data = new FormData();
                if(this.name){
                    data.append('key', this.name);
                }
                if(this.changeImgBtn){
                    data.append('image', this.changeImgBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/I/g,'');
                }
                if(this.changeVideoBtn){
                    data.append('video', this.changeVideoBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/V/g,'');
                }
                if(this.changeFileBtn){
                    data.append('file', this.changeFileBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/F/g,'');
                }
                if(this.contentBtn){
                    data.append('content', this.contentBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/C/g,'');
                }
                if(this.buttonUrlBtn){
                    data.append('buttonUrl', this.buttonUrlBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/B/g,'');
                }
                if(this.buttonNameBtn){
                    data.append('buttonName', this.buttonNameBtn);
                }
                else{
                    if(this.orderMsgBtn)
                        this.orderMsgBtn = this.orderMsgBtn.replace(/B/g,'');
                }
                if(this.orderMsgBtn){
                    data.append('order', this.orderMsgBtn);
                }                
                data.append('lang', this.lang);
                data.append('id', this.id);

            let self = this;
            if(this.name){
                self.$http.post(self.url + "/message/edit", data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    console.log(response.data)
                    self.messageGetList(self.lang);
                    self.reload();                
                });
            }
            
        },
        remove(item){
            console.log('test:');
            console.log(item);
            this.isRemove = true;
            this.removeData = item;
        },
        removeConfirm(item){
            console.log(item);
            let self = this;
            self.$http.delete(self.url + "/message/delete/"+item.id)
            .then(response => {
                console.log(response)
                if(response.status===200){
                    // location.reload();
                    self.messageGetList(self.lang);
                    self.isRemove = false;
                    self.removeData = '';

                }              
            });
        },
        getList(lang){
            let self = this;
            console.log(self.url);
            self.listData = '';
            self.$http.get(self.url + "/button/getList", {
                params: {
                    'lang': lang
                }
            })
                .then(response => {
                    self.sortByOrder(response.data);
                    console.log(response.data)
                    self.listData = response.data;
                });
        },
        sortByOrder(arr) {
            arr.sort((a, b) => a.order > b.order ? 1 : -1);
        }
    },
    created(){
        this.messageGetList(this.lang);
    }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

    @import url('/style/main.css');
    .search-box{
        background: #FFFF;
        padding: 15px 20px 21px;
        border: 1px solid #c0c0c0a1;
        box-shadow: 0px 0px 7px 1px rgba(216, 216, 216, 0.52);
        margin: 0 -1px -1px -1px;
    }
    .center{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
    }
    .change-box-info{
        height: 27px;
        border-radius: 12px;
    }
    .main{
        padding: 15px;
        background: #f1f1f1;
    }
    .header{
        display: flex;
        flex-direction: column;
        /* align-items: center; */
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
    .lang-flag{
        width: 40px;
        height: 40px;
        cursor: pointer;
    }
    .send-file-header{
        text-align: center;
        margin: 10px;
    }
    .create{
        margin: 15px 0 !important;
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
    margin: 5px;
    cursor: pointer;
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
    position: absolute; 
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
.change-box{
    display: flex;
    align-items: center;
    justify-content: center;
}
.change-box-child{
    margin: 5px;
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