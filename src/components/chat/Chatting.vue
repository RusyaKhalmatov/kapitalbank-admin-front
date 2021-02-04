<template>
  <div>
    <!-- <span class="d-flex mb-2">
      <v-btn class="ma-0" depressed @click="isShow=true">old</v-btn>
      <v-btn class="ma-0" depressed @click="isShow=false">new</v-btn>
    </span> -->
    
    <chat-panel v-show="isShow"></chat-panel>
    <!-- <chat-component ></chat-component> -->
  </div>
</template>

<script>
import ChatPanel from "./ChatPanel.vue";
import ChatComponent from "./ChatComponent.vue";

export default {
  name: "Chatting",
  components: {
    ChatPanel, ChatComponent
  },
  data(){
    return{
      isShow: true
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.selected {
  background-color: gainsboro;
  border-radius: 15px;
  padding: 5px;
}

.tile {
  margin: 5px;
  border-radius: 4px;
  background: green;
}
</style>