<template>
    <div class="children">
        <v-expansion-panel>
            <v-expansion-panel-content v-for="(item, index) in childrenItem" :key="index">
                <template v-slot:header>
                    <div class="cont">
                        <div class="one">
                            <v-chip color="green" text-color="white">
                                <v-avatar class="itemID">ID</v-avatar>
                                {{item.id}}
                            </v-chip>
                        </div>
                        <div class="two">
                            <v-btn flat icon v-on:click="preRemove(index, item.id)">
                                <v-icon class="fa-trash-o ico">delete_forever</v-icon>
                            </v-btn>
                            <v-btn flat icon v-on:click="preAdd(index, item.id)">
                                <v-icon class="fa-plus ico">add</v-icon>
                            </v-btn>
                            <v-btn flat icon v-on:click="preChange(index, item.name, item.id, item.parentId, item.type)">
                                <v-icon class="fa-pencil ico">edit</v-icon>
                            </v-btn>
                        </div>
                        <div class="three">
                            <v-icon class="fa-pencil icon" v-on:click="details(1, item.name, item.type, item.id)">filter_center_focus</v-icon>
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                </template>
                <v-card>
                    <v-card-text><Children :dt="elements" :number="index" :types="types" :childrenItem="item.children" :parId="parentId"></Children></v-card-text>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <template><RemComponent v-if="tmpRem" :dialog="true" v-on:onremelement="remove" :rem="1" :index="index" :id="id"></RemComponent></template>
        <template><AddComponent :creat="1" v-if="tmpAdd" :dialog="true" :type="types" :index="index" :id="id" v-on:onaddelement="add"></AddComponent></template>
        <template><ChangeComponent :change="1" v-if="tmpChg" :dialog="true" :type="types" :index="index" :name="name" :id="id" :parentId="parentId" :nodeSelect="nodeSelect" v-on:onchangeelement="change"></ChangeComponent></template>
        <template><DetComponent :det="1" v-if="tmpDet" :status="status" :type="type" :id="id" :name="name" v-on:ondetelement="closeDetails"></DetComponent></template>
    </div>
