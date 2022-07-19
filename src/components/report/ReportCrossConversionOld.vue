<template>
    <div color="#fafafa" class="main">
        <h1 class="mt-2">Отчет по кросс-конвертации</h1>
        <date-select description="" @date="getDate"></date-select>
        <table border="1" width="100%" bordercolor="silver" v-if="crossData.USD"> 
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
            <tr>
                <!-- <td>USD</td> -->
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.EUR.Amount / 100 | number-format}} USD</p> 
                        <p class="commission">Комиссия:</p>
                        <p class="commission-value">({{crossData.USD.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.RUB.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>
                        <p class="commission-value">({{crossData.USD.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.KZT.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>
                        <p class="commission-value">({{crossData.USD.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.CHF.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>
                        <p class="commission-value">({{crossData.USD.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.CNY.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>
                        <p class="commission-value">({{crossData.USD.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.GBP.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.USD.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.JPY.Amount / 100 | number-format}} USD</p>
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.USD.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.USD.KRW.Amount / 100 | number-format}} USD</p>  
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.USD.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>            
            </tr>
            <tr>
                <!-- <td>EUR</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.USD.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.USD.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.RUB.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.KZT.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.CHF.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.CNY.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.GBP.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.JPY.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.EUR.KRW.Amount / 100 | number-format}} EUR</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.EUR.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>
                </td>
            </tr>   
            <tr>
                <!-- <td>RUB</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.USD.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.EUR.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.KZT.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.CHF.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.CNY.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.GBP.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.JPY.Amount / 100 | number-format}} RUB</p>
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.RUB.KRW.Amount / 100 | number-format}} RUB</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.RUB.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr>   
            <tr>
                <!-- <td>KZT</td>     -->
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.USD.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.EUR.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.RUB.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.CHF.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.CNY.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.GBP.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.JPY.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KZT.KRW.Amount / 100 | number-format}} KZT</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.KZT.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr> 
            <tr>
                <!-- <td>CHF</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.USD.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.CHF.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.EUR.Amount / 100 | number-format}} CHF</p>
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.CHF.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.RUB.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                    
                        <p class="commission-value">({{crossData.CHF.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.KZT.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CHF.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.CNY.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CHF.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.GBP.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CHF.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.JPY.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CHF.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CHF.KRW.Amount / 100 | number-format}} CHF</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CHF.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr>   
            <tr>
                <!-- <td>CNY</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.USD.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.EUR.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.RUB.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.KZT.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.CHF.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.GBP.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.JPY.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.CNY.KRW.Amount / 100 | number-format}} CNY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.CNY.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr>  
            <tr>
                <!-- <td>GPB</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.USD.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.EUR.Amount / 100 | number-format}} GPB</p>
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.RUB.Amount / 100 | number-format}} GPB</p>
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.KZT.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.CHF.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.CNY.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.JPY.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.GBP.KRW.Amount / 100 | number-format}} GPB</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.GBP.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr>
            <tr>
                <!-- <td>JPY</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.USD.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.EUR.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.RUB.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.KZT.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.CHF.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.CNY.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.GBP.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
                <td>
                    <span class="item">
                        <p>{{crossData.JPY.KRW.Amount | number-format}} JPY</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.JPY.KRW.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
            </tr>
            <tr>
                <!-- <td>KRW</td> -->
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.USD.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.USD.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.EUR.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.EUR.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.RUB.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.RUB.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.KZT.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.KZT.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.CHF.Amount / 100 | number-format}} KRW</p>
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.CHF.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.CNY.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.CNY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.GBP.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.GBP.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td>
                    <span class="item">
                        <p>{{crossData.KRW.JPY.Amount / 100 | number-format}} KRW</p> 
                        <p class="commission">Комиссия:</p>                                                                    
                        <p class="commission-value">({{crossData.KRW.JPY.Fee / 100 | number-format}} сум)</p>
                    </span>                                
                </td>
                <td class="empty"></td>
            </tr>
        </table>
        <v-btn class="mt-3" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
        <download-excel
                v-show="false"
                id="excel"
                name="cross"
                :fields="excelHeader"
                :data="excelData">
            <v-btn icon dark color="secondary">
                <v-icon>mdi-file-excel</v-icon>
            </v-btn>
        </download-excel> 
        <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            label="Поиск"/>
        <v-data-table            
            :headers="headers"
            :items="crossResult"                                                      
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.userId }}</td>
                    <td>{{ props.item.username}}</td>
                    <td>{{ props.item.sender}}</td>   
                    <td>{{ props.item.receiver}}</td>   
                    <td v-if="props.item.senderAmount==='JPY'">{{ props.item.senderAmount | number-format}} {{props.item.senderCurrency}}</td>  
                    <td v-else>{{ props.item.senderAmount / 100 | number-format}} {{props.item.senderCurrency}}</td>  
                    
                    <td v-if="props.item.receiverCurrency==='JPY'">{{ props.item.receiverAmount | number-format}} {{props.item.receiverCurrency}}</td>  
                    <td v-else>{{ props.item.receiverAmount/100 | number-format}} {{props.item.receiverCurrency}}</td>  
                    <td>{{ props.item.senderFeeAmount/100 | number-format}} {{props.item.senderFeeCurrency}}</td>  
                    <td>{{ props.item.endTime | timestamp-to-date}}</td>
                    <td>{{ props.item.operationStatus}}</td>         
                    <td>{{ props.item.operationId}}</td>         
                </tr>
            </template>
            <template slot="no-data">
                <vue-content-loading v-if="!isEmpty" :width="300" :height="98">
                    <rect x="0" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="3" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="3" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="3" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="3" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="3" rx="3" ry="10" width="7%" height="5" />

                    <rect x="0" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="12" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="12" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="12" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="12" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="12" rx="3" ry="10" width="7%" height="5" />
                    
                    <rect x="0" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="22" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="22" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="22" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="22" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="22" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="32" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="32" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="32" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="32" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="32" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="42" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="42" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="42" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="42" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="42" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="52" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="52" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="52" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="52" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="52" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="62" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="62" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="62" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="62" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="62" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="72" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="72" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="72" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="72" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="72" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="82" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="82" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="82" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="82" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="82" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="92" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="92" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="92" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="92" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="92" rx="3" ry="10" width="7%" height="5" />                     
                </vue-content-loading>                   
                <h2 v-else class="empty-text">Пусто</h2>
            </template>
        </v-data-table>
        <v-pagination
        v-if="totalPages"
        class="center"
        :disabled="loader"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>  
    </div>
