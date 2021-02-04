<template>
    <div>
        <v-btn icon @click.native="logout">
            <v-icon>
                logout
            </v-icon>
        </v-btn>
        <v-btn icon to="profile">
            <v-icon>
                settings
            </v-icon>
        </v-btn>
    </div>
</template>
<script>
    export default {
        name: 'ToolbarWidget',
        methods: {
            logout() {
                let self = this;
                self.$http.post(self.$store.getters.newApiUrl + "/logout")
                    .then(response => {
                        if(response){
                            self.$store.commit('token', '');
                            self.$store.commit('deviceId','');
                            self.redirect('login')
                            self.$store.commit('userId', false);
                        }
                    }, self.handleError);
            }
        },
    }
</script>