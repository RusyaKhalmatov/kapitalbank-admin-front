<template>
  <div id="main" style="overflow: auto">
    <h1>ChatBot <i class="material-icons chats">chat</i></h1>
    <!--<template v-if="isShow">
      <div class="node-info">
        <p class="node-header">Создать</p>
        <v-text-field v-model="name" label="Навзвание" required></v-text-field>
        <v-select :items="types" v-model="nodeSelect" label="Тип"></v-select>
        <v-text-field v-model="parentID" label="ID родителя" required></v-text-field>

        <button class="node-change" @click="createNode()">Сохранить</button>
      </div>
      <div class="bg"></div>
    </template>-->
    <!--<pre>{{ $data.elements.children | json }}</pre>-->
      <template>
        <v-expansion-panel focusable>
            <v-expansion-panel-content
              v-for="(item, index) in elements.children"
              :key="index"
            >
                <template v-slot:header>
                    <div class="cont">
                      <div class="one">
                          <v-chip color="green" text-color="white">
                            <v-avatar class="itemID">ID</v-avatar>
                            {{item.id}}
                          </v-chip>
                      </div>
                      <div class="two">
                          <v-btn flat icon >
                            <v-icon class="fa-trash-o ico" v-on:click="preRemove(index, item.id)">delete_forever</v-icon>
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
                    <v-card-text><template>
                        <Children :types="types" :number="index" :childrenItem="item.children" :parId="item.parentId" :dt="elements" ></Children>
                    </template></v-card-text>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <template >
          <v-layout align-center class="addBtn">
            <v-flex xs12 sm12 text-xs-center>
              <div>
                <v-btn depressed large color="primary" v-on:click="preAdd(null, null)">Добавить новый элемент</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </template>
        <template><RemComponent v-if="tmpRem" :dialog="true" v-on:onremelement="remove" :rem="1" :index="index" :id="id"></RemComponent></template>
        <template><ChangeComponent :change="1" v-if="tmpChg" :dialog="true" :type="types" :index="index" :name="name" :id="id" :parentId="parentId" :nodeSelect="nodeSelect" v-on:onchangeelement="change"></ChangeComponent></template>
        <template><AddComponent :creat="1" v-if="tmpAdd" :dialog="true" :type="types" :index="index" :id="id" v-on:onaddelement="add"></AddComponent></template>
        <template><DetComponent :det="1" v-if="tmpDet" :status="status" :type="type" :id="id" :name="name" v-on:ondetelement="closeDetails"></DetComponent></template>
    </template>
    <!--<TreeChart
      :json="elements"
      :types="types"
      :class="{landscape: landscape.length}"
      @click-node="clickNode"
    />-->
  </div>
</template>

