<template>
    <div class="main">
        <h1>Сводная таблица</h1>
        <div class="header">
            <v-btn
            @click="TwoDaysAgo()"
            :class="[{'active-btn': active === 'btn7' },'header-button']"
            rounded
            color="primary"
            dark
            >За Позавчера</v-btn>
            <v-btn
            @click="Yesterday()"
            :class="[{'active-btn': active === 'btn1' },'header-button']"
            rounded
            color="primary"
            dark
            >За вчера</v-btn>
            <v-btn
            @click="Today()"
            :class="[{'active-btn': active === 'btn2' },'header-button']"
            rounded
            color="primary"
            dark
            >За сегодня</v-btn>
            <v-btn
            @click="LastMonth()"
            :class="[{'active-btn': active === 'btn3' },'header-button']"
            rounded
            color="primary"
            dark
            >За прошлый месяц</v-btn>
            <v-btn
            @click="Month()"
            :class="['header-button', {'active-btn': active === 'btn4' }]"
            rounded
            color="primary"
            dark
            >За текущий месяц</v-btn>
            <v-btn
            @click="getAll"
            :class="['header-button', {'active-btn': active === 'btn5' }]"
            rounded
            color="primary"
            dark
            >За весь период</v-btn>
            <v-btn
            @click="getSettings"
            :class="['header-button', {'active-btn': active === 'btn6' }]"
            rounded
            color="primary"
            dark
            >Настройка</v-btn>
        </div>
        <div class="date-box" v-if="isDate">
            <p class="date-text">С {{ fromDate | timestamp-to-date}}</p>
            <p class="date-text">До {{ toDate | timestamp-to-date}}</p>
        </div>
        <div class="select-date-box" v-if="isSelect">
            <span class="select-date-box-child">
                <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date1"
                            label="С"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                </v-menu>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date2"
                        label="До"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                </v-menu>
            </span>
            <!-- <v-btn class="set-date" @click="getData">Получить</v-btn> -->
        </div>
        <!-- <div class="select-type-box">
            <v-btn :class="[{'active-select-btn': selectedItem === 'apelsin' }, 'select-type-btn']" @click="change('apelsin')"><img draggable="false" class="select-box-image" src="@/assets/apelsin.png" alt="apelsin">Apelsin</v-btn>
            <v-btn :class="[{'active-select-btn': selectedItem === 'telegramBot' }, 'select-type-btn']" @click="change('telegramBot')"><img draggable="false" class="select-box-image" src="@/assets/telegrambot-image.jpg"  alt="telegrambot">TelegramBot</v-btn>
        </div> -->
        <!-- <h2 v-if="corAccData.result">Корр счет Капиталбанка: {{Math.abs(corAccData.result[0].s_out/100) | number-format}}</h2>
        <h2 v-if="apelsinCorAccData.result">Корр счет Apelsin: {{Math.abs(apelsinCorAccData.result[0].s_out/100) | number-format}}</h2> -->
        <div class="cor-acc" v-if="apelsinCorAccData">
            <div class="cor-acc-top">
                <img class="apelsin-logo" src="@/assets/apelsin-logo.png" alt="apelsin">
                <p class="cor-acc-top-text">Корр счет</p>
                <img class="kapital-logo" src="@/assets/kapitalbank-logo.png" alt="kapitalbank">
            </div>
            <div class="cor-acc-content d-flex align-center justify-space-between">
                <h2 class="mb-0"  v-if="apelsinCorAccData.result" style="border-right: 1px solid #e4e4e4;">{{Math.abs(apelsinCorAccData.result[0].s_out/100) | number-format}}</h2>
                <h2 class="mb-0" v-if="corAccData.result">{{Math.abs(corAccData.result[0].s_out/100) | number-format}}</h2>
            </div>
        </div>
        <div class="cor-acc-xs" v-if="apelsinCorAccData">
            <p class="cor-acc-top-text">Корр счет</p>
            <div>
                <img class="apelsin-logo" src="@/assets/apelsin-logo.png" alt="apelsin">
                <h2 class="tc mb-0"  v-if="apelsinCorAccData.result">{{Math.abs(apelsinCorAccData.result[0].s_out/100) | number-format}}</h2>
            </div>
            <v-divider class="my-2"></v-divider>
            <div>
                <img class="kapital-logo" src="@/assets/kapitalbank-logo.png" alt="kapitalbank">
                <h2 class="tc mb-0"  v-if="corAccData.result">{{Math.abs(corAccData.result[0].s_out/100) | number-format}}</h2>
            </div>
        </div>

        <span class="platform-box">
            <v-btn flat :class="['platform-btn', {'active-platform-btn': isActivePlatform===item.key}]" v-for="(item,index) in platformData" :key="index" @click="isActivePlatform=item.key">
                <img class="platform-logo" v-if="item.key==='ANDROID'" src="@/assets/android_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='IOS'" src="@/assets/apple_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='WEB'" src="@/assets/web_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='TOTAL'" src="@/assets/apelsin.png" alt="">
                <img class="platform-logo" v-if="item.key==='BEFORE'" src="@/assets/before_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='USSD'" src="@/assets/ussd_icon.png" alt="">

                <p>{{item.value}}</p>
            </v-btn>
        </span>
        <v-btn depressed @click="getData" class="set-date">Получить</v-btn>
        <div class="content-box" v-if="selectedItem==='apelsin'">
            <div class="deposit-box" v-if="depositData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Вклады</p>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Сумма</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Комиссия</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>      
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Количество операций</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                            <p class="deposit-sum border-none">Итого</p>
                        </div>
                    </div>                      
                </div>
                <div class="deposit-content" >
                    <div class="open-deposit select-deposit">                
                            <v-expansion-panel>
                                <v-expansion-panel-content >
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.openDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.openDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.openDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.openDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.openDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.openDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummery.operations | number-format}}</p>
                                            </div>
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header >
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryOur.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.openDepositSummeryOur.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOur.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOur.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOur.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOur.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOur.operations | number-format}}</p>
                                                    </div>                                                                                           
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel ">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryOurUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOurUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurUzcard.operations | number-format}}</p>
                                                </div>     
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryOurHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOurHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurHumo.operations | number-format}}</p>
                                                </div>     
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryOurVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOurVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOurVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurVisa.operations | number-format}}</p>
                                                </div> 
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryOther.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.openDepositSummeryOther.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOther.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOther.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOther.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOther.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOther.operations | number-format}}</p>
                                                    </div>  
                                                </div>
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOtherUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryOtherUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOtherUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOtherUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOtherUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherUzcard.operations | number-format}}</p>
                                                </div>                                             
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOtherHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryOtherHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOtherHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOtherHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.openDepositSummeryOtherHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherHumo.operations | number-format}}</p>
                                                </div> 
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <!-- <div class="open-deposit select-deposit">
                                        <p class="deposit-box-header-left">{{depositData.openDepositSummeryWallet.title}}</p>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum">{{depositData.openDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryWallet.usd / 100 | number-format}}</p>
                                        </div>
                                    </div> -->
                                    <v-expansion-panel> 
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryWallet.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.openDepositSummeryWallet.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.openDepositSummeryWallet.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryWallet.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryWallet.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryWallet.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryWallet.operations | number-format}}</p>
                                                    </div> 
                                                </div>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryAccount.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryAccount.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.openDepositSummeryAccount.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.openDepositSummeryAccount.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryAccount.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryAccount.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.openDepositSummeryAccount.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryAccount.operations | number-format}}</p>
                                                    </div>  
                                                </div>                                              
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content  class="panel">
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.increaseDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.increaseDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.increaseDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.increaseDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.increaseDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.increaseDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummery.operations | number-format}}</p>
                                            </div>                                           
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.increaseDepositSummeryOur.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOur.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOur.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOur.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOur.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOur.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOur.operations | number-format}}</p>
                                                    </div>                      
                                                </div>                              
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOurUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOurUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurUzcard.operations | number-format}}</p>
                                                </div>                                                
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOurHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOurHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurHumo.operations | number-format}}</p>
                                                </div>   
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOurVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOurVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOurVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurVisa.operations | number-format}}</p>
                                                </div>    
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.increaseDepositSummeryOther.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOther.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOther.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOther.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOther.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOther.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOther.operations | number-format}}</p>
                                                    </div>   
                                                </div>                                                 
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOtherUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOtherUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOtherUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOtherUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOtherUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherUzcard.operations | number-format}}</p>
                                                </div>                                                
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOtherHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOtherHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOtherHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOtherHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryOtherHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherHumo.operations | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.increaseDepositSummeryWallet.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryWallet.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryWallet.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryWallet.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryWallet.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryWallet.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryWallet.operations | number-format}}</p>
                                                    </div>      
                                                </div>                                           
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryAccount.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.increaseDepositSummeryAccount.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryAccount.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryAccount.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryAccount.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryAccount.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.increaseDepositSummeryAccount.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryAccount.operations | number-format}}</p>
                                                    </div>    
                                                </div>                                             
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.totalAdmissionDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummery.operations | number-format}}</p>
                                            </div>                                               
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOur.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOur.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOur.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOur.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOur.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOur.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOur.operations | number-format}}</p>
                                                    </div>                                                     
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOurUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOurUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.operations | number-format}}</p>
                                                </div>                                                       
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOurHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOurHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.operations | number-format}}</p>
                                                </div>                                                  
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOurVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOurVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.operations | number-format}}</p>
                                                </div>                                                    
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOther.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOther.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOther.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOther.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOther.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOther.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOther.operations | number-format}}</p>
                                                    </div>                                                   
                                                </div>
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOtherUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOtherUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOtherUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.operations | number-format}}</p>
                                                </div>                                                          
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOtherHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOtherHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOtherHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.operations | number-format}}</p>
                                                </div>                                             
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryWallet.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryWallet.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryWallet.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryWallet.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryWallet.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryWallet.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryWallet.operations | number-format}}</p>
                                                    </div>                                                      
                                                </div>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryAccount.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryAccount.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryAccount.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryAccount.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryAccount.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryAccount.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.totalAdmissionDepositSummeryAccount.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryAccount.operations | number-format}}</p>
                                                    </div>  
                                                </div>                                                  
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content class="panel">
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.decreaseDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.decreaseDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.decreaseDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummery.operations | number-format}}</p>
                                            </div>                                             
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.decreaseDepositSummeryOur.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOur.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOur.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOur.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOur.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOur.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOur.operations | number-format}}</p>
                                                    </div>                                                         
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOurUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOurUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurUzcard.operations | number-format}}</p>
                                                </div>                                               
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOurHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOurHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurHumo.operations | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOurVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOurVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOurVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurVisa.operations | number-format}}</p>
                                                </div>                                               
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.decreaseDepositSummeryOther.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOther.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOther.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOther.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOther.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOther.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOther.operations | number-format}}</p>
                                                    </div>                                                         
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOtherUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOtherUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOtherUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherUzcard.operations | number-format}}</p>
                                                </div>                                               
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOtherHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOtherHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOtherHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherHumo.operations | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                            <!-- <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOtherVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOtherVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryOtherVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOtherVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryOtherVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOtherVisa.operations | number-format}}</p>
                                                </div>                                               
                                            </div>                                                                         -->
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.decreaseDepositSummeryWallet.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryWallet.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryWallet.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryWallet.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryWallet.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryWallet.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryWallet.operations | number-format}}</p>
                                                    </div>    
                                                </div>                                                
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryAccount.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.decreaseDepositSummeryAccount.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.decreaseDepositSummeryAccount.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryAccount.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryAccount.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryAccount.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.decreaseDepositSummeryAccount.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryAccount.operations | number-format}}</p>
                                                    </div>         
                                                </div>                                                                      
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>                            
                                </v-expansion-panel-content>                                                    
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.closeDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.closeDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.closeDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.closeDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.closeDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.closeDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummery.operations | number-format}}</p>
                                            </div>                                                    
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.closeDepositSummeryOur.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOur.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOur.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOur.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOur.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOur.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOur.operations | number-format}}</p>
                                                    </div>                                                     
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOurUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOurUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurUzcard.operations | number-format}}</p>
                                                </div>                                                      
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOurHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOurHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurHumo.operations | number-format}}</p>
                                                </div>                                               
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOurVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOurVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOurVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurVisa.operations | number-format}}</p>
                                                </div>                                                  
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.closeDepositSummeryOther.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOther.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOther.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOther.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOther.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOther.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOther.operations | number-format}}</p>
                                                    </div>                                                     
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOtherUzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOtherUzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOtherUzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherUzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherUzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherUzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherUzcard.operations | number-format}}</p>
                                                </div>                                                      
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOtherHumo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOtherHumo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOtherHumo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherHumo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherHumo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherHumo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherHumo.operations | number-format}}</p>
                                                </div>                                               
                                            </div>
                                            <!-- <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOtherVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOtherVisa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.closeDepositSummeryOtherVisa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOtherVisa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherVisa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherVisa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryOtherVisa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOtherVisa.operations | number-format}}</p>
                                                </div>                                                  
                                            </div>                                                                         -->
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.closeDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.closeDepositSummeryWallet.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.closeDepositSummeryWallet.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryWallet.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryWallet.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryWallet.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryWallet.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryWallet.operations | number-format}}</p>
                                                    </div>                       
                                                </div>                              
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>  
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none margin-24">
                                                    <p class="deposit-box-header-left">{{depositData.closeDepositSummeryAccount.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.closeDepositSummeryAccount.amountUzs | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.closeDepositSummeryAccount.amountUsd | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryAccount.commission | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryAccount.fee | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryAccount.operUzs | number-format}}</p>
                                                        <p class="deposit-sum right-padding">{{depositData.closeDepositSummeryAccount.operUsd | number-format}}</p>
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryAccount.operations | number-format}}</p>
                                                    </div>                              
                                                </div>                           
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>  
                                </v-expansion-panel-content>  
                                <v-expansion-panel-content class="panel">
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.totalChargeDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.totalChargeDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.totalChargeDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.totalChargeDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalChargeDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.totalChargeDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.totalChargeDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalChargeDepositSummery.operations | number-format}}</p>
                                            </div>           
                                        </div>                               
                                    </template>                                                                                                                                      
                                </v-expansion-panel-content>   
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="open-deposit border-none margin-24">
                                            <p class="deposit-box-header-left">{{depositData.totalDifferenceDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.totalDifferenceDepositSummery.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.totalDifferenceDepositSummery.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{depositData.totalDifferenceDepositSummery.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalDifferenceDepositSummery.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{depositData.totalDifferenceDepositSummery.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{depositData.totalDifferenceDepositSummery.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalDifferenceDepositSummery.operations | number-format}}</p>
                                            </div>        
                                        </div>                                   
                                    </template>                                                                                                                                      
                                </v-expansion-panel-content>                         
                            </v-expansion-panel>                    
                    </div>          
                </div>
            </div>
            <div class="deposit-box" v-if="conversionData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Конвертация</p>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Сумма</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Комиссия</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>      
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Количество операций</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                            <p class="deposit-sum border-none">Итого</p>
                        </div>
                    </div> 
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>                     
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{conversionData.ConversionPurchase.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{conversionData.ConversionPurchase.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{conversionData.ConversionPurchase.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{conversionData.ConversionPurchase.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchase.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{conversionData.ConversionPurchase.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{conversionData.ConversionPurchase.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchase.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOur.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionPurchaseOur.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOur.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOur.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOur.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOur.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOur.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOur.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOurUzcard.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionPurchaseOurUzcard.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOurUzcard.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOurUzcard.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOurUzcard.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOurUzcard.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOurUzcard.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOurUzcard.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOurHumo.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionPurchaseOurHumo.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOurHumo.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOurHumo.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOurHumo.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOurHumo.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOurHumo.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOurHumo.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                    </v-expansion-panel-content>                                
                                    <v-expansion-panel-content class="panel">
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOther.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionPurchaseOther.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOther.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOther.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOther.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOther.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOther.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOther.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOtherUzcard.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionPurchaseOtherUzcard.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOtherUzcard.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOtherUzcard.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOtherUzcard.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOtherUzcard.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOtherUzcard.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOtherUzcard.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseOtherHumo.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionPurchaseOtherHumo.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseOtherHumo.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseOtherHumo.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOtherHumo.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOtherHumo.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseOtherHumo.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseOtherHumo.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                    </v-expansion-panel-content>                            
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                            
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseWallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionPurchaseWallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseWallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseWallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseWallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseWallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseWallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseWallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                           
                                    <v-expansion-panel-content class="panel">
                                        <template v-slot:header >                            
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionPurchaseAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionPurchaseAccount.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionPurchaseAccount.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionPurchaseAccount.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseAccount.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseAccount.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionPurchaseAccount.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionPurchaseAccount.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>                           
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{conversionData.ConversionSale.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{conversionData.ConversionSale.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{conversionData.ConversionSale.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{conversionData.ConversionSale.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSale.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{conversionData.ConversionSale.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{conversionData.ConversionSale.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSale.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionSaleOur.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionSaleOur.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionSaleOur.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOur.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOur.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOur.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOur.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOur.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionSaleOurUzcard.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionSaleOurUzcard.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionSaleOurUzcard.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOurUzcard.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOurUzcard.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOurUzcard.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOurUzcard.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOurUzcard.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionSaleOurHumo.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionSaleOurHumo.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionSaleOurHumo.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOurHumo.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOurHumo.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOurHumo.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOurHumo.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOurHumo.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                    </v-expansion-panel-content>                                
                                    <v-expansion-panel-content class="panel">
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionSaleOther.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionSaleOther.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionSaleOther.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOther.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOther.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOther.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOther.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOther.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionSaleOtherUzcard.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionSaleOtherUzcard.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionSaleOtherUzcard.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOtherUzcard.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOtherUzcard.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOtherUzcard.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOtherUzcard.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOtherUzcard.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{conversionData.ConversionSaleOtherHumo.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{conversionData.ConversionSaleOtherHumo.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{conversionData.ConversionSaleOtherHumo.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{conversionData.ConversionSaleOtherHumo.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOtherHumo.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOtherHumo.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{conversionData.ConversionSaleOtherHumo.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleOtherHumo.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                    </v-expansion-panel-content>                            
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                            
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionSaleVisa2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionSaleVisa2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleVisa2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleVisa2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                           
                                    <v-expansion-panel-content class="panel">
                                        <template v-slot:header >                            
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{conversionData.ConversionSaleVisa2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{conversionData.ConversionSaleVisa2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleVisa2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{conversionData.ConversionSaleVisa2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>     
                            </v-expansion-panel-content>
                            
                        </v-expansion-panel>
                    </div>
                </div>
            </div>
            <div class="deposit-box" v-if="crossData.USD">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left" style="border: 0">Кросс конвертация</p>
                </div>
                <div class="open-deposit select-deposit">
                    <table border="1" width="100%" bordercolor="silver"> 
                        <tr>
                            <!-- <td>Продажа\Покупка</td> -->
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_usa.png" alt="usa"> <p class="flag-text">USD</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_eur.png" alt="eur"> <p class="flag-text">EUR</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_rub.png" alt="rub"> <p class="flag-text">RUB</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_kzt.png" alt="kzt"> <p class="flag-text">KZT</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_chf.png" alt="chf"> <p class="flag-text">CHF</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_cny.png" alt="cny"> <p class="flag-text">CNY</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_gbp.png" alt="gbp"> <p class="flag-text">GBP</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_jpy.png" alt="jpy"> <p class="flag-text">JPY</p></span></td>
                            <td><span class="cur-item"><img class="flag" src="@/assets/flag_krw.png" alt="krw"> <p class="flag-text">KRW</p></span></td>
                        </tr>
                        <!-- <tr v-for="(item, senderCurrency ,index) in crossData" :key="index">                            
                            <td v-for="(child, receiverCurrency ,i) in sender" :key="i">
                                <span class="item">
                                    <p>{{child.Sender / 100 | number-format}} {{senderCurrency}} &#8594; {{child.Receiver / 100 | number-format}} {{receiverCurrency}}</p> 
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{child.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                        </tr> -->
                        <tr>
                            <!-- <td>USD</td> -->
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.EUR.Sender / 100 | number-format}} USD</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.EUR.Receiver / 100 | number-format}} EUR</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{crossData.USD.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.RUB.Sender / 100 | number-format}} USD</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.RUB.Receiver / 100 | number-format}} RUB</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{crossData.USD.RUB.Fee / 100 | number-format}} сум)</p>
                                    
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.KZT.Sender / 100 | number-format}} USD</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.KZT.Receiver / 100 | number-format}} KZT</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{crossData.USD.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.CHF.Sender / 100 | number-format}} USD</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.CHF.Receiver / 100 | number-format}} CHF</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{crossData.USD.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.CNY.Sender / 100 | number-format}} USD </p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.CNY.Receiver / 100 | number-format}} CNY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>
                                    <p class="commission-value">({{crossData.USD.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.GBP.Sender / 100 | number-format}} USD</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.GBP.Receiver / 100 | number-format}} GBP</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.USD.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.JPY.Sender / 100 | number-format}} USD</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.JPY.Receiver / 100 | number-format}} JPY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.USD.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.USD.KRW.Sender / 100 | number-format}} USD </p>  
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.USD.KRW.Receiver / 100 | number-format}} KRW</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.USD.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>            
                        </tr>
                        <tr>
                            <!-- <td>EUR</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.USD.Sender / 100 | number-format}} EUR</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.USD.Receiver / 100 | number-format}} USD</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.USD.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.RUB.Sender / 100 | number-format}} EUR</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.RUB.Receiver / 100 | number-format}} RUB</p>                            
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.KZT.Sender / 100 | number-format}} EUR</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.KZT.Receiver / 100 | number-format}} KZT</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.CHF.Sender / 100 | number-format}} EUR</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.CHF.Receiver / 100 | number-format}} CHF</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.CNY.Sender / 100 | number-format}} EUR</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.CNY.Receiver / 100 | number-format}} CNY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.GBP.Sender / 100 | number-format}} EUR</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.GBP.Receiver / 100 | number-format}} GBP</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.JPY.Sender / 100 | number-format}} EUR </p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.JPY.Receiver / 100 | number-format}} JPY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.EUR.KRW.Sender / 100 | number-format}} EUR</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.EUR.KRW.Receiver / 100 | number-format}} KRW</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.EUR.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>
                            </td>
                        </tr>   
                        <tr>
                            <!-- <td>RUB</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.USD.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.USD.Receiver / 100 | number-format}} USD</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.EUR.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.EUR.Receiver / 100 | number-format}} EUR</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.KZT.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.KZT.Receiver / 100 | number-format}} KZT</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.CHF.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.CHF.Receiver / 100 | number-format}} CHF</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.CNY.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.CNY.Receiver / 100 | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.GBP.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.GBP.Receiver / 100 | number-format}} GBP</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.JPY.Sender / 100 | number-format}} RUB</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.JPY.Receiver / 100 | number-format}} JPY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.RUB.KRW.Sender / 100 | number-format}} RUB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.RUB.KRW.Receiver / 100 | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.RUB.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr>   
                        <tr>
                            <!-- <td>KZT</td>     -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.USD.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.USD.Receiver / 100 | number-format}} USD</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.EUR.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.EUR.Receiver / 100 | number-format}} EUR</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.RUB.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.RUB.Receiver / 100 | number-format}} RUB</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.CHF.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.CHF.Receiver / 100 | number-format}} CHF</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.CNY.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.CNY.Receiver / 100 | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.GBP.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.GBP.Receiver / 100 | number-format}} GBP</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.JPY.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.JPY.Receiver / 100 | number-format}} JPY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KZT.KRW.Sender / 100 | number-format}} KZT</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KZT.KRW.Receiver / 100 | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.KZT.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr> 
                        <tr>
                            <!-- <td>CHF</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.USD.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.USD.Receiver / 100 | number-format}} USD</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.CHF.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.EUR.Sender / 100 | number-format}} CHF</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.EUR.Receiver / 100 | number-format}} EUR</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.CHF.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.RUB.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.RUB.Receiver / 100 | number-format}} RUB</p>                                         
                                    </span>
                                    <p class="commission">Комиссия:</p>                                    
                                    <p class="commission-value">({{crossData.CHF.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.KZT.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.KZT.Receiver / 100 | number-format}} KZT</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CHF.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.CNY.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.CNY.Receiver / 100 | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CHF.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.GBP.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.GBP.Receiver / 100 | number-format}} GBP</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CHF.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.JPY.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.JPY.Receiver / 100 | number-format}} JPY</p> 
                                    </span>                                
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CHF.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CHF.KRW.Sender / 100 | number-format}} CHF</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CHF.KRW.Receiver / 100 | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CHF.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr>   
                        <tr>
                            <!-- <td>CNY</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.USD.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.USD.Receiver / 100 | number-format}} USD</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.EUR.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.EUR.Receiver / 100 | number-format}} EUR</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.RUB.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.RUB.Receiver / 100 | number-format}} RUB</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.KZT.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.KZT.Receiver / 100 | number-format}} KZT</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.CHF.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.CHF.Receiver / 100 | number-format}} CHF</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.GBP.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.GBP.Receiver / 100 | number-format}} GBP</p> 
                                    </span>                                    
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.JPY.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.JPY.Receiver / 100 | number-format}} JPY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.CNY.KRW.Sender / 100 | number-format}} CNY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.CNY.KRW.Receiver / 100 | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.CNY.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr>  
                        <tr>
                            <!-- <td>GPB</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.USD.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.USD.Receiver / 100 | number-format}} USD</p>                                     
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.EUR.Sender / 100 | number-format}} GPB</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.EUR.Receiver / 100 | number-format}} EUR</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.RUB.Sender / 100 | number-format}} GPB</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.RUB.Receiver / 100 | number-format}} RUB</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.KZT.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.KZT.Receiver / 100 | number-format}} KZT</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.CHF.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.CHF.Receiver / 100 | number-format}} CHF</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.CNY.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.CNY.Receiver / 100 | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.JPY.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.JPY.Receiver / 100 | number-format}} JPY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.GBP.KRW.Sender / 100 | number-format}} GPB</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.GBP.KRW.Receiver / 100 | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.GBP.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr>
                        <tr>
                            <!-- <td>JPY</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.USD.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.USD.Receiver | number-format}} USD</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.EUR.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.EUR.Receiver | number-format}} EUR</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.RUB.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.RUB.Receiver | number-format}} RUB</p> 
                                    </span>                                    
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.KZT.Sender | number-format}} JPY</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.KZT.Receiver | number-format}} KZT</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.CHF.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.CHF.Receiver | number-format}} CHF</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.CNY.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.CNY.Receiver | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.GBP.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.GBP.Receiver | number-format}} GBP</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.JPY.KRW.Sender | number-format}} JPY</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.JPY.KRW.Receiver | number-format}} KRW</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.JPY.KRW.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                        </tr>
                        <tr>
                            <!-- <td>KRW</td> -->
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.USD.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.USD.Receiver / 100 | number-format}} USD</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.USD.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.EUR.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.EUR.Receiver / 100 | number-format}} EUR</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.EUR.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.RUB.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.RUB.Receiver / 100 | number-format}} RUB</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.RUB.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.KZT.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.KZT.Receiver / 100 | number-format}} KZT</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.KZT.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.CHF.Sender / 100 | number-format}} KRW</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.CHF.Receiver / 100 | number-format}} CHF</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.CHF.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.CNY.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.CNY.Receiver / 100 | number-format}} CNY</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.CNY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.GBP.Sender / 100 | number-format}} KRW</p> 
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.GBP.Receiver / 100 | number-format}} GBP</p> 
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.GBP.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td>
                                <span class="item">
                                    <span class="currency-value">
                                        <p>{{crossData.KRW.JPY.Sender / 100 | number-format}} KRW</p>
                                        <p><v-icon>expand_more</v-icon></p>
                                        <p>{{crossData.KRW.JPY.Receiver / 100 | number-format}} JPY</p>
                                    </span>
                                    <p class="commission">Комиссия:</p>                                                                    
                                    <p class="commission-value">({{crossData.KRW.JPY.Fee / 100 | number-format}} сум)</p>
                                </span>                                
                            </td>
                            <td class="empty"></td>
                        </tr>
                    </table>
                </div>

            </div>
            <div class="deposit-box" v-if="transferData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Переводы</p>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Сумма</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Комиссия</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>      
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Количество операций</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                            <p class="deposit-sum border-none">Итого</p>
                        </div>
                    </div> 
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>                     
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferApelsin.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferApelsin.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferApelsin.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferApelsin.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsin.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferApelsin.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferApelsin.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsin.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinUzcard2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinUzcard2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinUzcard2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinUzcard2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Humo.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinHumo2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinHumo2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinHumo2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Humo.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinHumo2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinHumo2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinHumo2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinVisa2Visa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinVisa2Visa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinVisa2Visa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinVisa2Visa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Visa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinVisa2Visa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinVisa2Visa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Visa.operations | number-format}}</p>
                                                </div>
                                            </div>  
                                        </template>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferKapital.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferKapital.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferKapital.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferKapital.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferKapital.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferKapital.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferKapital.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferKapital.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferKapitalUzcard2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferKapitalUzcard2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferKapitalUzcard2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferKapitalUzcard2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalUzcard2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalUzcard2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferKapitalUzcard2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferKapitalUzcard2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferKapitalUzcard2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferKapitalUzcard2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalUzcard2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalUzcard2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Humo.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferKapitalHumo2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferKapitalHumo2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferKapitalHumo2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferKapitalHumo2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalHumo2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalHumo2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Humo.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                                
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferKapitalHumo2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferKapitalHumo2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferKapitalHumo2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferKapitalHumo2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalHumo2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalHumo2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                                     
                                    </v-expansion-panel-content>                             
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                            
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferKapitalVisa2Visa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferKapitalVisa2Visa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferKapitalVisa2Visa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferKapitalVisa2Visa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalVisa2Visa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalVisa2Visa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferKapitalVisa2Visa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalVisa2Visa.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                                                              
                                </v-expansion-panel>     
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferOnWallet.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferOnWallet.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferOnWallet.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferOnWallet.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWallet.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferOnWallet.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferOnWallet.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWallet.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>                                      
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnWalletUzcard2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnWalletUzcard2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnWalletUzcard2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnWalletUzcard2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletUzcard2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletUzcard2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletUzcard2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletUzcard2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>    
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnWalletHumo2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnWalletHumo2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnWalletHumo2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnWalletHumo2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletHumo2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletHumo2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletHumo2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletHumo2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnWalletVisa2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnWalletVisa2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnWalletVisa2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnWalletVisa2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletVisa2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletVisa2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletVisa2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletVisa2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content> 
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnWalletAccount2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnWalletAccount2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnWalletAccount2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnWalletAccount2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletAccount2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletAccount2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletAccount2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletAccount2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>   
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnWalletWallet2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnWalletWallet2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnWalletWallet2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnWalletWallet2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletWallet2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletWallet2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnWalletWallet2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletWallet2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>            
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferFromWallet.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferFromWallet.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferFromWallet.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferFromWallet.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWallet.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferFromWallet.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferFromWallet.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWallet.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromWalletWallet2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromWalletWallet2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromWalletWallet2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromWalletWallet2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Humo.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Visa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Visa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromWalletWallet2Visa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromWalletWallet2Visa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Visa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Visa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Visa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Visa.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                                
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromWalletWallet2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromWalletWallet2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromWalletWallet2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                                     
                                    </v-expansion-panel-content>                                                                                                        
                                </v-expansion-panel>     
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferOnAccount.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferOnAccount.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferOnAccount.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferOnAccount.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccount.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferOnAccount.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferOnAccount.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccount.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>                                      
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnAccountUzcard2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnAccountUzcard2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnAccountUzcard2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnAccountUzcard2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountUzcard2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountUzcard2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountUzcard2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountUzcard2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>    
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnAccountHumo2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnAccountHumo2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnAccountHumo2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnAccountHumo2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountHumo2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountHumo2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountHumo2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountHumo2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnAccountVisa2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnAccountVisa2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnAccountVisa2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnAccountVisa2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountVisa2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountVisa2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountVisa2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountVisa2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content> 
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnAccountWallet2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnAccountWallet2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnAccountWallet2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnAccountWallet2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountWallet2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountWallet2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountWallet2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountWallet2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>   
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferOnAccountAccount2Account.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferOnAccountAccount2Account.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferOnAccountAccount2Account.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferOnAccountAccount2Account.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountAccount2Account.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountAccount2Account.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferOnAccountAccount2Account.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountAccount2Account.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>            
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferFromAccount.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferFromAccount.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferFromAccount.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferFromAccount.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccount.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferFromAccount.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferFromAccount.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccount.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Uzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Uzcard.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromAccountAccount2Uzcard.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromAccountAccount2Uzcard.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Uzcard.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Uzcard.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Uzcard.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Uzcard.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Humo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Humo.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromAccountAccount2Humo.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromAccountAccount2Humo.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Humo.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Humo.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Humo.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Humo.operations | number-format}}</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header >                                    
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Visa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Visa.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromAccountAccount2Visa.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromAccountAccount2Visa.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Visa.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Visa.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Visa.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Visa.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                                
                                    <v-expansion-panel-content>
                                        <template v-slot:header >
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Wallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Wallet.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferFromAccountAccount2Wallet.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferFromAccountAccount2Wallet.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Wallet.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Wallet.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferFromAccountAccount2Wallet.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Wallet.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                                     
                                    </v-expansion-panel-content>                                                                                                                                        
                                </v-expansion-panel>     
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferRepayment.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferRepayment.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferRepayment.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferRepayment.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferRepayment.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferRepayment.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferRepayment.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferRepayment.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>                                      
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferLoanRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferLoanRepayment.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferLoanRepayment.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferLoanRepayment.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepayment.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferLoanRepayment.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferLoanRepayment.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepayment.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                        
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentUzcard2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentUzcard2Loan.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanRepaymentUzcard2Loan.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanRepaymentUzcard2Loan.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.operations | number-format}}</p>
                                            </div>
                                        </div>       
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentHumo2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentHumo2Loan.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanRepaymentHumo2Loan.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanRepaymentHumo2Loan.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.operations | number-format}}</p>
                                            </div>
                                        </div>  
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentAccount2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentAccount2Loan.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanRepaymentAccount2Loan.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanRepaymentAccount2Loan.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentWallet2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentWallet2Loan.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanRepaymentWallet2Loan.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanRepaymentWallet2Loan.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.operations | number-format}}</p>
                                            </div>
                                        </div>                                            
                                    </v-expansion-panel-content>    
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferLoanPrematureRepayment.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferLoanPrematureRepayment.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferLoanPrematureRepayment.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepayment.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepayment.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepayment.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepayment.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                        
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.operations | number-format}}</p>
                                            </div>
                                        </div>       
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.operations | number-format}}</p>
                                            </div>
                                        </div>  
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.operations | number-format}}</p>
                                            </div>
                                        </div>                                            
                                    </v-expansion-panel-content>    
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinRepayment.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferApelsinRepayment.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferApelsinRepayment.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinRepayment.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinRepayment.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferApelsinRepayment.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinRepayment.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>                        
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Repayment.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferApelsinUzcard2Repayment.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferApelsinUzcard2Repayment.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Repayment.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Repayment.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinUzcard2Repayment.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Repayment.operations | number-format}}</p>
                                            </div>
                                        </div>       
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinHumo2Repayment.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferApelsinHumo2Repayment.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferApelsinHumo2Repayment.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Repayment.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Repayment.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinHumo2Repayment.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Repayment.operations | number-format}}</p>
                                            </div>
                                        </div>  
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinVisa2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinVisa2Repayment.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferApelsinVisa2Repayment.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferApelsinVisa2Repayment.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Repayment.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinVisa2Repayment.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinVisa2Repayment.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Repayment.operations | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinAccount2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinAccount2Repayment.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferApelsinAccount2Repayment.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferApelsinAccount2Repayment.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinAccount2Repayment.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinAccount2Repayment.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinAccount2Repayment.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinAccount2Repayment.operations | number-format}}</p>
                                            </div>
                                        </div>       
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinWallet2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinWallet2Repayment.amountUzs | number-format}}</p>
                                                <p class="deposit-sum border-none">{{transferData.TransferApelsinWallet2Repayment.amountUsd | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none ">{{transferData.TransferApelsinWallet2Repayment.commission | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinWallet2Repayment.fee | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinWallet2Repayment.operUzs | number-format}}</p>
                                                <p class="deposit-sum right-padding">{{transferData.TransferApelsinWallet2Repayment.operUsd | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinWallet2Repayment.operations | number-format}}</p>
                                            </div>
                                        </div>                                              
                                    </v-expansion-panel-content>  
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{transferData.TransferRequisite.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferRequisite.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferRequisite.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{transferData.TransferRequisite.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferRequisite.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{transferData.TransferRequisite.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{transferData.TransferRequisite.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{transferData.TransferRequisite.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>                                      
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferUzcard2Requisite.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferUzcard2Requisite.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferUzcard2Requisite.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferUzcard2Requisite.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferUzcard2Requisite.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferUzcard2Requisite.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferUzcard2Requisite.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferUzcard2Requisite.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>    
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferHumo2Requisite.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferHumo2Requisite.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferHumo2Requisite.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferHumo2Requisite.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferHumo2Requisite.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferHumo2Requisite.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferHumo2Requisite.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferHumo2Requisite.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>                
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferWallet2Requisite.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferWallet2Requisite.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferWallet2Requisite.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferWallet2Requisite.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferWallet2Requisite.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferWallet2Requisite.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferWallet2Requisite.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferWallet2Requisite.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content> 
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">{{transferData.TransferAccount2Requisite.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferAccount2Requisite.amountUzs | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{transferData.TransferAccount2Requisite.amountUsd | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{transferData.TransferAccount2Requisite.commission | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferAccount2Requisite.fee | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">{{transferData.TransferAccount2Requisite.operUzs | number-format}}</p>
                                                    <p class="deposit-sum right-padding">{{transferData.TransferAccount2Requisite.operUsd | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferAccount2Requisite.operations | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>           
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">Между картами в Beepul</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{beelineTotalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{beelineTotalCommission / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">UZCARD 2 UZCARD</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{beelineCount.uzcard2uzcard / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{beelineCount.uzcard2uzcardCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">UZCARD 2 HUMO</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{beelineCount.uzcard2humo / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{beelineCount.uzcard2humoCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">HUMO 2 HUMO</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{beelineCount.humo2humo / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{beelineCount.humo2humoCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">HUMO 2 UZCARD</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{beelineCount.humo2uzcard / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{beelineCount.humo2uzcardCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>                                    
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">Между картами в U'tolov (Ucell)</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ucellTotalAmountUtolov / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{ucellTotalCommissionUtolov / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>
                                    </div>
                                </template>     
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">UZCARD 2 UZCARD</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{ucellCount.uzcard2uzcard / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{ucellCount.uzcard2uzcardCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">UZCARD 2 HUMO</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{ucellCount.uzcard2humo / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{ucellCount.uzcard2humoCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">HUMO 2 HUMO</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{ucellCount.humo2humo / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{ucellCount.humo2humoCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none margin-24">
                                                <p class="deposit-box-header-left">HUMO 2 UZCARD</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{ucellCount.humo2uzcard / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none ">{{ucellCount.humo2uzcardCommission / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum right-padding">0</p>
                                                    <p class="deposit-sum border-none right-padding">0</p>
                                                </div>
                                            </div> 
                                        </template>
                                    </v-expansion-panel-content>                                    
                                </v-expansion-panel>                                   
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{visaDirectData.visaDirect.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">0</p>
                                            <p class="deposit-sum border-none">{{visaDirectData.visaDirect.amount | number-format}} {{visaDirectData.currency}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{visaDirectData.visaDirect.fee | number-format}} {{visaDirectData.visaDirect.feeCurrency}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">{{visaDirectData.visaDirect.operations | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{visaDirectData.visaDirect.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                            </v-expansion-panel-content>
                        </v-expansion-panel>                            
                    </div>
                </div>
            </div>
            <div class="deposit-box" v-if="paymentsData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Прием платежей</p>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Сумма</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Комиссия</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                    <div class="deposit-box-header-right border-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>      
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Количество операций</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                            <p class="deposit-sum border-none">Итого</p>
                        </div>
                    </div>       
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>
                            <v-expansion-panel-content>                                
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{paymentsData.SupplierApelsin.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{paymentsData.SupplierApelsin.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{paymentsData.SupplierApelsin.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsin.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsin.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsin.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsin.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsin.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinUzcard2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinUzcard2Service.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{paymentsData.SupplierApelsinUzcard2Service.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsinUzcard2Service.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinUzcard2Service.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinUzcard2Service.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinUzcard2Service.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinUzcard2Service.operations | number-format}}</p>
                                    </div>                                             
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinHumo2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinHumo2Service.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{paymentsData.SupplierApelsinHumo2Service.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsinHumo2Service.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinHumo2Service.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinHumo2Service.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinHumo2Service.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinHumo2Service.operations | number-format}}</p>
                                    </div>                                             
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinVisa2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinVisa2Service.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{paymentsData.SupplierApelsinVisa2Service.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsinVisa2Service.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinVisa2Service.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinVisa2Service.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinVisa2Service.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinVisa2Service.operations | number-format}}</p>
                                    </div>                                             
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinAccount2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinAccount2Service.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{paymentsData.SupplierApelsinAccount2Service.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsinAccount2Service.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinAccount2Service.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinAccount2Service.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinAccount2Service.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinAccount2Service.operations | number-format}}</p>
                                    </div>                                             
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinWallet2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinWallet2Service.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{paymentsData.SupplierApelsinWallet2Service.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{paymentsData.SupplierApelsinWallet2Service.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinWallet2Service.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinWallet2Service.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{paymentsData.SupplierApelsinWallet2Service.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinWallet2Service.operations | number-format}}</p>
                                    </div>                                             
                                </div>                            
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>                                
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">{{paymentsCategoriesData.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{paymentsCategoriesData.amountUzs | number-format}}</p>
                                            <p class="deposit-sum border-none">{{paymentsCategoriesData.amountUsd | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">{{paymentsCategoriesData.commission | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{paymentsCategoriesData.fee | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">{{paymentsCategoriesData.operUzs | number-format}}</p>
                                            <p class="deposit-sum right-padding">{{paymentsCategoriesData.operUsd | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">{{paymentsCategoriesData.operations | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel" v-for="(item, index) in paymentsCategoriesData.totalByMerchants" :key="index">
                                    <div class="deposit-box-header-left" style="justify-content: flex-start;">
                                        <img :src="item.url" style="margin-left: 35px; margin-right: 5px; width: 25px;" />
                                        <p >{{item.service}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{item.amountUzs | number-format}}</p>
                                        <p class="deposit-sum border-none">{{item.amountUsd | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none ">{{item.commission | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{item.fee | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">{{item.operUzs | number-format}}</p>
                                        <p class="deposit-sum right-padding">{{item.operUsd | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{item.operations | number-format}}</p>
                                    </div>  
                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">За E-commerce</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ecommerceData.totalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">{{ecommerceData.totalFee / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>     
                                    </div>
                                </template>
                                <template v-if="ecommerceData">
                                    <div class="child child-open-deposit select-deposit child-panel" v-for="(item, i) in ecommerceData.cashes" :key="i">
                                        <p class="deposit-box-header-left">{{item.name}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{item.amount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none right-padding">{{item.fee / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>     
                                    </div>
                                </template>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">За Ucell</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ucellTotalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">{{ucellTotalCommission / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>     
                                    </div>
                                </template>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">USSD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{ucellCount.ussdAmount / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{ucellCount.ussdCommission / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>     
                                </div>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">Сайт</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{ucellCount.siteAmount / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">{{ucellCount.siteCommission / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>     
                                </div>                     
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">За поставщиков Ucell</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ucellCount.providersAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">{{ucellCount.providersCommission / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>     
                                    </div>
                                </template>                                                                                       
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none margin-24">
                                        <p class="deposit-box-header-left">За Beeline</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{beelineCount.ussdAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">{{beelineCount.ussdCommission / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum right-padding">0</p>
                                            <p class="deposit-sum border-none right-padding">0</p>
                                        </div>     
                                    </div>
                                </template>   
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">UZCARD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.ussdUzcard / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div> 
                                </div>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">HUMO</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.ussdHumo / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum border-none">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum right-padding">0</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div> 
                                </div>                                                  
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </div>
                </div>

            </div>
            <div class="deposit-box" v-if="regUserData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Клиенты</p>
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Количество</p>
                    </div>
                </div>
                <div class="child open-deposit select-deposit" style="border-bottom: 0;" v-if="regUserData">
                    <p class="deposit-box-header-left">В Apelsin</p>
                    <div class="deposit-box-header-right-bottom">
                        <p class="deposit-sum" style="border: 0;">{{regUserData.userCount}}</p>                        
                    </div>
                </div>                
                <div class="child open-deposit select-deposit panel">
                    <p class="deposit-box-header-left">Телеграм бот</p>
                    <div class="deposit-box-header-right-bottom">
                        <p class="deposit-sum" style="border: 0;">{{telegramUserCount}}</p>                        
                    </div>
                </div>
            </div>     
        </div>
        
    </div>
</template>
<script>
import { Base64 } from 'js-base64';

export default {
    name: 'newPivotTable',
    data(){
        return{
            active: '',
            tmp :'',
            fromDate: '',
            toDate: '',
            depositData: [],
            transferData: [],
            conversionData: [],
            crossData: {},
            regUserData: [],
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            isSelect: false,
            isDate: false,
            isActive: '',
            isShow: false,
            paymentsData: [],
            selectedItem: 'apelsin',
            telegramUserCount: '',
            ecommerceData: '',
            ucellCount: '',
            beelineCount: '',
            corAccData: [],
            apelsinCorAccData: [],
            platformData: [],
            newDepositData: [],
            visaDirectData: {},
            isActivePlatform: 'TOTAL',
            platform: '',
            crossData: {},
            paymentsCategoriesData: {},
        }
    },
    watch:{
        date1(){
            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
        },
        date2(){
            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            this.toDate = endTime.getTime();
        },
        // isActivePlatform(val){
        //     this.getDataApelsin();
        // }
    },
    computed:{
        ucellTotalAmount(){
            return this.ucellCount.ussdAmount + this.ucellCount.siteAmount;
        },
        ucellTotalCommission(){
            return this.ucellCount.ussdCommission + this.ucellCount.siteCommission;
        },
        beelineTotalAmount(){
            return this.beelineCount.uzcard2humo + this.beelineCount.uzcard2uzcard + this.beelineCount.humo2uzcard + this.beelineCount.humo2humo 
        },
        beelineTotalCommission(){
            return this.beelineCount.uzcard2humoCommission + this.beelineCount.uzcard2uzcardCommission + this.beelineCount.humo2uzcardCommission + this.beelineCount.humo2humoCommission 
        },
        ucellTotalAmountUtolov(){
            return this.ucellCount.uzcard2humo + this.ucellCount.uzcard2uzcard + this.ucellCount.humo2uzcard + this.ucellCount.humo2humo 

        },
        ucellTotalCommissionUtolov(){
            return this.ucellCount.uzcard2humoCommission + this.ucellCount.uzcard2uzcardCommission + this.ucellCount.humo2uzcardCommission + this.ucellCount.humo2humoCommission 

        }
    },
    methods:{
        getCorAcc(){
            this.$http.post(this.$store.state.prodApiUrl2+'/report/corAcc', {"branch":"01158", "currency":"000"})
            .then(response=>{
                // console.log(response.data);
                this.corAccData = response.data.data;
            }, this.handleError)
        },
        getApelsinCorAcc(){
            this.$http.post(this.$store.state.prodApiUrl2+'/report/corAcc', {"branch":"01184", "currency":"000"})
            .then(response=>{
                // console.log(response.data);
                this.apelsinCorAccData = response.data.data;
            }, this.handleError)
        },
        change(val){
            this.selectedItem = val;
            if(this.selectedItem==='apelsin'){
                if(this.fromDate){
                    this.getData();
                }
                else{
                    this.getAllData();
                }
            }
            else if(this.selectedItem==='telegramBot'){
                if(this.fromDate){
                    this.getTelegramCount();
                }
                else{
                    this.getAllTelegramCount();
                }
            }
        },
        clickPanel(val){
            this.isActive=val;  
            if(val==='openDepositSummery'&&this.isShow){
                this.isActive = '';
                this.isShow = true
            }
            else if(val==='increaseDepositSummery'&&this.isShow){
                this.isActive = '';
                this.isShow = true
            }
            else{
                this.isShow = false;
            }
        },
        getEcommerceData(){
            let self = this;
            self.ecommerceData = '';
            let getData = {
                "fromDate": this.fromDate,
                "toDate": this.toDate,
            }
            self.$http.get(this.$store.state.ecommerceUrl + '/v1/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic YXBlbHNpbi1lYzpjZm4tfm44J0JFMmMtQDlwcjR7Rg==',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    console.log(response.data)
                    self.ecommerceData = response.data.data;
                    console.log('-----')
                    console.log(self.ecommerceData)
                    console.log('-----')

                }            
            })
        },
        getAllEcommerceData(){
            let self = this;
            self.ecommerceData = '';
            let getData = {
                "fromDate": "",
                "toDate": "",
            }
            self.$http.get(this.$store.state.ecommerceUrl + '/v1/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic YXBlbHNpbi1lYzpjZm4tfm44J0JFMmMtQDlwcjR7Rg==',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    self.ecommerceData = response.data.data;
                    console.log('################')
                    console.log(self.ecommerceData)
                    console.log('################')
                    
                }            
            })
        },
        getPaymentsCategories(){
            let postData = {
                "dateFrom": this.fromDate,
                "dateTo": this.toDate,
                "platform": this.isActivePlatform
            }
            if(this.fromDate===''&&this.toDate===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            this.$http.post(this.$store.state.newApiUrl + '/v2/report/summery/payments-categories',postData)
            .then(response=>{      
                // console.log(response.data)          
                if(response.status === 200){
                    // self.userCount = response.data;
                    // console.log(response.data)
                    this.paymentsCategoriesData = response.data.data;
                    this.paymentsCategoriesData.totalByMerchants.forEach(x=>{
                        console.log(x)
                        let elem = JSON.parse(x.title)
                        x.url = elem.url;
                        x.service = elem.service
                        // console.log(x)

                    })
                }            
            })
        },
        getAllPaymentsCategories(){
            let postData = {
                "platform": this.isActivePlatform
            }
            this.$http.post(this.$store.state.newApiUrl + '/v2/report/summery/payments-categories',postData)
            .then(response=>{      
                // console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    // console.log(response.data)
                    this.paymentsCategoriesData = response.data.data;

                }            
            })
        },
        getUcellCount(){
            let self = this;
            self.ucellCount = '';
            let getData = {
                "fromDate": this.fromDate,
                "toDate": this.toDate,
            }
            self.$http.get(this.$store.state.ucellUrl + '/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic dWNlbGwta2FwaXRhbDo1WD8nJWRWezdEcyNAdnBW',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    console.log(response.data)
                    self.ucellCount = response.data.data;
                    console.log('-----')
                    console.log(self.ucellCount)
                    console.log('-----')
                }            
            })
        },
        getAllUcellCount(){
            let self = this;
            self.ucellCount = '';
            let getData = {
                "fromDate":  '',
                "toDate": '',
            }
            self.$http.get(this.$store.state.ucellUrl + '/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic dWNlbGwta2FwaXRhbDo1WD8nJWRWezdEcyNAdnBW',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    console.log(response.data)
                    self.ucellCount = response.data.data;
                    console.log('-----')
                    console.log(self.ucellCount)
                    console.log('-----')
                }            
            })
        },
        getAllBeelineCount(){
            let self = this;
            self.beelineCount = '';
            let getData = {
                "fromDate":  '',
                "toDate": '',
            }
            self.$http.get(this.$store.state.beelineUrl + '/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic YmVlbGluZS1rYXBpdGFsOmNXQTM4JUpALFllR2U9VDY=',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    console.log(response.data)
                    self.beelineCount = response.data.data;
                }            
            })
        },
        getBeelineCount(){
            let self = this;
            self.beelineCount = '';
            let getData = {
                "fromDate": this.fromDate,
                "toDate": this.toDate,
            }
            self.$http.get(this.$store.state.beelineUrl + '/apelsin/totalAmount',{
                params: getData,
                headers:{
                    Authorization: 'Basic YmVlbGluZS1rYXBpdGFsOmNXQTM4JUpALFllR2U9VDY=',
                }
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;

                    self.beelineCount = response.data.data;

                }            
            })
        },
        getTelegramCount(){
            let self = this;
            self.telegramUserCount = '';
            let getData = {
                "from": this.fromDate,
                "to": this.toDate,
            }
            self.$http.get(this.$store.state.telegramBotUrl + '/user/count',{
                params: getData
            })
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    // self.userCount = response.data;
                    self.telegramUserCount = response.data;
                }            
            })
        },
        getAllTelegramCount(){
            let self = this;
            self.telegramUserCount = '';
            self.$http.get(this.$store.state.telegramBotUrl + '/user/count')
            .then(response=>{      
                console.log(response.data)          
                if(response.status ===200){
                    self.telegramUserCount = response.data;
                }            
            })
        },
        getAll(){
            this.active = 'btn5';
            // this.getAllApelsin();         
            // this.getAllTelegramCount();
            // this.getAllEcommerceData();
            // this.getAllUcellCount();
            // this.getAllBeelineCount();

        
        },
        getData(){
            // this.getEcommerceData();
            if(this.active==='btn5'){
                this.getAllApelsin();         
                this.getAllBeelineCount();
                this.getAllTelegramCount();
                this.getAllUcellCount();
                this.getAllEcommerceData();
            }
            else{
                this.getDataApelsin();        
                this.getTelegramCount();
                this.getUcellCount();
                this.getBeelineCount();
                this.getEcommerceData();
            }
           
            
        },
        TwoDaysAgo(){
            this.active = 'btn7';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate() - 2);
            var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 23, 59,59);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            console.log(this.fromDate, ' - ', this.toDate);
            // this.getDataApelsin();        
            // this.getTelegramCount();
            // this.getEcommerceData();
            // this.getUcellCount();
            // this.getBeelineCount();


        
        },
        Yesterday(){
            this.active = 'btn1';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate() - 1);
            var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59,59);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            console.log(this.fromDate, ' - ', this.toDate);        
            // this.getDataApelsin();        
            // this.getTelegramCount();
            // this.getEcommerceData();
            // this.getUcellCount();
            // this.getBeelineCount();

            
        },
        Today(){
            this.isDate = true;
            this.isSelect = false;
            this.active = 'btn2';
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate());
            var endDay = new Date(date.getFullYear(), date.getMonth(),date.getDate(), 23, 59,59)
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();   
            // this.getDataApelsin();        
            // this.getTelegramCount();
            // this.getEcommerceData();
            // this.getUcellCount();
            // this.getBeelineCount();



        },
        LastMonth(){
            this.active = 'btn3';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            this.fromDate = firstDay.getTime();
            var endDay = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
            this.toDate = endDay.getTime();
            // this.getDataApelsin();        
            // this.getTelegramCount();
            // this.getEcommerceData();
            // this.getUcellCount();
            // this.getBeelineCount();


                        
        },
        Month(){
            this.active = 'btn4';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var endDay = new Date(date.getFullYear(), date.getMonth(),date.getDate(), 23, 59,59)

            this.fromDate = firstDay.getTime();
            this.toDate = endDay.getTime();

            // this.getDataApelsin();        
            // this.getTelegramCount();
            // this.getEcommerceData();
            // this.getUcellCount();
            // this.getBeelineCount();

        },
        getSettings(){
            this.active = 'btn6';
            this.isDate = false;
            this.isSelect = true;

            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
            this.toDate = endTime.getTime();
            console.log(this.date2, ' - ', this.date1)
        },        
        getDataApelsin(){
            let postData = {
                "dateFrom": this.fromDate,
                "dateTo": this.toDate,
                "platform": this.isActivePlatform
            }
            if(this.fromDate===''&&this.toDate===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            let self = this;
            self.depositData = [];
            self.transferData = [];
            self.conversionData = [];
            self.regUserData = [];
            self.paymentsData = [];
            self.crossData = {};
            self.visaDirectData = {};
            self.$http.post(self.$store.getters.newApiUrl2 + '/report/visa-direct/summery', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.visaDirectData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/deposit', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.depositData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/conversion', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.conversionData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/transfer', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.transferData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/user', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.regUserData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/payments', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.paymentsData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/cross', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.crossData = response.data.data;
                }
            }, self.handleError)
            this.getPaymentsCategories();
        },

        getAllApelsin(){
            
            this.depositData = [];
            this.transferData = [];
            this.conversionData = [];
            this.regUserData = [];
            this.crossData = {};

            this.fromDate = '';
            this.toDate = '';
            this.isDate = false;
            this.isSelect = false;
            let self = this;
            let postData = {
                "platform": this.isActivePlatform
            }
            self.visaDirectData = {};
            self.$http.post(self.$store.getters.newApiUrl2 + '/report/visa-direct/summery', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.visaDirectData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/deposit', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.depositData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/conversion', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.conversionData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/transfer', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.transferData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/user', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.regUserData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/payments', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.paymentsData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl2 + '/v2/report/summery/cross', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.crossData = response.data.data;
                }
            }, self.handleError)
            this.getAllPaymentsCategories();
        
        },
        getPlatform(){
            this.$http.get(this.$store.state.prodApiUrl2+`/app-version/platform`)
            .then(response=>{
                // console.log(response.data.data);
                this.platformData = response.data.data;                

            }, this.handleError)
        }
    },
    mounted(){
        this.getPlatform();
        this.Today(0);
        this.getCorAcc();
        this.getApelsinCorAcc();
    }
}
</script>

<style scoped>
    @media all and (max-width: 500px){
        .date-box{
            width: 310px !important;
            font-size: 14px !important;
        }
        .deposit-box{
            width: 685px !important;
            font-size: 11px;
        }
        .main{
            align-items: flex-start !important;
        }
        .select-date-box{
            width: 345px !important;
        }
        .cor-acc-xs{
            display: block !important;
        }
        .cor-acc{
            display: none !important;
        }

    }
    
    .cor-acc-xs{
        display:none;
        width: 100%;
        background: #FFFF;
        border-radius: 10px;
        padding: 10px;
    }
    .tc{
        text-align: center;
    }
    .kapital-logo{
        width: 145px;
        height: 15px;
        margin: 7px;
    }
    .apelsin-logo{
        height: 37px;
    }
    .cor-acc-top{
        display: flex;
        justify-content: space-between;
        width:100%;
        font-size: 19px;
    }
    .cor-acc-content{
        text-align: center;
        padding: 10px;
    }
    .cor-acc{
        display: flex;
        flex-direction: column;
        background: #FFFF;
        height: 115px;
        width: 590px;
        margin: 10px;
        padding: 8px;
        border-radius: 10px;
    }
    .cor-acc-top-text{
        color: #8F8F8F;
    }
    .content-box{
        width: 100%;
        height: 100%;
    }
    .select-box-image{
        width: 25px;
        height: 25px;
        margin: 0 5px;
        border-radius: 5px;
    }
    .select-type-btn{
        border-radius: 25px;
        width: 175px;
        /* height: 42px; */
    }
    .select-type-box{
        margin: 10px 0px 5px;
    }
    .select-date-box{
        background: #ffffff;
        padding: 10px;
        width: 415px;
        border-radius: 10px;
        margin: 25px 0px;
        display: flex;
        flex-direction: column;
    }
    .set-date{
        background-color: #fbc100 !important;
        color: #FFFF !important;
        border-radius: 8px;
        width: 200px;
        margin: 20px;
    }
    .select-date-box-child{
        display: flex;
    }
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .header-button {
        background: #4e4e4e !important;
        border-radius: 28px;
    }
    .active-btn {
        background: #fbc100 !important;
    }
    .active-select-btn{
        background:#f3d559 !important;
        color: #000 !important;
    }
    .date-text{
        margin: 0;
    }
    .date-box{
        display: flex;
        width: 380px;
        justify-content: space-between;
        font-size: 17px;
        margin: 18px 0 8px;
    }
    .deposit-box{
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .deposit-box-header{
        display: flex;
        color: #FFF;
        background: #4e4e4ee0;
        padding-right: 45px;

    }
    .child{
        padding: 12px 23px 0 0 !important;
    }
    .deposit-box-header-left{
        flex: 1 !important;
        text-align: center;
        /* margin: auto; */
        padding: 15px 0;
        border-right: 1px solid silver;
        display: flex;
        align-items: center;
        justify-content: center
    }
    .v-expansion-panel__header {
        padding: 12px 0 !important;
    }
    .margin-24{
        margin: 0px -5px 0 -24px;
    }
    .deposit-box-header-right{  
        flex:1;
    }
    .deposit-box-header-right-top{
        text-align: center;
        padding: 10px 0;
    }
    
    .deposit-box-header-right-bottom{
        display: flex;
        flex:1 !important;        
    }
    .border-right{
        border-right: 1px solid silver;
    }
    .select-panel{
        background: #f9ca03bd !important;
    }
    .panel{
        background: whitesmoke !important;
    }
    .child-panel{
        background: #FFFF !important;
    }
    .border-bt{
        border-bottom: 1px solid silver;
    }
    .child-open-deposit{
        display: flex;
    }
    .open-deposit{
        display: flex;
        /* padding: 15px 0; */
        border: 1px solid silver;
        /* background: #FFFF; */
    }
    .v-expansion-panel__container--active {
        background: #f9ca03bd !important;

    }

    .select-deposit{
        cursor: pointer;
    }
    /* .select-deposit:hover{
        background: #575b7561;
    } */
    .border-none{
        border: 0 !important;
    }
    .v-expansion-panel{
        margin: 0 !important;
    }
    .right-padding{
        /* padding: 10px !important */
    }
    .deposit-sum{
        flex: 1;
        text-align: center;
        padding: 15px 0;
        border-right: 1px solid silver;
    }
    p{
        margin: 0;
    }
    td{
        padding: 5px;
        text-align: center;
        width: 200px;
    }
    .item{
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
    }
    .empty{
        background: #ffd614;
    }
    .flag{
        width: 25px;
        height: 25px;
    }
    .flag-text{
        margin: 0 5px;
        font-size: 17px;
        font-weight: 500;
    }
    .cur-item{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        background: #ececec;
        border-radius: 5px;
    }
    .commission{
        font-size: 10px;
        font-style: italic;
        color: #9a9a9a;
    }
    .commission-value{
        font-size: 12px;
    }
    .currency-value{
        line-height: 15px;
    }
    .platform-logo{
        width: 30px;
        height: 30px;
        margin: 0 5px;
    }
    .platform-btn{
        width: 150px;
        border-radius: 10px;
    }
    .active-platform-btn{
        background: #00507D;
        color: white !important;
    }
</style>
