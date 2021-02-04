<template>
    <div class="main">
        <h1>STORIES</h1>
        <select style="margin: 10px 0" class="form-control" v-model="lang" placeholder="lang">
            <option value="RU">RU</option>
            <option value="UZ">UZ</option>
            <option value="EN">EN</option>
        </select>
        <div >
            <div class="header">
                <div class="new-story carousel-element" @click="add">
                    
                </div>
                <span v-if="isEditBox" class="carousel-element">
                    <img v-if="isEdit" @click="deleteStory(id)" class="delete-story" src="@/assets/cancel.png" alt="">
                    <img class="story-image-preview" :src="currentItem.imageUrl" />
                    <v-file-picker
                        class="file-picker"
                        :disabled="loader"
                        v-model="newImage"
                        accept="image/*"
                            label="Логотип"/>
                        
                        <span class="order-box">
                            <p class="order-box-text">Порядок</p>
                            <input style="margin: 0" class="story-order form-control" v-model="storyOrder" type="text" placeholder="Порядок">
                        </span>
                        
                    <v-btn @click="closeBtn" class="close-btn" v-show="showCloseBtn">Отмена</v-btn>
                </span>
                <div class="stories">                    
                    <span class="carousel-element" v-for="(story, index) in storyData" :key="index">
                        <span v-if="showDarkBg" class="dark-bg"></span>
                        <img @click="getPages(story.storyPages)" @mouseover="showChangeBtn" @mouseleave="hideChangeBtn" class="story-image-preview" :src="story.imageUrl" alt="">
                        <span @click="change(story)" class="change-btn">Изменить</span>    
                    </span>                
                    <!-- <carousel :autoplay="false" :nav="false" class="stories-carousel"> -->
                        <!-- <img class="carousel-element" v-for="(story, index) in storyData" :key="index" :src="story.imageUrl">  -->                    
                        <!-- <img @click="tmp" class="carousel-element"  src="https://placeimg.com/200/200/any?1"> -->
                    <!-- </carousel> -->
                </div>
            </div>
            <div class="content">
                <div class="add-pages"  v-if="isEditBox">                    
                    <!-- <input ref="input" class="form-control" type="file" @change="onFileChange"/>         -->
                    
                    <v-file-picker
                        v-if="storyPageType==='IMAGE'"
                        class="file-picker"
                        style="background: none;  width:250px"
                        :disabled="loader"
                        v-model="newPages"
                        accept="image/*"
                            label="Добавить страницу"/>
                    <input
                        type="file"
                        v-else-if="storyPageType==='VIDEO'"
                        class="file-picker"
                        style="background: none;  width:250px"
                        :disabled="loader"
                        @change="onVideoChange($event)"
                        accept="image/*"
                            label="Добавить страницу"/>
                    <!-- <input type="text" class="form-control" v-model="action" placeholder="action">      -->
                    <v-select :items="actionsData"
                        style="width: 250px"
                        v-model="action"
                        label="Actions">
                    </v-select>       
                    <!-- <input type="text" class="form-control" v-model="content" placeholder="content">    -->
                    <v-text-field
                    style="width: 250px"
                    v-model="content"
                    label="Контент"
                    required
                    ></v-text-field>         
                    <!-- <input type="text" class="form-control" v-model="storyPageOrder" placeholder="story_page_order">             -->
                    <v-text-field
                    style="width: 250px"
                    v-model="storyPageOrder"
                    label="Порядок страницы"
                    required
                    ></v-text-field>      
                    <v-text-field
                    style="width: 250px"
                    v-model="duration"
                    label="Продолжительность"
                    required
                    ></v-text-field>  
                    <v-select :items="['IMAGE', 'VIDEO']"
                        style="width: 250px"
                        v-model="storyPageType"
                        label="storyPageType">
                    </v-select>  
                    <v-btn v-show="isEdit" @click="edit">Сохранить</v-btn>
                    <v-btn v-show="!isEdit" @click="addStory">Сохранить</v-btn>
                    <img v-if="storyPageType==='IMAGE'" class="page-image" :src="currentPage.imageUrl" />
                    <video v-else-if="changeVideo" style="margin:15px" width="250" autoplay  muted controls>
                        <source :src="videoPreview" type="video/mp4">
                    </video> 
                </div>      
                <span class="page-image-box" v-for="(page, index) in contentPages" :key="index">
                    <p class="page-image-text">{{page.storyPageOrder}}</p>
                    <img v-if="page.storyPageType==='IMAGE'" class="page-image" :tmp="page.action"  :src="page.imageUrl" alt="image">
                    <video v-else-if="page.storyPageType==='VIDEO'" style="margin:15px" width="250" autoplay  muted controls>
                        <source :src="page.imageUrl" type="video/mp4">
                    </video>                         
                    <v-btn class="page-image-btn" v-if="isEditBox" @click="deletePage(page)">Удалить</v-btn>
                </span>                         
            </div>
        </div>
    </div>    
