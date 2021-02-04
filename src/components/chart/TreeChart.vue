<template>
  <div>
    <table v-if="treeData.name">
      <tr>
        <td
          :colspan="treeData.children ? treeData.children.length * 2 : 1"
          :class="{parentLevel: treeData.children, extend: treeData.children && treeData.extend}"
        >
          <div :class="{node: true, hasMate: treeData.mate}" @click="isShow=!isShow">
            <div class="person" @click="$emit('click-node', treeData)">
              <p class="node-id">{{treeData.id}}</p>
              <div class="avat">
                <div class="name">{{treeData.name}}</div>
              </div>
            </div>
            <div class="person" v-if="treeData.mate" @click="$emit('click-node', treeData.mate)">
              <div class="avat">
                <img :src="treeData.mate.image_url" />
              </div>
              <div class="name">{{treeData.mate.name}}</div>
            </div>
          </div>
          <div class="extend_handle" v-if="treeData.children" @click="toggleExtend(treeData)"></div>
          <template v-if="isShow">
            <div class="node-info">
              <v-text-field v-model="name" label="Навзвание" required></v-text-field>
              <v-select :items="types" v-model="nodeSelect" label="Тип"></v-select>
              <v-text-field v-model="parentID" label="ID родителя" required></v-text-field>
              <span style="display:flex">
                <button class="node-change" @click="changeElement()">Сохранить</button>
                <button class="node-change" @click="deleteElement(treeData.id)">Удалить</button>
              </span>
            </div>
          </template>
        </td>
      </tr>
      <tr v-if="treeData.children && treeData.extend">
        <td
          v-for="(children, index) in treeData.children"
          :key="index"
          colspan="2"
          class="childLevel"
        >
          <TreeChart :json="children" :types="types" @click-node="$emit('click-node', $event)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "TreeChart",
  props: ["json", "types"],
  data() {
    return {
      treeData: {},
      isShow: false,
      tmp: []
    };
  },

  watch: {
    json: {
      handler: function(Props) {
        let extendKey = function(jsonData) {
          jsonData.extend =
            jsonData.extend === void 0 ? true : !!jsonData.extend;
          if (Array.isArray(jsonData.children)) {
            jsonData.children.forEach(c => {
              extendKey(c);
            });
          }
          return jsonData;
        };
        if (Props) {
          this.treeData = extendKey(Props);
        }
      },
      immediate: true
    }
  },
  computed: {
    parentID: {
      get() {
        this.$store.commit("chatBotParentId", this.treeData.parentId);
        return this.treeData.parentId;
      },
      set(val) {
        // this.$store.commit("chatBotParentId", val);
        this.treeData.parentId = val;
      }
    },
    nodeSelect: {
      get() {
        this.$store.commit("chatBotType", this.treeData.type);
        return this.treeData.type;
      },
      set(val) {
        // this.$store.commit("chatBotType", val);
        this.treeData.type = val;
      }
    },
    name: {
      get() {
        // return this.$store.getters.tmpGet;
        this.$store.commit("chatBotName", this.treeData.name);
        return this.treeData.name;
      },
      set(val) {
        this.treeData.name = val;
      }
    }
  },
  methods: {
    edit() {
      this.isShow = false;
    },
    toggleExtend: function(treeData) {
      treeData.extend = !treeData.extend;
      this.$forceUpdate();
    },
    changeElement() {
      // console.log(
      //   this.treeData.id,
      //   " - ",
      //   this.$store.state.chatBotName,
      //   " - ",
      //   this.$store.state.chatBotType,
      //   " - ",
      //   this.$store.state.chatBotParentId
      // );
      const postData = {
        color: "",
        id: this.treeData.id,
        name: this.$store.state.chatBotName,
        parentId: this.$store.state.chatBotParentId,
        type: this.$store.state.chatBotType
      };
      let self = this;
      self.$http
        .post(self.$store.getters.apiUrl + "/chat-bot/element", postData)
        .then(() => {
          location.reload();
          // this.$forceUpdate();
        }, self.handleError);
    },
    deleteElement(elementId) {
      let self = this;
      self.$http
        .delete(self.$store.getters.apiUrl + "/chat-bot/element",{
          params: {
            id: elementId
          }
        })
        .then(() => {
          location.reload();
          // this.$forceUpdate();
        }, self.handleError);
    }
  },
  updated() {
    // console.log(
    //   "######## " + this.$store.getters.chatBotName + " ##############"
    // );
  }
};
</script>

