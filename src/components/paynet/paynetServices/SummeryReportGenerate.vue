<template>
    <div>
        <h2>Сгенерировать отчет</h2>
        <div class="content">
            <!-- <div class="total-header">

            </div> -->
            <div class="ecom-apelsin">
                <div class="ecom-apelsin-child">
                    <div class="ecom-apelsin-child-top">
                        <span class="logo-box">
                            <img src="@/assets/ecom.png" width="50px" height="50px" alt="ecom">
                            <p class="mb-0 ml-2 title">eCommerce</p>
                        </span>
                        <span class="total-amount-data">

                        </span>
                    </div>
                    <div class="ecom-apelsin-child-bottom">
                        <div class="uzcard-humo"></div>
                        <div class="uzcard-humo"></div>
                    </div>
                </div>
                <div class="ecom-apelsin-child pt-0 pl-0">
                    <div class="ecom-apelsin-child-top">
                        <span class="logo-box">
                            <img src="@/assets/apelsin-logo.png" width="200px" alt="apelsin">
                        </span>
                        <span class="total-amount-data">

                        </span>
                    </div>
                    <div class="ecom-apelsin-child-bottom">
                        <div class="uzcard-humo"></div>
                        <div class="uzcard-humo"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SummeryReportGenerate',
    data(){
        return {

        }
    },
    methods:{

    }
}
</script>
<style scoped>
    h2{
        font-family: 'TTCommons';
    }
    .total-header{
        max-width: 798px;
        padding: 10px;
        height: 100px;
        background: white;
        box-shadow: 0px 4px 15px 5px rgb(216 216 216 / 42%);
        border-radius: 20px;
        margin: 5px auto 29px;
    }
    .ecom-apelsin-child{
        background: white;
        box-shadow: 0px 4px 15px 5px rgb(216 216 216 / 42%);
        border-radius: 20px;
        padding: 17px;
        width: 429px;
        height: 265px;
    }
    .ecom-apelsin{
        display: flex;
        justify-content: space-evenly;
        width: 100%;
    }
    .logo-box{
        display: flex;
        align-items: center;
    }
    .title{
        font-size: 36px !important;
        font-family: 'TTCommons' !important;
        color: #094E7F;
        font-weight: 600;
    }
</style>