<script>
import AddComponent from './chatbot/AddComponent.vue';
import ChangeComponent from './chatbot/ChangeComponent.vue';
import Children from './chatbot/Children.vue';
import DetComponent from './chatbot/DetailsComponents.vue';
import RemComponent from './chatbot/RemComponent.vue';
import TreeChart from "../chart/TreeChart.vue";
import { Empty } from 'ant-design-vue';
export default {
  name: "Chatbot",
  components: {
    TreeChart, Children, AddComponent, ChangeComponent, DetComponent, RemComponent
  },
  data() {
    return {
      type: "",
      tmp: "",
      landscape: [],
      parents: [],
      elements: {
        name: "@KapitalChatBot",
        children: []
      },
      childs: [],
      types: [],
      isShow: true,
      name: "",
      parentID: "",
      nodeSelect: "",
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
            parentId:'',
            tmpDet: false,
    };
  },
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
        //this.elements.children[this.tmpIndex].children.push({id: this.id, name: value[0], parentId: this.ParentId, children: [], type: value[1]});
         
        const postData = {
            color: "", 
            name: this.name,
            parentId: this.parentId,
            type: this.nodeSelect,
        };
        let self = this;
        self.$http
            .post(self.$store.getters.apiUrl + "/chat-bot/element", postData)
            .then(() => {
            //location.reload();
            self.getElements();
            // self.$forceUpdate();
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
        //this.elements.children[this.tmpIndex].name = this.name;
        //this.elements.children[this.tmpIndex].type = this.nodeSelect;
        //alert("id: "+this.id+" parentId: "+this.parentId+" name: "+this.name+" type: "+this.nodeSelect);
        const postData = {
            color: "",
            id: this.id, 
            name: this.name,
            parentId: this.parentId,
            type: this.nodeSelect,
        };
        let self = this;
        self.$http
            .post(self.$store.getters.apiUrl + "/chat-bot/element", postData)
            .then(() => {
            self.getElements();
            //location.reload();
            // self.$forceUpdate();
            }, self.handleError);
        this.name = '';
        this.id = '';
        this.parentId = '';
        this.nodeSelect = '';
        this.tmpIndex = '';
        this.tmpChg = false;
      }
      this.tmpChg = false;     
    },
    clickNode: function(node) {
      // eslint-disable-next-line
      console.log(node);
    },
    getParents() {
      let self = this;
      self.$http
        .get(self.$store.getters.apiUrl + "/chat-bot/parents")
        .then(response => {
          self.parents = response.data.data;
        }, self.handleError);
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
    getChilds(parentId) {
      let self = this;
      self.$http
        .get(self.$store.getters.apiUrl + "/chat-bot/elements/" + parentId)
        .then(response => {
          self.childs = response.data.data;
        }, self.handleError);
    },
    getTypes() {
      let self = this;
      self.$http
        .get(self.$store.getters.apiUrl + "/chat-bot/element/types")
        .then(response => {
          self.types = response.data.data;
        }, self.handleError);
    },
    createNode() {
      const postData = {
        color: "",
      
        name: this.name,
        parentId: this.parentID,
        type: this.nodeSelect
      };
      let self = this;
      self.$http
        .post(self.$store.getters.newApiUrl + "/chat-bot/element", postData)
        .then(() => {
          location.reload();
          // self.$forceUpdate();
        }, self.handleError);
    }
  },
  mounted() {
    //this.getParents();
    this.getTypes();

    this.getElements();
    // this.getChilds(this.parents[0].id);
  }
};
</script>

<style scoped>
.node-header {
  display: flex;
  justify-content: center;
  margin: 10px;
  font-size: 18px;
  font-weight: 600;
}
.change-box {
  width: 500px;
  height: 300px;
  background: green;
  position: absolute;
  z-index: 2;
  top: 17%;
  left: 50%;
  transform: translateX(-50%);
}
.parent-content {
  display: flex;
}
.parent-header-info {
  display: flex;
  background: gray;
  color: #ffff;
}
.parent-info {
  padding: 10px;
  border: 1px solid #676767;
  width: 85px;
  margin: 0;
  flex: 1;
}
.parent {
  background: #ffe78f;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
}
.parents-box {
  background: #dedede;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.main {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.add {
  width: 300px;
  background: #dedede26;
  padding: 10px;
}
.select-tmp {
  padding: 5px;
  background: #ffff;
  width: 100%;
  border-radius: 5px;
  margin: 5px 0;
}
.input {
  margin: 5px 0;
  width: 100%;
  background: #ffff;
  padding: 5px;
  border-radius: 5px;
}
.btn {
  margin: 5px auto;
  background: #bcdaf9;
  padding: 5px;
  border-radius: 5px;
  display: flex;
}
#btn{
    width: 100px !important;
    background: grey;
    padding: 10px;
    margin:10px 20px 10px 0px;
    border-radius: 20px;
    z-index: 100 !important;
}
input{
    width: 100%;
    border: solid 1px gray;
    border-radius: 50px;
    padding: 20px;
    font-size: 20px;
}
.inp{
    padding: 40px 20px;
}
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
    border-left: 3px solid red;
}
.icon{
  margin-right: 10px !important;
}
h1{
  margin-top:25px;
  
  display: flex;
  align-items: center;
}
.chats{
  transform: translateY(-15px);
  color: orangered
}
.addBtn{
  margin-top: 30px;
}

</style>