<style scoped>
.bg {
}
.node-change:hover {
  background: #f9ca03;
  color: #ffff;
  border-radius: 10px;
}
.node-change {
  width: 100%;
  height: 100%;
}
.node-id {
  margin: 0;
}
.node .person .avat:hover {
  background: #7a86a0;
  color: #ffff;
}
.node-info {
  margin: -12px auto 10px auto;
  background: #dcdcdc;
  width: 500px;
  padding: 10px;
  border-radius: 10px;
  /* height: 100%; */
  /* position: absolute;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  top: 20px; */
}
table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
}
td {
  position: relative;
  vertical-align: top;
  padding: 0 0 50px 0;
  text-align: center;
}

.extend_handle {
  position: absolute;
  left: 50%;
  bottom: 30px;
  width: 30px;
  height: 30px;
  padding: 10px;
  transform: translate3d(-15px, 0, 0);
  cursor: pointer;
}
.extend_handle:before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid;
  border-color: #ccc #ccc transparent transparent;
  transform: rotateZ(135deg);
  transform-origin: 50% 50% 0;
  transition: transform ease 300ms;
}
.extend_handle:hover:before {
  border-color: #333 #333 transparent transparent;
}
.extend .extend_handle:before {
  transform: rotateZ(-45deg);
}

.extend::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 15px;
  height: 15px;
  border-left: 2px solid #ccc;
  transform: translate3d(-1px, 0, 0);
}
.childLevel::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 100%;
  height: 15px;
  border-left: 2px solid #ccc;
  transform: translate3d(-1px, 0, 0);
}
.childLevel::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -15px;
  border-top: 2px solid #ccc;
}
.childLevel:first-child:before,
.childLevel:last-child:before {
  display: none;
}
.childLevel:first-child:after {
  left: 50%;
  height: 15px;
  border: 2px solid;
  border-color: #ccc transparent transparent #ccc;
  border-radius: 6px 0 0 0;
  transform: translate3d(1px, 0, 0);
}
.childLevel:last-child:after {
  right: 50%;
  height: 15px;
  border: 2px solid;
  border-color: #ccc #ccc transparent transparent;
  border-radius: 0 6px 0 0;
  transform: translate3d(-1px, 0, 0);
}
.childLevel:first-child.childLevel:last-child::after {
  left: auto;
  border-radius: 0;
  border-color: transparent #ccc transparent transparent;
  transform: translate3d(1px, 0, 0);
}

.node {
  position: relative;
  display: inline-block;
  width: 20em;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.node .person {
  position: relative;
  display: inline-block;
  z-index: 2;
  width: 20em;
  overflow: auto;
}
.node .person .avat {
  display: block;
  width: 14em;
  height: 100%;
  margin: auto;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ccc;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 2em;
  border-width: 2px;
}
.node .person .avat img {
  width: 100%;
  height: 100%;
}
.node .person .name {
  height: 2em;
  line-height: 2em;
  width: 100%;
  font-weight: 700;
  overflow-x: auto;
  height: 100%;
}
.node.hasMate::after {
  content: "";
  position: absolute;
  left: 2em;
  right: 2em;
  top: 2em;
  border-top: 2px solid #ccc;
  z-index: 1;
}
.node.hasMate .person:last-child {
  margin-left: 1em;
}

.landscape {
  transform: translate(-100%, 0) rotate(-90deg);
  transform-origin: 100% 0;
}
.landscape .node {
  text-align: left;
  height: 8em;
  width: 8em;
}
.landscape .person {
  position: relative;
  transform: rotate(90deg);
  padding-left: 4.5em;
  height: 4em;
  top: 4em;
  left: -1em;
}
.landscape .person .avat {
  position: absolute;
  left: 0;
}
.landscape .person .name {
  height: 4em;
  line-height: 4em;
}
.landscape .hasMate {
  position: relative;
}
.landscape .hasMate .person {
  position: absolute;
}
.landscape .hasMate .person:first-child {
  left: auto;
  right: -4em;
}
.landscape .hasMate .person:last-child {
  left: -4em;
  margin-left: 0;
}
</style>