</template>
<script>
import DateSelect from '@/components/date/DateSelect'
import {VclTable, VueContentLoading}  from 'vue-content-loading';

export default {
    name: 'CrossConversion',
    components:{
        DateSelect, VclTable, VueContentLoading
    }, 
    data(){
        return {
            date: {},
            currencyData: [],
            fromDate: '',
            toDate: '',
            totalPages: '',
            crossData: {},
            crossResult: [],
            headers: [
                {text: "ID пользователя", value: "userId",sortable: false},
                {text: "Имя пользователя", value: "username",sortable: false},
                {text: "Отправитель", value: "sender",sortable: false},
                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Сумма отправителя", value: "senderAmount",sortable: false},
                {text: "Сумма получателя", value: "receiverAmount",sortable: false},
                {text: "Комиссия", value: "senderFeeAmount",sortable: false},
                {text: "Время оплаты", value: "endTime ",sortable: false},
                {text: "Статус операции", value: "operationStatus", sortable: false},
                {text: "ID операции", value: "operationId ",sortable: false},
                
            ],
            page: 1,
            isEmpty: false,
            excelData: [],
            search: '',
            isSearch: false

        }
    },
    computed:{
        excelHeader() {
                let self = this, result = {};
                console.log(self.headers[0])
                for (let i = 0; i < self.headers.length; i++) {
                    let currentHeader = self.headers[i];
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Комиссия'] = {
                    field: "senderFeeAmount",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };
                result['Время оплаты'] = {
                    field: "endTime",
                    callback: value => {
                        let date = new Date(value);
                        return date.toLocaleString();
                    }
                };    
                result['ID операции'] = {
                    field: "operationId",
                    callback: value => {
                        return value;
                    }
                };         
                console.log(result)
                return result;
            }
    },
    watch:{
        date(val){
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.isEmpty = false;
            if(this.page===1){
                this.getCross(1);
                this.getCrossAmount();
            }
            else{
                this.page = 1;
            }
        },
        search(val){
            if(val){
                this.isSearch = true;
                if(this.page!=1)
                    this.page = 1;
                else{
                    this.getCross(1);
                }
            }
            else{
                this.isSearch = false;
                this.getCross(1);
            }
        },
        page(newVal){
            this.getCross(newVal);
        },

    },
    methods:{
        getCrossAmount(){
            let self = this;
            let postData = {
                dateFrom: this.fromDate,
                dateTo: this.toDate,
                status: "SUCCESS"
            }
            this.crossData = {};
            self.$http.post(self.$store.getters.newApiUrl2+'/report/cross/amount?q='+this.search, postData)
            .then(response=>{
                // console.log(response.data.data);
                this.crossData = response.data.data

            }, this.handleError)
        },
        getDate(val){
            this.date = val;
        },
        getCross(page){
            const postData = {
                dateFrom: this.fromDate,
                dateTo: this.toDate,
            }     
            this.crossResult = [];
            this.loader = true;       
            this.$http.post(this.$store.getters.newApiUrl2+`/report/cross?page=${page-1}&size=10&q=${this.search}`, postData)
            .then(response=>{
                // console.log(response.data.data);
                this.totalPages = response.data.data.totalPages;
                this.crossResult = response.data.data.content;
                if(response.data.data.content.length===0)
                    this.isEmpty = true;
                else 
                    this.isEmpty = false;
                this.loader = false;
            }, this.handleError)
        },
        getCrossCurriencies(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/cross/currencies`)
            .then(response=>{
                this.currencyData = response.data.data;
            }, this.handleError)
        },
        getExcel(){
            const postData = {
                dateFrom: this.fromDate,
                dateTo: this.toDate,
            }     
            this.excelData = [];
            this.loader = true;       
            this.$http.post(this.$store.getters.newApiUrl2+`/report/cross/excel?q=SUC`, postData)
            .then(response=>{
                this.excelData = response.data.data;
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                
                }
                

                this.loader = false;
            }, this.handleError)
        }
    },
    mounted(){
        this.fromDate = this.date.fromDate;
        this.toDate = this.date.toDate;
        // this.getCrossAmount()
        // this.getCross(1);
        this.getCrossCurriencies();
    }

}
</script>
<style scoped>
    .main{
        background: #fafafa;
        width: 100%;
    }
    h1{
        text-align: center;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
    .empty-text{
        text-align: center;
        color: #757575;
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
</style>
