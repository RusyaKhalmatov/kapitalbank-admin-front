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
            <v-btn class="set-date" @click="getData">Получить</v-btn>
        </div>
        <!-- <div class="select-type-box">
            <v-btn :class="[{'active-select-btn': selectedItem === 'apelsin' }, 'select-type-btn']" @click="change('apelsin')"><img draggable="false" class="select-box-image" src="@/assets/apelsin.png" alt="apelsin">Apelsin</v-btn>
            <v-btn :class="[{'active-select-btn': selectedItem === 'telegramBot' }, 'select-type-btn']" @click="change('telegramBot')"><img draggable="false" class="select-box-image" src="@/assets/telegrambot-image.jpg"  alt="telegrambot">TelegramBot</v-btn>
        </div> -->
        <h2 v-if="corAccData.result">Остатки по корр счету: {{Math.abs(corAccData.result[0].s_out/100) | number-format}}</h2>
        <!-- <span class="platform-box">
            <v-btn flat :class="['platform-btn', {'active-platform-btn': isActivePlatform===item.key}]" v-for="(item,index) in platformData" :key="index" @click="isActivePlatform=item.key">
                <img class="platform-logo" v-if="item.key==='ANDROID'" src="@/assets/android_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='IOS'" src="@/assets/apple_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='WEB'" src="@/assets/web_icon.png" alt="">
                <img class="platform-logo" v-if="item.key==='TOTAL'" src="@/assets/apelsin.png" alt="">
                <img class="platform-logo" v-if="item.key==='BEFORE'" src="@/assets/before_icon.png" alt="">
                <p>{{item.value}}</p>
            </v-btn>
        </span> -->

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
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Комиссия</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>                    
                </div>
                <div class="deposit-content" >
                    <div class="open-deposit select-deposit">                
                            <v-expansion-panel>
                                <v-expansion-panel-content >
                                    <template v-slot:header>
                                        <div class="open-deposit border-none">
                                            <p class="deposit-box-header-left">{{depositData.openDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.openDepositSummery.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.openDepositSummery.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummery.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header >
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryOur.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none ">{{depositData.openDepositSummeryOur.usd / 100 | number-format}}</p>
                                                    </div>      
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOur.fee / 100 | number-format}}</p>
                                                    </div>                                                                                              
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurUzcard.fee / 100 | number-format}}</p>
                                                </div>   
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurHumo.fee / 100 | number-format}}</p>
                                                </div>  
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOurVisa.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurVisa.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOurVisa.fee / 100 | number-format}}</p>
                                                </div> 
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.openDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.openDepositSummeryOther.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.openDepositSummeryOther.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOther.fee / 100 | number-format}}</p>
                                                    </div> 
                                                </div>
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOtherUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryOtherHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryOtherHumo.fee / 100 | number-format}}</p>
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
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryWallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryWallet.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryWallet.fee / 100 | number-format}}</p>
                                                </div> 
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.openDepositSummeryAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.openDepositSummeryAccount.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.openDepositSummeryAccount.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.openDepositSummeryAccount.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content  class="panel">
                                    <template v-slot:header>
                                        <div class="open-deposit border-none">
                                            <p class="deposit-box-header-left">{{depositData.increaseDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.increaseDepositSummery.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.increaseDepositSummery.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummery.fee / 100 | number-format}}</p>
                                            </div>                                               
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOur.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOur.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none ">{{depositData.increaseDepositSummeryOur.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOur.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurHumo.fee / 100 | number-format}}</p>
                                                </div>   
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOurVisa.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurVisa.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOurVisa.fee / 100 | number-format}}</p>
                                                </div>   
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOther.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOther.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryOther.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOther.fee / 100 | number-format}}</p>
                                                </div>                                                   
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOtherUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryOtherHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryOtherHumo.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryWallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryWallet.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryWallet.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.increaseDepositSummeryAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.increaseDepositSummeryAccount.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.increaseDepositSummeryAccount.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.increaseDepositSummeryAccount.fee / 100 | number-format}}</p>
                                                </div>                                                
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>

                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="open-deposit border-none">
                                            <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.totalAdmissionDepositSummery.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummery.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom ">
                                                <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummery.fee / 100 | number-format}}</p>
                                            </div>                                             
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOur.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none ">{{depositData.totalAdmissionDepositSummeryOur.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom ">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOur.fee / 100 | number-format}}</p>
                                                    </div>                                                      
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurHumo.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOurVisa.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom ">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOurVisa.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOther.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOther.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryOther.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOther.fee / 100 | number-format}}</p>
                                                    </div>                                                      
                                                </div>
                                            </template>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOtherUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOtherUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryOtherHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryOtherHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryOtherHumo.fee / 100 | number-format}}</p>
                                                </div>                                                   
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryWallet.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryWallet.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryWallet.fee / 100 | number-format}}</p>
                                                    </div>                                                     
                                                </div>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.totalAdmissionDepositSummeryAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.totalAdmissionDepositSummeryAccount.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none">{{depositData.totalAdmissionDepositSummeryAccount.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.totalAdmissionDepositSummeryAccount.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content class="panel">
                                    <template v-slot:header>
                                        <div class="open-deposit border-none">
                                            <p class="deposit-box-header-left">{{depositData.decreaseDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.decreaseDepositSummery.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none">{{depositData.decreaseDepositSummery.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummery.fee / 100 | number-format}}</p>
                                            </div>                                               
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.decreaseDepositSummeryOur.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryOur.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOur.fee / 100 | number-format}}</p>
                                                    </div>                                                       
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurHumo.fee / 100 | number-format}}</p>
                                                </div>                                                    
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryOurVisa.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurVisa.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryOurVisa.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryWallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryWallet.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryWallet.fee / 100 | number-format}}</p>
                                                </div>                                                   
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.decreaseDepositSummeryAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.decreaseDepositSummeryAccount.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none ">{{depositData.decreaseDepositSummeryAccount.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.decreaseDepositSummeryAccount.fee / 100 | number-format}}</p>
                                                </div>                                                       
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>                            
                                </v-expansion-panel-content>                        
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{depositData.closeDepositSummery.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{depositData.closeDepositSummery.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none ">{{depositData.closeDepositSummery.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummery.fee / 100 | number-format}}</p>
                                            </div>                                              
                                        </div>
                                    </template>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <div class="open-deposit border-none">
                                                    <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOur.title}}</p>
                                                    <div class="deposit-box-header-right-bottom border-right">
                                                        <p class="deposit-sum">{{depositData.closeDepositSummeryOur.uzs / 100 | number-format}}</p>
                                                        <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryOur.usd / 100 | number-format}}</p>
                                                    </div>
                                                    <div class="deposit-box-header-right-bottom">
                                                        <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOur.fee / 100 | number-format}}</p>
                                                    </div>                                                      
                                                </div>
                                            </template>                                    
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurUzcard.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurUzcard.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurUzcard.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurUzcard.fee / 100 | number-format}}</p>
                                                </div>                                                   
                                            </div>
                                            <div class="child child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurHumo.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurHumo.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurHumo.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurHumo.fee / 100 | number-format}}</p>
                                                </div>                                                 
                                            </div>
                                            <div class="child border-bt child-open-deposit select-deposit child-panel">
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryOurVisa.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryOurVisa.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurVisa.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryOurVisa.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </div>                                                                        
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryWallet.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryWallet.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryWallet.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryWallet.fee / 100 | number-format}}</p>
                                                </div>                                                  
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>  
                                    <v-expansion-panel>
                                        <v-expansion-panel-content>
                                            <template v-slot:header>
                                                <p class="deposit-box-header-left">{{depositData.closeDepositSummeryAccount.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{depositData.closeDepositSummeryAccount.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none ">{{depositData.closeDepositSummeryAccount.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{depositData.closeDepositSummeryAccount.fee / 100 | number-format}}</p>
                                                </div>                                                     
                                            </template>                                                                                                                                      
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>  
                                </v-expansion-panel-content>  
                                <v-expansion-panel-content class="panel">
                                    <template v-slot:header>
                                        <p class="deposit-box-header-left">{{depositData.totalChargeDepositSummery.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{depositData.totalChargeDepositSummery.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none ">{{depositData.totalChargeDepositSummery.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none right-padding">{{depositData.totalChargeDepositSummery.fee / 100 | number-format}}</p>
                                        </div>                                         
                                    </template>                                                                                                                                      
                                </v-expansion-panel-content>   
                                <v-expansion-panel-content>
                                    <template v-slot:header>
                                        <p class="deposit-box-header-left">{{depositData.totalDifferenceDepositSummery.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{depositData.totalDifferenceDepositSummery.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none ">{{depositData.totalDifferenceDepositSummery.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none right-padding">{{depositData.totalDifferenceDepositSummery.fee / 100 | number-format}}</p>
                                        </div>                                         
                                    </template>                                                                                                                                      
                                </v-expansion-panel-content>                         
                            </v-expansion-panel>                    
                    </div>          
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
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferApelsin.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferApelsin.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferApelsin.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferApelsin.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Uzcard.fee / 100 | number-format}}</p>
                                    </div>

                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Humo.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferApelsinHumo2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Humo.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferApelsinHumo2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Uzcard.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferApelsinVisa2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferApelsinVisa2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Visa.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                            
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferKapital.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferKapital.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferKapital.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferKapital.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferKapitalUzcard2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferKapitalUzcard2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Uzcard.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferKapitalUzcard2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferKapitalUzcard2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalUzcard2Humo.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferKapitalHumo2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferKapitalHumo2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Humo.fee / 100 | number-format}}</p>
                                    </div>

                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferKapitalHumo2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferKapitalHumo2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalHumo2Uzcard.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferKapitalVisa2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferKapitalVisa2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalVisa2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferKapitalVisa2Visa.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                            
                            </v-expansion-panel-content>       
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">Между картами в Beepul</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{beelineTotalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{beelineTotalCommission / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">UZCARD 2 UZCARD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.uzcard2uzcard / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{beelineCount.uzcard2uzcardCommission / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">UZCARD 2 HUMO</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.uzcard2humo / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{beelineCount.uzcard2humoCommission / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">HUMO 2 HUMO</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.humo2humo / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{beelineCount.humo2humoCommission / 100 | number-format}}</p>
                                    </div>

                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">HUMO 2 UZCARD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.humo2uzcard / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{beelineCount.humo2uzcardCommission / 100 | number-format}}</p>
                                    </div>
                                </div>                                                  
                            </v-expansion-panel-content>    
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferOnWallet.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferOnWallet.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferOnWallet.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferOnWallet.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnWalletUzcard2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnWalletUzcard2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletUzcard2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletUzcard2Wallet.fee / 100 | number-format}}</p>                                    
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnWalletHumo2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnWalletHumo2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletHumo2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletHumo2Wallet.fee / 100 | number-format}}</p>                                    
                                    </div>

                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnWalletVisa2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnWalletVisa2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletVisa2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletVisa2Wallet.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnWalletAccount2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnWalletAccount2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletAccount2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletAccount2Wallet.fee / 100 | number-format}}</p>                                    
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnWalletWallet2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnWalletWallet2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletWallet2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnWalletWallet2Wallet.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                            
                            </v-expansion-panel-content>     
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferFromWallet.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferFromWallet.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferFromWallet.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferFromWallet.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Uzcard.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Humo.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Visa.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromWalletWallet2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromWalletWallet2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromWalletWallet2Account.fee / 100 | number-format}}</p>
                                    </div>

                                </div>                                                      
                            </v-expansion-panel-content>          
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferOnAccount.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferOnAccount.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferOnAccount.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferOnAccount.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnAccountUzcard2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnAccountUzcard2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountUzcard2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountUzcard2Account.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnAccountHumo2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnAccountHumo2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountHumo2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountHumo2Account.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnAccountVisa2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnAccountVisa2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountVisa2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountVisa2Account.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnAccountWallet2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnAccountWallet2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountWallet2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountWallet2Account.fee / 100 | number-format}}</p>
                                    </div>
                                </div>       
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferOnAccountAccount2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferOnAccountAccount2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountAccount2Account.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferOnAccountAccount2Account.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                                                        
                            </v-expansion-panel-content>   
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferFromAccount.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferFromAccount.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferFromAccount.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferFromAccount.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Uzcard.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Humo.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Visa.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferFromAccountAccount2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferFromAccountAccount2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferFromAccountAccount2Wallet.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                                                                                         
                            </v-expansion-panel-content>   
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferRepayment.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferRepayment.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferRepayment.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferRepayment.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>   
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none">
                                                <p class="deposit-box-header-left">{{transferData.TransferLoanRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferLoanRepayment.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepayment.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepayment.fee / 100 | number-format}}</p>                                                
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentUzcard2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentUzcard2Loan.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentUzcard2Loan.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>                                
                                        <div class="child child-open-deposit select-deposit child-panel" v-if="transferData.TransferLoanRepaymentHumo2Loan">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentHumo2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentHumo2Loan.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentHumo2Loan.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>  
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentAccount2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentAccount2Loan.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentAccount2Loan.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>    
                                        <div class="child border-bt child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanRepaymentWallet2Loan.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanRepaymentWallet2Loan.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanRepaymentWallet2Loan.fee / 100 | number-format}}</p>
                                            </div>
                                        </div> 
                                    </v-expansion-panel-content>                                                                    
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none">
                                                <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferLoanPrematureRepayment.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepayment.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepayment.fee / 100 | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentUzcard2LoanPremature.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>     
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentHumo2LoanPremature.fee / 100 | number-format}}</p>
                                            </div>
                                        </div> 
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentAccount2LoanPremature.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>  
                                        <div class="child border-bt child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferLoanPrematureRepaymentWallet2LoanPremature.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>                                  
                                    </v-expansion-panel-content>                                                                    
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="open-deposit border-none">
                                                <p class="deposit-box-header-left">{{transferData.TransferApelsinRepayment.title}}</p>
                                                <div class="deposit-box-header-right-bottom border-right">
                                                    <p class="deposit-sum">{{transferData.TransferApelsinRepayment.uzs / 100 | number-format}}</p>
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinRepayment.usd / 100 | number-format}}</p>
                                                </div>
                                                <div class="deposit-box-header-right-bottom">
                                                    <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinRepayment.fee / 100 | number-format}}</p>
                                                </div>
                                            </div>
                                        </template>  
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinUzcard2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinUzcard2Repayment.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Repayment.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinUzcard2Repayment.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>   
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinHumo2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinHumo2Repayment.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Repayment.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinHumo2Repayment.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>      
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinVisa2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinVisa2Repayment.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Repayment.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinVisa2Repayment.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinAccount2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinAccount2Repayment.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinAccount2Repayment.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinAccount2Repayment.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>      
                                        <div class="child child-open-deposit select-deposit child-panel">
                                            <p class="deposit-box-header-left">{{transferData.TransferApelsinWallet2Repayment.title}}</p>
                                            <div class="deposit-box-header-right-bottom border-right">
                                                <p class="deposit-sum">{{transferData.TransferApelsinWallet2Repayment.uzs / 100 | number-format}}</p>
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinWallet2Repayment.usd / 100 | number-format}}</p>
                                            </div>
                                            <div class="deposit-box-header-right-bottom">
                                                <p class="deposit-sum border-none right-padding">{{transferData.TransferApelsinWallet2Repayment.fee / 100 | number-format}}</p>
                                            </div>
                                        </div>                             
                                    </v-expansion-panel-content>                                                                    
                                </v-expansion-panel>
                            </v-expansion-panel-content>   
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{transferData.TransferRequisite.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{transferData.TransferRequisite.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{transferData.TransferRequisite.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{transferData.TransferRequisite.fee / 100 | number-format}}</p>
                                        </div>
                                    </div> 
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferUzcard2Requisite.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferUzcard2Requisite.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferUzcard2Requisite.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferUzcard2Requisite.fee / 100 | number-format}}</p>
                                    </div>
                                </div>          
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferHumo2Requisite.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferHumo2Requisite.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferHumo2Requisite.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferHumo2Requisite.fee / 100 | number-format}}</p>
                                    </div>
                                </div>       
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferWallet2Requisite.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferWallet2Requisite.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferWallet2Requisite.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferWallet2Requisite.fee / 100 | number-format}}</p>
                                    </div>
                                </div>   
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{transferData.TransferAccount2Requisite.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{transferData.TransferAccount2Requisite.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferAccount2Requisite.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{transferData.TransferAccount2Requisite.fee / 100 | number-format}}</p>
                                    </div>
                                </div>                                                                                                                                                                 
                            </v-expansion-panel-content>                                   
                        </v-expansion-panel>
                    </div>
                </div>
            </div>
            <div class="deposit-box" v-if="conversionData.length!=0">
                <div class="deposit-box-header">
                    <p class="deposit-box-header-left">Конвертация</p>
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Сумма</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                            <p class="deposit-sum border-none">USD</p>
                        </div>
                    </div>
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>                     
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{conversionData.ConverionPurchase.title}}</p>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum">{{conversionData.ConverionPurchase.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{conversionData.ConverionPurchase.usd / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConverionPurchaseUzcard2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConverionPurchaseUzcard2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConverionPurchaseUzcard2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConverionPurchaseHumo2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConverionPurchaseHumo2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConverionPurchaseHumo2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                </div> 
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConverionPurchaseWallet2Visa.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConverionPurchaseWallet2Visa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConverionPurchaseWallet2Visa.usd / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConverionPurchaseAccount2UVisa.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConverionPurchaseAccount2UVisa.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConverionPurchaseAccount2UVisa.usd / 100 | number-format}}</p>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content class="panel">
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{conversionData.ConversionSale.title}}</p>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum">{{conversionData.ConversionSale.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{conversionData.ConversionSale.usd / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Uzcard.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Uzcard.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Uzcard.usd / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Humo.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Humo.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Humo.usd / 100 | number-format}}</p>
                                    </div>
                                </div> 
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Wallet.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Wallet.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Wallet.usd / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{conversionData.ConversionSaleVisa2Account.title}}</p>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum">{{conversionData.ConversionSaleVisa2Account.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{conversionData.ConversionSaleVisa2Account.usd / 100 | number-format}}</p>
                                    </div>
                                </div>                        
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
                    <div class="deposit-box-header-right">
                        <p class="deposit-box-header-right-top">Вознаграждение</p>
                        <div class="deposit-box-header-right-bottom">
                            <p class="deposit-sum border-none">UZS</p>
                        </div>
                    </div>
                </div>
                <div class="deposit-content">
                    <div class="open-deposit select-deposit">
                        <v-expansion-panel>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">{{paymentsData.SupplierApelsin.title}}</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{paymentsData.SupplierApelsin.uzs / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">{{paymentsData.SupplierApelsin.usd / 100 | number-format}}</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{paymentsData.SupplierApelsin.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinUzcard2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinUzcard2Service.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinUzcard2Service.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinUzcard2Service.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinHumo2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinHumo2Service.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinHumo2Service.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinHumo2Service.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinVisa2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinVisa2Service.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinVisa2Service.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinVisa2Service.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinAccount2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinAccount2Service.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinAccount2Service.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinAccount2Service.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">{{paymentsData.SupplierApelsinWallet2Service.title}}</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{paymentsData.SupplierApelsinWallet2Service.uzs / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinWallet2Service.usd / 100 | number-format}}</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{paymentsData.SupplierApelsinWallet2Service.fee / 100 | number-format}}</p>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">За E-commerce</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ecommerceData.totalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{ecommerceData.totalFee / 100 | number-format}}</p>
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
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none right-padding">{{item.fee / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">За Ucell</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{ucellTotalAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{ucellTotalCommission / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">USSD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{ucellCount.ussdAmount / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{ucellCount.ussdCommission / 100 | number-format}}</p>
                                    </div>
                                </div>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">Сайт</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{ucellCount.siteAmount / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">{{ucellCount.siteCommission / 100 | number-format}}</p>
                                    </div>
                                </div>                     
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="open-deposit border-none">
                                        <p class="deposit-box-header-left">За Beeline</p>
                                        <div class="deposit-box-header-right-bottom border-right">
                                            <p class="deposit-sum">{{beelineCount.ussdAmount / 100 | number-format}}</p>
                                            <p class="deposit-sum border-none">0</p>
                                        </div>
                                        <div class="deposit-box-header-right-bottom">
                                            <p class="deposit-sum border-none">{{beelineCount.ussdCommission / 100 | number-format}}</p>
                                        </div>
                                    </div>
                                </template>   
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">UZCARD</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.ussdUzcard / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                </div>    
                                <div class="child child-open-deposit select-deposit child-panel">
                                    <p class="deposit-box-header-left">HUMO</p>
                                    <div class="deposit-box-header-right-bottom border-right">
                                        <p class="deposit-sum">{{beelineCount.ussdHumo / 100 | number-format}}</p>
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                    <div class="deposit-box-header-right-bottom">
                                        <p class="deposit-sum border-none right-padding">0</p>
                                    </div>
                                </div>                                                  
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </div>
                </div>

            </div>
            <div class="deposit-box">
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
    name: 'pivotTable',
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
            platformData: [],
            newDepositData: [],
            isActivePlatform: 'TOTAL',
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
        }
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
        }
    },
    methods:{
        getCorAcc(){
            this.$http.post(this.$store.getters.newApiUrl+'/report/corAcc', {"branch":"01158", "currency":"000"})
            .then(response=>{
                // console.log(response.data);
                this.corAccData = response.data.data;
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
            this.getAllApelsin();         
            this.getAllTelegramCount();
            this.getAllEcommerceData();
            this.getAllUcellCount();
            this.getAllBeelineCount();

        
        },
        getData(){
            this.getEcommerceData();
            this.getDataApelsin();        
            this.getTelegramCount();
            this.getUcellCount();
            this.getBeelineCount();
            
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
            this.getDataApelsin();        
            this.getTelegramCount();
            this.getEcommerceData();
            this.getUcellCount();
            this.getBeelineCount();


        
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
            this.getDataApelsin();        
            this.getTelegramCount();
            this.getEcommerceData();
            this.getUcellCount();
            this.getBeelineCount();

            
        },
        Today(){
            this.isDate = true;
            this.isSelect = false;
            this.active = 'btn2';
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate());
            this.fromDate = begDay.getTime();
            this.toDate = date.getTime();   
            this.getDataApelsin();        
            this.getTelegramCount();
            this.getEcommerceData();
            this.getUcellCount();
            this.getBeelineCount();



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
            this.getDataApelsin();        
            this.getTelegramCount();
            this.getEcommerceData();
            this.getUcellCount();
            this.getBeelineCount();


                        
        },
        Month(){
            this.active = 'btn4';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            this.fromDate = firstDay.getTime();
            this.toDate = date.getTime();

            this.getDataApelsin();        
            this.getTelegramCount();
            this.getEcommerceData();
            this.getUcellCount();
            this.getBeelineCount();

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
            }
            console.log(postData)
            console.log(this.fromDate, ' - ', this.toDate)
            let self = this;
            self.depositData = [];
            self.transferData = [];
            self.conversionData = [];
            self.regUserData = [];
            self.paymentsData = [];
            self.crossData = {};
            self.newDepositData = [];
            // self.$http.post(self.$store.getters.newApiUrl + '/report/deposit/summery', postData)
            // .then(response=>{
            //     if(response.status===200){
            //         // console.log(response.data.data)
            //         self.newDepositData = response.data.data;
            //     }
            // }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/summery/deposit', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.depositData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/summery/transfer', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.transferData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/summery/conversion', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.conversionData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.apiUrl + '/report/summery/user', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.regUserData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.apiUrl + '/report/summery/payments', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.paymentsData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/cross/summery', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.crossData = response.data.data;
                }
            }, self.handleError)
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
                
            }
            self.$http.post(self.$store.getters.newApiUrl + '/report/summery/deposit', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.depositData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/summery/transfer', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.transferData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.apiUrl + '/report/summery/conversion', postData)
            .then(response=>{
                if(response.status===200){
                    // console.log(response.data.data)
                    self.conversionData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.apiUrl + '/report/summery/payments', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.paymentsData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.apiUrl + '/report/summery/user', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.regUserData = response.data.data;
                }
            }, self.handleError)
            self.$http.post(self.$store.getters.newApiUrl + '/report/cross/summery', postData)
            .then(response=>{
                if(response.status===200){
                    console.log(response.data.data)
                    self.crossData = response.data.data;
                }
            }, self.handleError)
        },
        getPlatform(){
            this.$http.get(this.$store.getters.newApiUrl+`/app-version/platform`)
            .then(response=>{
                console.log(response.data.data);
                this.platformData = response.data.data.reverse();

            }, this.handleError)
        }
    },
    mounted(){
        this.getPlatform();
        this.Today(0);
        this.getCorAcc();
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
        padding-right: 24px;

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
        padding: 10px !important
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