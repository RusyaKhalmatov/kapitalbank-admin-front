<template>
  <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="navigation"
  >
    <v-list dense>
      <!-- <template v-for="(naviItem, naviIndex) in menuProp">
          <v-list-group
                  v-if="naviItem.child"
                  :key="naviIndex">
              <v-list-tile slot="activator" class="cursor-pointer">
                  <v-list-tile-avatar>
                      <v-icon v-text="naviItem.icon" color="primary"></v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                      <v-list-tile-title v-text="naviItem.title"></v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
                  <v-list-tile v-for="(naviItemChild,i) in naviItem.child" :key="i"
                              @click.stop="redirect(naviItemChild.action)" class="cursor-pointer">
                      <v-list-tile-avatar>
                          <v-icon v-text="naviItemChild.icon" color="primary"></v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                          <v-list-tile-title v-text="naviItemChild.title"></v-list-tile-title>
                      </v-list-tile-content>
                  </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="naviIndex" @click.stop="redirectTo(naviItem)" class="cursor-pointer">
              <v-list-tile-avatar>
                  <v-icon v-text="naviItem.icon" color="primary"></v-icon>
              </v-list-tile   -avatar>
              <v-list-tile-content>
                  <v-list-tile-title v-text="naviItem.title"></v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
      </template>          -->
      <v-list v-for="(naviItem, naviIndex) in menuProp" :key="naviIndex">
        <v-list-group
            v-if="naviItem.child"
            :key="naviIndex">
          <v-list-tile slot="activator" class="cursor-pointer">
            <v-list-tile-avatar>
              <v-icon v-text="naviItem.icon" color="primary"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="naviItem.title"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list v-for="(naviItemChild, i) in naviItem.child" :key="i">
            <v-list-group v-if="naviItemChild.child" :key="i">
              <v-list-tile slot="activator" class="cursor-pointer">
                <v-list-tile-avatar>
                  <v-icon v-text="naviItemChild.icon" color="primary"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="naviItemChild.title"/>
                </v-list-tile-content>
              </v-list-tile>
              <v-list v-for="(naviItemChildChild,idx) in naviItemChild.child" :key="idx"
                      @click.stop="redirect(naviItemChildChild.action)" class="cursor-pointer">
                <v-list-group v-if="naviItemChildChild.child" :key="i">
                  <v-list-tile slot="activator" class="cursor-pointer">
                    <v-list-tile-avatar>
                      <v-icon v-text="naviItemChildChild.icon" color="primary"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-text="naviItemChildChild.title"/>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-for="(naviItemChildChild2,idsx) in naviItemChildChild.child" :key="idsx"
                               @click.stop="redirect(naviItemChildChild2.action)" class="cursor-pointer">
                    <v-list-tile-avatar>
                      <v-icon v-text="naviItemChildChild2.icon" color="primary"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-text="naviItemChildChild2.title"/>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
                <v-list-tile v-else :key="i" @click.stop="redirectTo(naviItemChildChild)" class="cursor-pointer">
                  <v-list-tile-avatar>
                    <v-icon v-text="naviItemChildChild.icon" color="primary"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="naviItemChildChild.title"/>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-list-group>
            <v-list-tile v-else :key="i" @click.stop="redirectTo(naviItemChild)" class="cursor-pointer">
              <v-list-tile-avatar>
                <v-icon v-text="naviItemChild.icon" color="primary"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="naviItemChild.title"/>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-list-group>
        <v-list-tile v-else :key="naviIndex" @click.stop="redirectTo(naviItem)" class="cursor-pointer">
          <v-list-tile-avatar>
            <v-icon v-text="naviItem.icon" color="primary"/>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="naviItem.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: "Navigation",
  data() {
    return {}
  },
  methods: {
    redirectTo(item) {
      let self = this;
      self.redirect(item.action);
    }
  },
  computed: {
    navigation: {
      get() {
        return this.$store.getters.navigation;
      },
      set(value) {
        this.$store.commit('navigation', value);
      }
    },
    menuProp() {
      return this.$store.getters.menu;
    }
  }
}
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-list {
  padding: 0 !important;
}
</style>
