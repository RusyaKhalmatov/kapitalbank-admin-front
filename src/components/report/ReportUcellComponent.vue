<template>
    <div class="main">
        <h1 class="headline">Ucell отчет</h1>
        <v-tabs color="#fafafa" fixed-tabs  v-model="tabs">
            <v-tab>отчет по поставщикам</v-tab>
            <v-tab>P2P отчет</v-tab>
                <v-tab-item >
                    <div>
                        <report-ucell></report-ucell>            
                    </div>
                </v-tab-item>
                <v-tab-item >
                    <div>
                        <report-p2p-ucell></report-p2p-ucell>            
                    </div>
                </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
import ReportUcell from "./ReportUcell"
import ReportP2pUcell from "./ReportP2pUcell"

export default {
    name: 'ReportUcellComponent',
    components:{
        ReportUcell, ReportP2pUcell
    },
    data(){
        return {
            tabs: 0
        }
    },
    methods:{
        
    }
}
</script>
<style scoped>
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    }
</style>