</template>
<script>
import Children from './Children.vue';
import AddComponent from './AddComponent.vue';
import ChangeComponent from './ChangeComponent.vue';
import RemComponent from './RemComponent.vue';
import DetComponent from './DetailsComponents.vue';
export default {
    name: "Children",
    components: {
        Children, RemComponent, AddComponent, ChangeComponent, DetComponent,
    },
    props: ['number', 'childrenItem', 'parId', "types", "dt"],
    methods: {
        details(status, name, type, id){
            if(status === 1){
                this.status = status;
                this.name = name;
                this.type = type;
                this.id = id;
                this.tmpDet = true;
            }          
        },
        closeDetails(value){
            this.tmpDet = false;
        },
        preRemove(index, id){   
            this.tmpRem = true;
            this.index = index;
            this.id = id;
        },
        remove(value){
            if(value[1] === 1){
                this.id = value[2];
                this.index = value[0];
                //this.childrenItem.splice(this.index, 1);
                //alert("id: "+this.id);
                let self = this;
                self.$http
                    .delete(self.$store.getters.apiUrl + "/chat-bot/element",{
                    params: {
                        id: this.id
                    }
                    })
                    .then(() => {
                        self.getElements();
                    //location.reload();
                    // this.$forceUpdate();
                    }, self.handleError);
            } 
            this.id = '';
            this.index = '';
            this.tmpRem = false;
        },
        preAdd(index, id){
            //alert(index+" - "+id)
            this.index = index;
            this.id = id;
            this.tmpAdd = true;
        },
        add: function(value){
            this.tmpAdd = false;
            if(value[0]){
                this.name = value[0];
                this.nodeSelect = value[1];
                this.tmpIndex = value[2];
                this.parentId = value[3];
                this.id = Math.random();
                //alert("id: "+ this.id + " name: " + this.name + " parrentId: " + this.parentId + " type: " + this.nodeSelect);
                //this.childrenItem[this.tmpIndex].children.push({id: this.id, name: value[0], parentId: this.ParentId, children: [], type: value[1]});
                const postData = {
                    color: "", 
                    name: this.name,
                    parentId: this.parentId,
                    type: this.nodeSelect,
                };
                let self = this;
                self.$http
                    .post(self.$store.getters.newApiUrl + "/chat-bot/element", postData)
                    .then(() => {
                        self.getElements();
                    //location.reload();
                    //this.$emit('ongetelement');

                    // self.$forceUpdate();
                    //this.$emit('ongetelement');
                    }, self.handleError);
                
                this.name = '';
                this.nodeSelect = '';
                this.tmpIndex = '';
                this.parentId = '';
                this.id = '';
            }
        },
        preChange(index, name, id, parentId, nodeSelect){
            //alert(index+" - "+name+" - "+id+" - "+parentId+" - "+nodeSelect);
            this.index = index;
            this.name = name;
            this.id = id;
            this.parentId = parentId;
            this.nodeSelect = nodeSelect;
            this.tmpChg = true;
        },
        change(value){
            if(value[3] === 1){
                this.name = value[0];
                this.id = value[4];
                this.parentId = value[5];
                this.nodeSelect = value[1];
                this.tmpIndex = value[2];
                //this.childrenItem[this.tmpIndex].name = this.name;
                //this.childrenItem[this.tmpIndex].type = this.nodeSelect;
                //alert("id: "+this.id+" parentId: "+this.parentId+" name: "+this.name+" type: "+this.nodeSelect);
                //this.childrenItem[this.tmpIndex].name = value[0];
                //this.childrenItem[this.tmpIndex].type = value[1];
                const postData = {
                    color: "",
                    id: this.id, 
                    name: this.name,
                    parentId: this.parentId,
                    type: this.nodeSelect,
                };
                let self = this;
                self.$http
                    .post(self.$store.getters.newApiUrl + "/chat-bot/element", postData)
                    .then(() => {
                    self.getElements();
                    //location.reload();
                    // self.$forceUpdate();
                    //this.$emit('ongetelement');
                    }, self.handleError);
            }
            this.name = '';
            this.id = '';
            this.parentId = '';
            this.nodeSelect = '';
            this.tmpIndex = '';
            this.tmpChg = false;     
        },
        getElements() {
        let self = this;
        self.$http
            .get(self.$store.getters.apiUrl + "/chat-bot/elements")
            .then(response => {
            self.elements.children = response.data.data;
            console.log(response.data.data)
            }, self.handleError);
        },
    },
    data: function(){
        return{
            index: '',
            tmpRem: false,
            status: 1,
			tmpIndex: '',
            tmpValue: '',
            message: '',
            show: false,
            tmp: false,
            id: '',
            ParentId: '',
            data: 'message',
            tmpName: '',
            tmpAdd: false,
            tmpChg: false,
            tmpRem: false,
            currentType: '',
            nodeSelect: '',
            name: '',
            parentId:'',
            parentid: '',
            tmpParId: '',
            elements: this.dt,
            tmpDet: false,
        }
    }
}
</script>

<style scoped>
#main{
  width: 100%;
}
.v-chip{
    //border-radius: 7px;
    background: white !important;
    border: solid 1px #EE8108 !important;
    color: #5c5c5c !important;
    font-size: 16px !important;
    height: 28px !important;
    width: 80px !important;
}
.itemID, .v-avatar{
    //border-radius: 5px;
    background-color: #EE8108 !important;
    color: white !important;
    font-size: 20px !important;
}
.ico{
    font-size: 20px !important;
    //margin: 0px 5px;
    font-weight: 100;
}
.v-btn, .v-btn--flat, .v-btn--icon, .theme--light{
  margin:0px !important;
}
.fa-trash-o{
    color: #222222 !important;
}
.fa-plus{
    color: #EE8108 !important;
}
.fa-pencil{
    color: #F6B000 !important;
}

.cont{
    position: relative;
}
.one, .two, .three{
    padding: 10px 10px;
    display: inline-block;
}
.one, .two{
    border-right: solid 1px grey;
}
.three{
    padding-top:0px;
    display: -webkit-inline-box;
    position: relative;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50%;
    transform: translateY(50%);
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    //background: red;
    font-size: 18px;
}
.v-expansion-panel__container--active{
    border-left: 3px solid #F9CA03;
}
.icon{
  margin-right: 10px !important;
}
</style>