</template>
<script>
import Vue from 'vue';
import carousel from 'vue-owl-carousel'

export default {
    name: 'Stories',
    components:{
        carousel
    },
    data(){
        return {
            storyHeader: [
                {text: 'ID', value: 'id'},
                {text: 'Title', value: 'title'},
                {text: 'Description', value: 'description'},
                {text: 'Icon URL', value: 'iconUrl'},
                {text: 'Действие', sortable: false},
            ],
            storyData: [],
            pagination: {},
            search: '',
            contentPages: [],
            isChange: false,
            isEditBox: false,
            currentItem: {},
            newImage: '',
            showCloseBtn: false,
            newPages: '',
            newPagesArr: [],
            currentPage: {},
            storyPageOrder: '',
            content: '',
            action: '',
            id: '',
            lang: 'RU',
            isAddPage: false,
            isEdit: false,
            storyOrder: 1,
            tempStory: '',
            actionsData: [],
            showDarkBg: false,
            storyPageType: 'IMAGE',
            duration: '',
            changeVideo: '',
            videoPreview: '',
        }
    },  
    watch:{
        newImage(image) {
            //console.log(image);
            let self = this;
            if (image.length > 0) {
                let reader = new FileReader();
                reader.onload = e => {
                    self.$set(self.currentItem, 'imageUrl', e.target.result);
                };

                reader.readAsDataURL(image[0]);
                // //console.log(self.currentItem);

            }
            self.$set(self.currentItem, 'imageUrl', '');
            this.showCloseBtn = true;
        },
        newPages(image) {
            //console.log(image)
            this.changeVideo = '';
            let self = this;
            if (image.length > 0) {
                let reader = new FileReader();
                reader.onload = e => {
                    self.$set(self.currentPage, 'imageUrl', e.target.result);
                };

                reader.readAsDataURL(image[0]);
            }
            self.$set(self.currentPage, 'imageUrl', '');
            // this.showCloseBtn = true;
        },
        lang(val){

            this.getAllStoryList(val);
            this.tempStory = '';
            this.contentPages = [];
            this.isEditBox = false;
            this.id = '';
            this.showCloseBtn = false;
            this.currentItem = {};
            this.currentPage = {};
            this.newPagesArr = [];
            this.showDarkBg = false;


        }
    
    },
    methods: { 
        onVideoChange(e){
            this.changeVideo = e.target.files[0];
            console.log(this.changeVideo);
            if(this.changeVideo)
                this.videoPreview = URL.createObjectURL(e.target.files[0]);

        },  
        add(){
            this.closeBtn();
            this.storyOrder = '';
            this.isEditBox = true;
            this.isEdit = false;

            this.showCloseBtn = true;
        },

        onFileChange(e) {
                // e.preventDefault();

                const files = e.target.files || e.dataTransfer.files
                if (!files.length)
                    return
                //console.log(files);
                const imgPreview = URL.createObjectURL(files[0])
                this.newPagesArr.push({'file': files[0], 'url': imgPreview});
                //console.log(this.newPagesArr)

        },
        addPages(){
            //console.log('test')
            var block = document.getElementById('new-pages');
            // block.onclick = function(e) {
            var point = document.createElement('div');
            point.setAttribute("id", "new-pages-child");
            point.style.width = '250px';
            point.style.height = '200px';
            point.style.padding = '20px';
            point.style.background = '#ecdf83';
            point.style.margin = '15px';
            point.style.borderRadius = '20px';
            block.appendChild(point);
            // }
        },
        closeBtn(){
            this.showDarkBg = false;
            this.tempStory = '';
            this.contentPages = [];
            this.isEditBox = false;
            this.id = '';
            this.showCloseBtn = false;
            this.currentItem = {};
            this.currentPage = {};
            this.newPagesArr = [];
            this.getAllStoryList(this.lang);
            
        

        },
        change(story){
            // //console.log(story);
            this.showDarkBg = true;
            if(this.tempStory)
                this.storyData.push(this.tempStory);
            this.isEdit = true;
            this.id = story.id;
            this.isEditBox = true;
            this.storyOrder = story.storyOrder;
            this.showCloseBtn = true;
            this.storyPageOrder = '';
            this.content = '';
            this.action = '';
            this.currentPage = [];
            let self = this;
            this.contentPages = story.storyPages;
            this.sortByStoryPageOrder(this.contentPages);
          
            
            // this.currentItem.imageUrl = story.imageUrl;
            this.$set(this.currentItem, 'imageUrl', story.imageUrl);
            // //console.log(this.currentItem);
            let item = self.storyData.find( x => x.id  === story.id);
            this.tempStory = item;
            self.storyData.splice(self.storyData.indexOf(item),1);
            //console.log('\n\n--------STORY PAGES--------------\n\n')
            //console.log(this.contentPages);
            //console.log('\n\n--------STORY PAGES--------------\n\n')
        },
        showChangeBtn(){
            this.isChange = true;
        },
        hideChangeBtn(){
            this.isChange = false;
        },
        sortByStoryPageOrder(arr){
            arr.sort((a, b) => a.storyPageOrder > b.storyPageOrder ? 1 : -1);
        },
        sortByStoryOrder(arr){
            arr.sort((a, b) => a.storyOrder > b.storyOrder ? 1 : -1);
        },
        getPages(pages){
            //console.log(pages);
            // this.closeBtn();
            this.contentPages = [];
            this.sortByStoryPageOrder(pages);
            this.contentPages = pages;
        },
        addStory(){
            let self = this;
            self.contentPages = [];
            if(self.currentPage.imageUrl){
                if(this.storyPageType==='IMAGE'){
                    self.contentPages.push({
                        'action': self.action,
                        'content': self.content,
                        'imageUrl': self.currentPage.imageUrl,
                        'storyPageOrder': self.storyPageOrder,
                    });
                }
                else if(this.storyPageType==='VIDEO'){
                    self.contentPages.push({
                        'action': self.action,
                        'content': self.content,
                        'videoUrl': self.changeVideo,
                        'storyPageOrder': self.storyPageOrder,
                    });
                }
                //console.log(self.currentPage);
            }  
            if(this.storyPageType==="IMAGE"){
                const formData = {
                    "color": "",
                    "title": 'string',
                    "description": "string",
                    // "iconUrl": "string",
                    'imageUrl' : this.currentItem.imageUrl,
                    'storyOrder': parseInt(this.storyOrder),
                    'lang': this.lang,
                    'storyPages' : self.contentPages,
                }
                //console.log('formData:')
                // console.log(formData);
                self.$http.post(self.$store.getters.newApiUrl + '/story/add', formData)
                .then(response => {
                    console.log(response.data);
                    // self.currentItem.imageUrl = response.data.data.imageUrl;
                    self.getAllStoryList();
                    window.location.reload();
                    setTimeout(() => self.closeBtn(), 4000);
                    
                    location.reload();
                }, self.handleError);
            }
            else if(this.storyPageType==='VIDEO'){
                let data = new FormData();
                data.append('imageUrl', this.currentItem.imageUrl);
                data.append('storyOrder', parseInt(this.storyOrder));
                data.append('lang',this.lang);
                data.append('storyPages',self.contentPages);

                self.$http.post(self.$store.getters.newApiUrl + '/story/add', formData)
                    .then(response => {
                        //console.log(response.data);
                        self.currentItem.imageUrl = response.data.data.imageUrl;
                        self.getAllStoryList();
                        window.location.reload();
                        setTimeout(() => self.closeBtn(), 4000);
                        
                        location.reload();
                    }, self.handleError);

            }
    
        },
        deletePage(page){
            let self = this;
            let item = this.contentPages.find( x => x.id  === page.id);
            this.contentPages.splice(this.contentPages.indexOf(item),1);
            const formData = {
                "color": "string",
                "title": 'string',
                "description": "string",
                "iconUrl": "string",
                'storyOrder': this.storyOrder,
                'lang': this.lang,
                'id': this.id,
                'storyPages' : self.contentPages,
            }
            //console.log('formData:')
            //console.log(formData);
            self.$http.put(self.$store.getters.newApiUrl + '/story/edit', formData)
            .then(response => {
                //console.log(response.data);
                self.closeBtn();
                // self.currentItem.imageUrl = response.data.data.imageUrl;
                // self.getAllStoryList();
                //   window.location.reload();
                // setTimeout(() => self.closeBtn(), 4000);
                
                // location.reload();
            }, self.handleError);

        },
        edit(){
            let self = this;
            //console.log('\n\n--------TEST--------------')
            
            if(self.currentPage.imageUrl){
                self.contentPages.push({
                    'action': self.action,
                    'content': self.content,
                    'imageUrl': self.currentPage.imageUrl,
                    'storyPageOrder': parseInt(self.storyPageOrder),
                    "storyPageType": self.storyPageType,
                    "duration": self.duration,

                });
                //console.log(self.currentPage);

            }            
            // //console.log(self.currentPage);

            //console.log('--------TEST--------------\n\n')

            const formData = {
                "color": "string",
                "title": 'string',
                "description": "string",
                "iconUrl": "string",
                'imageUrl' : self.currentItem.imageUrl,
                'storyOrder': parseInt(this.storyOrder),
                'lang': this.lang,
                'id': this.id,
                'storyPages' : self.contentPages,                
            }
            //console.log('formData:')
            //console.log(formData);
            self.$http.put(self.$store.getters.newApiUrl + '/story/edit', formData)
            .then(response => {
                //console.log(response.data);
                // self.currentItem.imageUrl = response.data.data.imageUrl;
                self.closeBtn();

                // self.getAllStoryList();
                //   window.location.reload();
                // setTimeout(() => self.closeBtn(), 4000);
                
                // location.reload();
            }, self.handleError);
        },
        getAllStoryList(lang) {
            let self = this;
            self.storyData = [];
            self.$http.get(self.$store.getters.newApiUrl + '/story/list',  {headers: {'lang': lang}})
                .then(response => {
                    // //console.log(response)
                    this.sortByStoryOrder(response.data.data);
                    self.storyData = response.data.data;
                    //console.log('StoryData: ');
                    //console.log(self.storyData);
                    //console.log('--------------------------\n\n')
                }, self.handleError);
        },
        deleteStory(id) {
            let self = this;
            self.$http.delete(self.$store.getters.newApiUrl + `/story/delete/${id}`)
                .then(() => {
                    location.reload();
                }, self.handleError);
        },
        getActions(){
            let self = this;
            self.$http.get(self.$store.getters.apiUrl + '/notification/notificationTypes')
                .then((response) => {
                    self.actionsData = response.data.data;
                    //console.log('\n\n-----------\n\n');
                    //console.log(self.actionsData);
                    //console.log('\n\n-----------\n\n');
                }, self.handleError);
        }
    },
    mounted(){
        this.getActions();
        this.getAllStoryList(this.lang);
    }
}
</script>

<style scoped>
    .delete-story{
        width: 20px;
        height: 20px;
        position: absolute;
        z-index: 4;
        left: 0;
        margin: -9px -7px;
    }
    .dark-bg{
        width: 100%;
        height: 100%;
        background: black;
        z-index: 1;
        position: absolute;
        opacity: 0.6;
        border-radius: 20px;
    }
    .order-box-text{
        margin: 0;
        color: #f9ca03;
        font-weight: 700;
    }
    .order-box{
        z-index: 4;
        width: 100%;
        padding: 15px;
    }
    .page-image-box{
        display: flex;
        flex-direction: column;
    }
    .page-image-btn{
        margin: 0px 15px;
        background: #e05757 !important;
        color: #FFFF !important;
    }
    .story-order{
        z-index: 3;
        opacity: 0.9;
        /* width: 190px !important; */
    }
    .form-control{
        display: block;
        width: 100%;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        margin: 10px;
    }
    .new-pages-img{
        max-width: 250px;
        max-height: 444px;
        margin: 15px;
    }
    .new-story-child{
        font-style: italic;
        font-size: 22px;
        text-align: center;
        color: #909090;
        
    }
    /* .add-pages:hover{
        background: linear-gradient(45deg, rgb(208, 208, 208) 0%, rgba(177, 177, 177, 0) 50%, rgba(173, 173, 173, 0.3) 100%);
        border-color: #757575;
    } */
    #new-pages{
        display: flex;
        align-items: center;
    }
    #new-pages-child{
        /* width: 250px;
        height: 200px; */
        padding: 20px;
        background: #ecdf83;
        margin: 15px;
        border-radius: 20px;
        display: flex;
    }
    .add-pages{
        /* width: 273px;
        height: 125px; */
        padding: 20px;
        border: 3px dashed #909090;
        margin: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        /* background: url('../assets/add-pages.png'); */

        /* -webkit-transition: all 1.5s ease;;
        -moz-transition: all 0.3s ease;;
        -o-transition: all 0.3s ease;;
        transition: all 1.5s ease; */
    }
    .close-btn{
        margin: 0 !important;
        background: #e05757 !important;
        border-radius: 0px 0 15px 15px !important;
        color: #FFF !important;
        width: 100% !important;
    }
    .file-picker{
        z-index: 2;
        background: #e0ca6dbf;
            border-radius: 14px 14px 0 0;
    }
    .story-image-preview{
        /* max-width: 185px;
        max-height: 185px; */
        max-width: 200px;
        max-height: 200px;
        margin: auto;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 20px;
    }
    .change-btn{
        background: #fdcd00;
        padding: 10px;
        border-radius: 0 0 10px 10px;
        z-index: 2;
    }
    .page-image{
        width: 250px;
        height: auto;
        margin: 15px;
        position: relative;
    }
    .page-image-text{
        position: absolute;
        background:#f9ca03;
        z-index: 1;
        border-radius: 15px;
        width: 23px;
        text-align: center;
        /* color: #FFF; */
        margin: 0px;
        height: 20px;
        font-weight: 700;
    }
    .owl-item{
        width: fit-content !important;
    }
    .stories-carousel{
        width: 1000px;
    }
    .carousel-element{
        background: #5e626a;
        width: 200px !important;
        height: 200px;
        border-radius: 20px;
        /* padding: 15px 15px 0 15px; */
        margin: 15px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;            
        position: relative;
        background-repeat: no-repeat;
        background-size: cover;
    }
    /* .carousel-element:hover{
        width: 210px;
        height: 210px;
        transform: translateX(-5px);
    } */
    .main{
        width: 100%;
        height: 100%;        
    }
    .header{
        display: flex;
        background: #F5F5F5;
        align-items: center;
        /* height: 175px; */
        /* flex-direction: column; */
    }
    .content{
        padding: 15px;
        background: #FFFF;
        overflow-x: auto;
        width: 100%;
        display: flex;
        /* align-items: center; */
    }
    .new-story{
        background: #f5f5f5;
        background-image: url('../assets/plus.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        border-radius: 38px;
        cursor: pointer;
        width: 150px !important;
        height: 150px;
        margin-left: 30px;
    }
    .stories{
        /* flex: 1; */
        /* width: 100%; */
        /* width: 215px; */
        display:  -webkit-box;
        overflow: auto;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
        opacity: 0;
    }
</style>