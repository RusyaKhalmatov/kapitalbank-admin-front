<template>
  <div class="main">
    <h1 class="header">Заказ карт</h1>

    <!-- <div class="param-box">
        <div class="user-box">
            <p v-if="name&&!userId" class="user-text">{{name}}</p>
            <template v-else>
                <p class="user-text">Пользователь: </p>
                <p v-show="userId" class="user-text">{{name}}</p>
            </template>
            <v-btn @click="dialog=true" depressed small class="user-btn">{{buttonName}}</v-btn>
            <v-btn @click="clean" v-if="name" icon small >
                <v-icon color="error">remove_circle_outline</v-icon>
            </v-btn>
        </div>
        <v-select
            v-model="status"
            :items="statusData"
            attach
            chips
            label="Статус заказа"
            multiple
        ></v-select>
        <span class="row">
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
        <v-btn v-if="isClick" class="get-button" @click="getCardOrder(1)">Получить</v-btn>
        <v-btn class="get-button" v-else>
            <v-progress-circular style="height:23px; width: 23px;"
            indeterminate
            color="amber"
            ></v-progress-circular>
        </v-btn>
    </div> -->
    <div class="search-box">
      <div class="search-box-top">


      </div>
      <div class="filter">
        <div class="user-box">
          <p v-if="name&&!userId" class="user-text">{{name}}</p>
          <template v-else>
            <p class="user-text">Пользователь: </p>
            <!-- <v-btn>Выбрать</v-btn> -->
            <p v-show="userId" class="user-text">{{name}}</p>
          </template>
          <v-btn @click="dialog=true" depressed small class="user-btn">{{buttonName}}</v-btn>
          <v-btn @click="clean" v-if="name" icon small>
            <v-icon color="error">remove_circle_outline</v-icon>
          </v-btn>
        </div>
        <!-- <v-select
            v-model="status"
            :items="statusData"
            attach
            chips
            label="Статус заказа"
            multiple
        ></v-select> -->
        <v-select
          label="Статус заказа"
          :items="statusData"
          v-model="status"
          attach
          chips
          multiple>
          <template v-slot:prepend-item>
            <v-list-tile ripple @click="toggle">
              <v-list-tile-action>
                <v-icon :color="status.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Выбрать все</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <span class="row">
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
        <!-- <v-btn v-if="isClick" class="get-button" @click="getCardOrder(1)">Получить</v-btn> -->
        <!-- <v-btn class="get-button" v-else>
            <v-progress-circular style="height:23px; width: 23px;"
            indeterminate
            color="amber"
            ></v-progress-circular>
        </v-btn> -->


        <span class="filter-child">
                    <v-checkbox
                      v-model="isPhone"
                      label="По номеру телефона"
                    ></v-checkbox>
                    <v-text-field
                      class="phone-input"
                      @keypress="isNumber($event)"
                      v-if="isPhone"
                      label="Номер телефона"
                      v-model="search"
                    ></v-text-field>
                    <v-checkbox
                      v-model="isSearchId"
                      @keypress="isNumber($event)"
                      label="По номеру заявки"
                    ></v-checkbox>
                    <v-text-field
                      class="phone-input"
                      v-if="isSearchId"
                      label="Номер заявки"
                      v-model="searchId"
                    ></v-text-field>
                    <div>
                        <v-checkbox
                          v-model="isClient"
                          label="По клиент/не клиент"
                        ></v-checkbox>
                        <v-radio-group class="radio" v-model="clientRadio" v-if="isClient">
                            <v-radio
                              :key="0"
                              label="Клиент"
                              :value="true"
                            ></v-radio>
                            <v-radio
                              :key="1"
                              label="Не клиент"
                              :value="false"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    

                    <div>
                        <v-checkbox
                          v-model="isDelivery"
                          label="По доставке"
                        ></v-checkbox>
                        <v-radio-group class="radio" v-model="deliveryRadio" v-if="isDelivery">
                            <v-radio
                              :key="0"
                              label="Да"
                              :value="true"
                            ></v-radio>
                            <v-radio
                              :key="1"
                              label="Нет"
                              :value="false"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <v-checkbox
                      v-model="isBranchId"
                      label="По филиалам"
                    ></v-checkbox> 
                    <v-checkbox
                      v-model="isCardProduct"
                      label="По продуктам"
                    ></v-checkbox>    
                    <v-select
                      v-if="isCardProduct"
                      v-model="isCardProductData"
                      :items="cardProductData"
                      label="Продукты"
                      item-text="name"
                      item-value="id"
                      class="branch-select"
                    ></v-select>
                </span>
        <v-select
          v-if="isBranchId"
          v-model="isBranchIdData"
          :items="branchData"
          label="Филиал"
          item-text="name"
          item-value="branchId"
          class="branch-select"
        ></v-select>

        <!-- <v-switch
        v-model="searchDate"
        :label="`Дата ${checkDate(searchDate)}`"
        ></v-switch> -->
        <v-btn v-if="isClick" class="search-btn" :loading="loader" @click="orderSearch(1)">Получить</v-btn>
        <v-btn class="get-button" v-else>
          <v-progress-circular style="height:23px; width: 23px;"
                               indeterminate
                               color="amber"
          ></v-progress-circular>
        </v-btn>
      </div>
    </div>
    <!-- <div class="statistics">
        <h2 class="stat-header">Количество заявок с {{fromDate | timestamp-to-date}} по {{toDate | timestamp-to-date}}</h2>
        <template v-if="summeryData.statuses">
            <h4 class="stat-text">По продуктам</h4>
            <div class="card-products">
                <span :class="['card-products-child', { 'visa-classic' : index===0, 'visa-infinite': index===1, 'visa-platinum': index===2, 'visa-gold': index===3, 'uzcard': index===4, 'humo': index===5}]" text-color="white" v-for="(value, name, index) in summeryData.cardProducts" :key="index">
                    <span :class="['card-products-child-value', {'visa-infinite-value': index===1||index===2||index===5}]">
                        {{value.toLocaleString('us', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
                    </span>
                    <span class="card-products-child-name">{{name}}</span>
                </span>
            </div>
            <h4 class="stat-text">По статусу</h4>
            <div class="statuses">

                <span :class="['card-products-child', {'under-writer': index===1, 'ready': index===0||index===6, 'cancelled': index===2||index===4||index===9||index===7}]" text-color="white" v-for="(value, name, index) in summeryData.statuses" :key="index">
                    <span class="card-products-child-value">
                        {{value.toLocaleString('us', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
                    </span>
                    <span class="card-products-child-name">{{name}}</span>
                </span>
            </div>
        </template>
        <vue-content-loading v-else :width="300" :height="32.9">
            <rect x="0" y="5" rx="4" ry="4" width="60%" height="7" />
            <rect x="0" y="15" rx="4" ry="4" width="100%" height="7" />
            <rect x="0" y="25" rx="4" ry="4" width="10%" height="7" />
        </vue-content-loading>

    </div> -->
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Список пользователей</v-card-title>
        <v-text-field
          class="user-search"
          v-model="userSearch"
          prepend-icon="mdi-magnify"
          label="Поиск"
        >
        </v-text-field>
        <div class="content-box" v-if="usersData.length!=0">
          <div @click="setUser(user)" class="box" v-for="(user, index) in usersData" :key="index">
            <p class="box-child">{{user.firstName}}</p>
            <p class="box-child">{{user.lastName}}</p>
            <p class="box-child">{{user.phone}}</p>
            <!-- <p class="box-child">{{user.id}}</p> -->
          </div>
        </div>
        <div v-else class="progress-circular">
          <v-progress-circular style="height:50px; width: 50px;"
                               indeterminate
                               color="amber"
          ></v-progress-circular>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="dialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="content">
      <v-pagination
        class="center"
        v-if="totalPages"
        v-model="curPage"
        :length="totalPages"
        :total-visible="10"
      ></v-pagination>
      <div class="content-cards" v-if="totalPages">
        <v-card class="card" v-for="(card, index) in cardOrderData" :key="index">
          <div class="card-header">
            <span class="card-header-left">№: {{card.id}}</span>
            <span class="change-box">
                            <v-btn v-if="card.status.key==='NEW'" @click="openForwardBox(card)" color="green"
                                   style="color: #FFFF; border-radius: 25px;" small depressed>На исполнение</v-btn>
              <!-- <v-btn v-if="card.status.key==='NEW'" @click="openResubmitBox(card.id)" color="orange accent-3" style="color: #FFFF; border-radius: 25px;" small depressed>На переработку</v-btn> -->
                            <v-btn v-if="card.status.key==='WAITING'&&$store.getters.roles!='FRONT_OFFICE'"
                                   @click="openBranchBox(card)" color="orange accent-3"
                                   style="color: #FFFF; border-radius: 25px;" small depressed>Сменить филиал</v-btn>
                            <v-btn v-if="card.status.key==='WAITING'" @click="openReadyBox(card.id)" color="#1b65be"
                                   style="color: #FFFF; border-radius: 25px;" small depressed>Карта выпущена</v-btn>
                            <v-btn v-if="card.status.key==='READY'" @click="openSuccessBox(card.id)" color="green"
                                   style="color: #FFFF; border-radius: 25px;" small depressed>Карта передана</v-btn>
                            <v-btn
                              v-if="card.status.key==='NEW'||card.status.key==='UNDER_WRITER' || card.status.key==='WAITING'"
                              @click="openRejectBox(card.id)" color="error" small depressed style="border-radius: 25px">Отказать</v-btn>

                        </span>
            <span class="card-header-right">{{card.status.message}}</span>
          </div>

          <div class="info-box">
            <div class="other-info">
              <div class="user-info">
                <div class="card-details">
                  <div class="card-title">
                    <p class="card-title-text">{{card.user.firstName}} {{card.user.lastName}}</p>
                    <p class="card-title-phone">{{card.user.phone}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Клиент: <span
                      v-if="card.user.customerId">( ID - {{card.user.customerId}} )</span></p>
                    <p class="other-value">{{card.details.client | checkStatus}}</p>
                  </div>
                  <div class="other-info-child" v-if="card.details.client">
                    <p class="other-text">Оформляет на свое имя: </p>
                    <p :class="['other-value', {'cash-payment': !card.details.owner}]">{{card.details.owner |
                      checkStatus}} <span v-if="!card.details.owner">(оформляет на другого человека)</span></p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Филиал: </p>
                    <p v-if="card.details.branch" class="other-value">{{card.details.branch.name}}</p>
                  </div>
                  <div :class="['other-info-child']">
                    <p
                      :class="['other-text', {'delivery': card.details.delivery, 'border-left': card.details.delivery}]">
                      Доставка: </p>
                    <p
                      :class="['other-value', {'delivery': card.details.delivery, 'border-right': card.details.delivery}]">
                      {{card.details.delivery | checkStatus}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Карта продукта: </p>
                    <p v-if="card.details.cardProduct"
                       :class="['other-value', {'cash-payment': card.details.cardProduct.id===121||card.details.cardProduct.id===141||card.details.cardProduct.id===142||card.details.cardProduct.id===143||card.details.cardProduct.id===144||card.details.cardProduct.id===145||card.details.cardProduct.id===208||card.details.cardProduct.id===206}]">
                      {{card.details.cardProduct.name}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Номер для смс-информирования: </p>
                    <p class="other-value">{{card.details.phone}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Пин код: </p>
                    <p v-if="card.details.pin" class="other-value">{{card.details.pin}}</p>
                  </div>
                  <div class="other-info-child" v-if="!card.details.status">
                    <p class="other-text">№ паспорта: </p>
                    <p v-if="card.details.passportId" class="other-value">{{card.details.passportId}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Адрес: </p>
                    <p v-if="card.details.addressId" class="other-value">{{card.details.addressId.city}} <span
                      v-if="card.details.addressId.city">,</span> {{card.details.addressId.address1}} <span
                      v-if="card.details.addressId.address2">, </span> {{card.details.addressId.address2}}</p>
                  </div>
                  <div class="other-info-child" v-if="card.details.status">
                    <p class="other-text">Полный адрес: </p>
                    <p v-if="card.details.addressId" class="other-value">{{card.details.addressId.full}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Ориентир: </p>
                    <p v-if="card.details.addressId" class="other-value">{{card.details.addressId.indicative}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Статус оплаты: </p>
                    <p
                      :class="['other-value', {'operation-success': card.operationStatus==='SUCCESS', 'operation-failed': card.operationStatus==='FAILED'}]">
                      {{card.operationStatus}}</p>
                  </div>
                  <template v-if="card.details.reissue">
                    <div class="other-info-child">
                      <p class="other-value operation-failed">Перевыпуск карты</p>
                    </div>
                    <div class="other-info-child">
                      <p class="other-text">Номер карты для перевыпуска: </p>
                      <p class="other-value">{{card.details.reissuePan}}</p>
                    </div>
                    <div class="other-info-child">
                      <p class="other-text">ID карты для перевыпуска: </p>
                      <p class="other-value">{{card.details.reissueCardId}}</p>
                    </div>
                  </template>
                  <div class="other-info-child">
                    <p class="other-text">Тип оплаты: </p>
                    <p class="other-value">{{card.operationType}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Время создания: </p>
                    <p class="other-value">{{card.createTime | timestamp-to-date}}</p>
                  </div>
                  <div class="other-info-child">
                    <p class="other-text">Время изменения: </p>
                    <p class="other-value">{{card.updateTime | timestamp-to-date}}</p>
                  </div>
                </div>
                <div v-if="!isHistoryClick" @click="getHistory(card.id)" class="history">
                  Показать историю
                </div>
                <div v-else class="history">
                  <v-progress-circular style="height:30px; width: 30px;"
                                       indeterminate
                  ></v-progress-circular>
                </div>
                <div class="doc-box">
                  <div class="passport"
                       v-if="card.details.dockFrontUrl||card.details.dockBackUrl||card.details.dockSelfieUrl">
                    <!-- <img class="image" v-for="(image, i) in images" :src="image" :key="i" @click="index = i"> -->
                    <p class="passport-text">Паспортные данные:</p>
                    <span class="passport-box">
                                            <img v-if="card.details.dockFrontUrl" class="image"
                                                 :src="card.details.dockFrontUrl" @click="setImages(card.details, 0)">
                                            <img v-if="card.details.dockBackUrl" class="image"
                                                 :src="card.details.dockBackUrl" @click="setImages(card.details, 1)">
                                            <img v-if="card.details.dockSelfieUrl" class="image"
                                                 :src="card.details.dockSelfieUrl" @click="setImages(card.details, 2)">
                                        </span>
                  </div>
                  <div class="passport">
                    <p class="passport-text">Документы:</p>
                    <v-btn @click="showDocuments(card.details.documents)">Показать</v-btn>
                  </div>
                </div>
              </div>
              <div class="stepper-box">
                <div class="stepper" v-for="(item, index) in steppers" :key="index">
                                    <span class="step">
                                        <p :class="['step-child', {'active-step' : (index+1)===card.details.step}]">{{item.step}}</p>
                                        <p
                                          :class="['step-child-text', {'active-step-text' : (index+1)===card.details.step}]">{{item.name}}</p>
                                    </span>
                  <v-divider v-if="index!=7"></v-divider>
                </div>
              </div>
              <div class="other-info-child">
                <v-icon color="amber">textsms</v-icon>
                <p v-if="isEditComment!=card.id" class="comment">{{card.description}}</p>
                <span style="width: 625px !important;" v-else class="comment">
                                    <v-textarea
                                      v-model="comment"
                                      label="Комментарий"
                                    ></v-textarea>
                                </span>
                <v-btn icon small v-if="isEditComment!=card.id" @click="editComment(card.description, card.id)">
                  <v-icon color="amber" small>mdi-pencil</v-icon>
                </v-btn>
                <template v-else>
                  <v-btn icon small @click="setComment(card.id)">
                    <v-icon color="green">check</v-icon>
                  </v-btn>
                  <v-btn icon small @click="isEditComment=''">
                    <v-icon color="red darken-1">cancel</v-icon>
                  </v-btn>
                </template>
              </div>
            </div>

          </div>

        </v-card>
      </div>

    </div>
    <vue-gallery-slideshow :images="imageData" :index="index" @close="index = null"></vue-gallery-slideshow>
    <v-dialog v-model="reSubmitDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">{{dialogText}}</v-card-title>
        <p class="reasons-text">Выберите причину:</p>
        <v-card-text style="height: 300px; overflow: auto">
          <v-checkbox class="reasons-box-child" v-model="underWriterId" v-for="(item, index) in reasonsData"
                      :key="index" :label="item.name" :value="item.id"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!isReject" color="blue-grey" style="color: #FFFF;" :loading="loading" text @click="reSubmit">
            Подтвердить
          </v-btn>
          <v-btn v-else color="blue-grey" :loading="loading" style="color: #FFFF;" text @click="reJect">Подтвердить
          </v-btn>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="reSubmitDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="forwardDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">На исполнение</v-card-title>
        <v-select
          v-model="branchId"
          :items="branchData"
          label="Филиал"
          item-text="name"
          item-value="branchId"
          class="branch-select"
        ></v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" :loading="loading" style="color: #FFFF;" text @click="forward">Подтвердить</v-btn>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="forwardDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="branchDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">Сменить филиал</v-card-title>
        <v-select
          v-model="branchId"
          :items="branchData"
          label="Филиал"
          item-text="name"
          item-value="branchId"
          class="branch-select"
        ></v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" :loading="loading" style="color: #FFFF;" text @click="changeBranch">Подтвердить
          </v-btn>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="branchDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="historyDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">История заявки</v-card-title>
        <div class="stepper-box history-box">
          <div class="history-stepper" v-for="(item, index) in historyData" :key="index">
                        <span class="step history-box">
                            <p :class="['step-child', {'active-step' : item.createAt}]">{{index+1}}</p>
                            <span class="divider-box">
                                <v-divider v-if="index!=historyData.length-1" vertical></v-divider>
                            </span>                             
                        </span>
            <span class="history-status">
                            <p :class="['history-status-text', {'active-step-text' : item.createAt}]">{{item.proposalStatus}}</p>
                            <p :class="['history-status-desc', {'active-step-text' : (index+1)===false}]">{{item.statusDesc}}</p>
                            <div class="history-time">{{item.createAt | timestamp-to-date}}</div>

                        </span>
            <span class="history-description">
                            <div class="history-time" v-if="item.username">{{item.username}} (ID: {{item.userId}})</div>
                            <span class="history-time italic">{{item.details.content}}</span>      
                            <span v-if="item.proposalStatus==='REJECTED'" class="history-time italic">{{item.details.steps[0].descriptions[0]}}</span>      
                        </span>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="historyDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="readyDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">Готово</v-card-title>
        <v-text-field counter="16" mask="#### #### #### ####" class="branch-select" label="Номер карты" v-model="pan"
                      required></v-text-field>
        <v-text-field counter="4" mask="##/##" class="branch-select" max-length="4" label="Срок карты" v-model="expiry"
                      required></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" :loading="loading" style="color: #FFFF;" text @click="ready">Подтвердить</v-btn>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="readyDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="successDialog" persistent max-width="560">
      <v-card>
        <v-card-title class="headline">Карта передана</v-card-title>
        <!-- <v-text-field counter="16" mask="#### #### #### ####" class="branch-select" label="Номер карты" v-model="pan" required></v-text-field>   -->
        <v-select
          v-model="type"
          :items="typeData"
          label="Тип"
          class="branch-select"
        ></v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" :loading="loading" style="color: #FFFF;" text @click="success">Подтвердить</v-btn>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="successDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="docDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Отправленные документы</v-card-title>
        <div class="pa-3 d-flex" style="flex-wrap: wrap">
                    <span v-for="(item, index) in documents" :key="index" class="ma-1 d-flex"
                          style="flex-direction: column; flex-wrap: wrap; align-items: center">
                        <p class="mb-0">{{item.documentType}}</p>
                        <p class="document-fieldname">{{item.fieldName}}</p>
                        <a v-if="item.value.split('.')[item.value.split('.').length-1]==='pdf'" :href="item.value">Открыть PDF документ</a>
                        <img v-else @click="setDocImage(item, index)" :src="item.value" width="200px"/>
                        <v-divider/>
                      <!-- <p>{{item.value}}</p>                     -->
                    </span>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="docDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>
<script>
  import VueGallerySlideshow from 'vue-gallery-slideshow';
  import VueContentLoading from 'vue-content-loading';
  import {mapState} from "vuex";

  export default {
    name: 'CardProductOrder',
    components: {
      VueGallerySlideshow, VueContentLoading
    },
    data() {
      return {
        index: null,
        statusData: [],
        search: '',
        pagination: {
          rowsPerPage: 10
        },
        date1: '',
        date2: '',
        fromDate: '',
        toDate: '',
        menu1: false,
        menu2: false,
        usersData: [],
        headers: [
          {text: "ID", value: "id", sortable: false},
          {text: "Имя", value: "firstName", sortable: false},
          {text: "Фамилия", value: "lastName", sortable: false},
          {text: "Номер телефона", value: "phone", sortable: false},
        ],
        isClick: true,
        status: [],
        userId: '',
        dialog: false,
        name: '',
        cardOrderData: [],
        totalPages: '',
        xPage: '',
        curPage: 1,
        steppers: [
          {step: 1, name: 'CARD_TYPE'},
          {step: 2, name: 'CARD_PRODUCT'},
          {step: 3, name: 'SET_OWNER'},
          {step: 4, name: 'UPLOAD_DOCS'},
          {step: 5, name: 'DELIVERY'},
          {step: 6, name: 'ADDRESS'},
          {step: 7, name: 'SET_BRANCH'},
          {step: 8, name: 'PAYMENT'},
        ],
        imageData: [],
        reasonsData: [],
        reSubmitDialog: false,
        forwardDialog: false,
        underWriterId: [],
        proposalId: '',
        isReject: false,
        loading: false,
        branch: '',
        branchId: '',
        branchData: [],
        historyDialog: false,
        historyData: [],
        isHistoryClick: false,
        readyDialog: false,
        branchDialog: false,
        pan: '',
        expiry: '',
        successDialog: false,
        type: '',
        typeData: ['DELIVERED', 'PICKED_UP'],
        isPhone: false,
        isSearchId: false,
        searchId: '',
        isClient: false,
        isDelivery: false,
        isBranchIdData: '',
        isBranchId: false,
        isSearch: false,
        clientRadio: false,
        deliveryRadio: false,
        userSearch: '',
        tmpUsersData: [],
        searchDate: false,
        cardProductData: [],
        isCardProductData: '',
        isCardProduct: false,
        isEditComment: '',
        comment: '',
        isAddComment: false,
        summeryData: {},
        docDialog: false,
        documents: [],
        loader: false,
      }
    },
    filters: {
      checkStatus(val) {
        if (val) {
          return "Да"
        } else {
          return "Нет"
        }
      }
    },
    watch: {
      // status(val){
      //     //console.log(val)
      // }
      date1(val) {
        var tmpTime2 = this.date1.split('-');
        var begTime = new Date(tmpTime2[0], tmpTime2[1] - 1, tmpTime2[2], 0, 0, 0);
        this.fromDate = begTime.getTime();
        // this.getSummery();
      },
      date2(val) {
        //console.log(this.date2)
        var tmpTime1 = this.date2.split('-');
        var endTime = new Date(tmpTime1[0], tmpTime1[1] - 1, tmpTime1[2], 23, 59, 59);
        this.toDate = endTime.getTime();
        //console.log('TODATE: ', this.toDate);
        // this.getSummery();
      },
      expiry(val) {
        //console.log(val)
      },
      curPage(val) {
        if (this.isSearch)
          this.orderSearch(val);
        else
          this.getCardOrder(val);
      },
      underWriterId(val) {
        //console.log(val)
        // //console.log(this.underWriterId)
      },
      reSubmitDialog(val) {
        if (!val) {
          this.underWriterId = [];
          this.proposalId = '';
          this.loading = false;
        }
      },
      branchId(val) {
        //console.log(val)
      },
      historyDialog(val) {
        if (!val) {
          this.isHistoryClick = false;
        }
      },
      readyDialog(val) {
        if (!val) {
          this.pan = '';
          this.expiry = '';
          this.loading = false;

        }
      },
      successDialog(val) {
        if (!val) {
          this.type = '';
          this.loading = false;

        }
      },
      userSearch(val) {
        if (val.length === 0) {
          this.usersData = this.tmpUsersData;
        } else {
          this.usersData = this.usersData.filter((x) => {
            var re = new RegExp(val.toLowerCase() + '.*')
            if (x.phone.toLowerCase().match(re) || x.firstName.toLowerCase().match(re) || x.lastName.toLowerCase().match(re)) {
              return x;
            }
          })
        }
      }
    },
    computed: {
      ...mapState(['prodApiUrl', 'prodApiUrl2']),
      buttonName() {
        if (this.name)
          return "Изменить"
        else
          return "Выбрать"
      },
      dialogText() {
        if (this.isReject) {
          return "Отказ"
        } else {
          return "На переработку"
        }
      },
      likesAllFruit() {
        return this.status.length === this.statusData.length
      },
      likesSomeFruit() {
        return this.status.length > 0 && !this.likesAllFruit
      },
      icon() {
        if (this.likesAllFruit) return 'mdi-close-box'
        if (this.likesSomeFruit) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },
    methods: {
      toggle() {
        this.$nextTick(() => {
          if (this.likesAllFruit) {
            this.status = [];
          } else {
            this.status = this.statusData;
          }
        })
      },
      setDocImage(val, i) {
        var arr = [];
        this.imageData = [];
        // console.log(val, i)
        if (val.value)
          arr.push(val.value)
        this.documents.forEach(x => {
          this.imageData.push(x.value);
        });
        // console.log(this.imageData)
        this.index = i;
      },
      showDocuments(item) {
        this.docDialog = true;
        this.documents = item;
      },
      isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      },
      setComment(val) {
        let self = this;
        var putData = {
          cardProductOrderId: val,
          description: this.comment
        }
        if (this.comment) {
          if (this.isAddComment) {
            self.$http.post(self.prodApiUrl2 + "/card-product-order/info", putData)
              .then((response) => {
                //console.log(response.data.data);
                self.isEditComment = false;
                if (self.isSearch)
                  self.orderSearch(self.xPage);
                else
                  self.getCardOrder(self.xPage);
              }, self.Error);
          } else {
            self.$http.put(self.prodApiUrl2 + "/card-product-order/info", putData)
              .then((response) => {
                //console.log(response.data.data);
                self.isEditComment = false;
                if (self.isSearch)
                  self.orderSearch(self.xPage);
                else
                  self.getCardOrder(self.xPage);
              }, self.Error);
          }
        }

      },
      editComment(val, id) {
        if (val) {
          this.comment = val;
          this.isAddComment = false;
        } else {
          this.comment = '';
          this.isAddComment = true;
        }
        this.isEditComment = id;
      },
      checkDate(val) {
        if (val) {
          return 'создания';
        } else {
          return 'изменения';
        }
      },
      openSuccessBox(id) {
        this.proposalId = id;
        this.successDialog = true;
      },
      openReadyBox(id) {
        this.proposalId = id;
        this.readyDialog = true;
      },
      openBranchBox(item) {
        this.branchDialog = true;
        this.proposalId = item.id;
        if (item.details.branch)
          this.branchId = item.details.branch.id
      },
      openForwardBox(item) {
        this.forwardDialog = true;
        this.proposalId = item.id;
        this.branch = item.details.branch;
        this.branchId = item.details.branch.id
      },
      openRejectBox(id) {
        this.reSubmitDialog = true;
        this.proposalId = id;
        this.isReject = true;
      },
      openResubmitBox(id) {
        this.reSubmitDialog = true;
        this.proposalId = id;
        this.isReject = false;
      },
      setImages(val, i) {
        var arr = [];
        if (val.dockFrontUrl)
          arr.push(val.dockFrontUrl)
        if (val.dockBackUrl)
          arr.push(val.dockBackUrl)
        if (val.dockSelfieUrl)
          arr.push(val.dockSelfieUrl)
        this.imageData = arr;
        this.index = i;
        //console.log(this.imageData)

      },
      getSummery() {
        let self = this;
        var tmpTime = this.date2.split('-');
        this.summeryData = {};
        var endTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 23, 59, 59);
        tmpTime = this.date1.split('-');
        var begTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 0, 0, 0);
        var data = {
          "dateFrom": begTime.getTime(),
          "dateTo": endTime.getTime(),
        };
        self.$http.post(self.prodApiUrl2 + "/card-product-order/summery", data)
          .then((response) => {
            //console.log(response.data.data);
            self.summeryData = response.data.data;
          }, self.Error);
      },
      clean() {
        this.name = '';
        this.userId = '';
      },
      orderStatus() {
        let self = this;
        self.$http.get(self.prodApiUrl2 + "/card-product-order/status")
          .then((response) => {
            //console.log(response.data.data);
            self.statusData = response.data.data;
          }, self.Error);
      },
      getUsers() {
        let self = this;
        self.$http.get(self.prodApiUrl2 + "/card-product-order/user")
          .then((response) => {
            //console.log(response.data.data);
            self.usersData = response.data.data;
            self.tmpUsersData = self.usersData;
            self.usersData.unshift({id: '', firstName: 'Все пользователи', lastName: '', phone: ''})
            //console.log(self.usersData)
          }, self.Error);
      },
      getCardOrder(page) {
        // this.getSummery();
        if (page === 1) {
          this.cardOrderData = [];
          this.curPage = 1;
          this.totalPages = '';
          this.isPhone = false;
          this.isClient = false;
          this.isDelivery = false;
          this.isBranchIdData = '';
          this.isBranchId = false;
          this.isSearch = false;
          this.clientRadio = '';
          this.deliveryRadio = 0;
          this.search = '';
          this.isCardProductData = '';
          this.isCardProduct = false;
          this.searchDate = false;
          this.isSearchId = false;
          this.searchId = '';

        }

        this.isSearch = false;
        this.xPage = page;
        this.cardOrderData = [];
        var tmpTime = this.date2.split('-');
        var endTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 23, 59, 59);
        tmpTime = this.date1.split('-');
        var begTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 0, 0, 0);
        let self = this;
        var postData = {
          "status": this.status,
          "userId": this.userId,
          "dateFrom": begTime.getTime(),
          "dateTo": endTime.getTime(),
          // "date": false,
        }
        self.$http.post(self.prodApiUrl2 + "/card-product-order?page=" + (page - 1) + '&size=5', postData)
          .then((response) => {
            //console.log(response.data.data);
            self.cardOrderData = response.data.data.content;
            if (page === 1) {
              self.totalPages = response.data.data.totalPages;
              //console.log(self.totalPages)
            }
          }, self.Error);
      },
      setUser(user) {
        this.userId = user.id;
        this.dialog = false;
        this.name = user.firstName + ' ' + user.lastName;
      },
      getReasonsList() {
        let self = this;
        self.$http.get(self.prodApiUrl + "/proposal/card-order/under-writer")
          .then((response) => {
            //console.log(response.data.data);
            self.reasonsData = response.data.data;
          }, self.Error);
      },
      getBranchList() {
        let self = this;
        self.$http.get(self.prodApiUrl + "/branch/list")
          .then((response) => {
            //console.log(response.data.data);
            self.branchData = response.data.data;
          }, self.Error);
      },
      reSubmit() {
        let self = this;
        this.loading = true;
        var postData = {
          "underWriterIds": this.underWriterId
        }
        self.$http.post(self.prodApiUrl + `/proposal/card-order/${this.proposalId}/under-writer/resubmit`, postData)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.reSubmitDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);
      },
      reJect() {
        let self = this;
        this.loading = true;
        var postData = {
          "underWriterIds": this.underWriterId
        }
        self.$http.post(self.prodApiUrl + `/proposal/card-order/${this.proposalId}/under-writer/reject`, postData)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.reSubmitDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);

      },
      changeBranch() {
        let self = this;
        this.loading = true;
        self.$http.post(self.$store.getters.apiUrl + `/proposal/card-order/${this.proposalId}/emission/edit/branch?branchId=` + this.branchId)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.branchDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);
      },
      forward() {
        let self = this;
        this.loading = true;
        self.$http.post(self.prodApiUrl + `/proposal/card-order/${this.proposalId}/under-writer/forward?branchId=` + this.branchId)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.forwardDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);
      },
      ready() {
        let self = this;
        this.loading = true;

        var data = {
          "pan": this.pan,
          "expiry": this.expiry.substr(0, 2) + '/' + this.expiry.substr(2, 3)

        }
        // //console.log(data)
        self.$http.post(self.$store.getters.apiUrl + `/proposal/card-order/${this.proposalId}/emission/ready`, data)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.readyDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);
      },
      success() {
        let self = this;
        this.loading = true;
        var data = {
          "type": this.type,
        }
        self.$http.post(self.$store.getters.apiUrl + `/proposal/card-order/${this.proposalId}/delivered?status=` + this.type)
          .then((response) => {
            //console.log(response.data.data);
            if (self.isSearch)
              self.orderSearch(self.xPage);
            else
              self.getCardOrder(self.xPage);
            self.successDialog = false;
            setTimeout(() => {
              self.loading = false;
            }, 1000)
          }, self.Error);
      },
      getHistory(id) {
        this.isHistoryClick = true;
        let self = this;
        self.historyData = [];

        self.$http.get(self.$store.getters.apiUrl + `/proposal/card-order/${id}/status/history`)
          .then((response) => {
            //console.log(response.data.data);
            self.historyData = response.data.data;
            if (self.isHistoryClick)
              self.historyDialog = true;

          }, self.Error);
      },
      orderSearch(page) {
        // this.getSummery();
        var tmpTime = this.date2.split('-');
        var endTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 23, 59, 59);
        tmpTime = this.date1.split('-');
        var begTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 0, 0, 0);
        let self = this;
        var data = {
          status: this.status,
          "userId": this.userId,
          "dateFrom": begTime.getTime(),
          "dateTo": endTime.getTime(),
          // "date" : false,
        };
        this.isSearch = true;
        this.xPage = page;
        this.cardOrderData = [];
        this.loader = true;
        if (page === 1) {
          this.curPage = 1;
          this.totalPages = '';
        }
        if (this.isDelivery) {
          Object.assign(data, {'delivery': this.deliveryRadio})
        } else {
          Object.assign(data, {'delivery': ''})
        }
        if (this.isClient) {
          Object.assign(data, {'client': this.clientRadio})
        } else {
          Object.assign(data, {'client': ''})
        }
        if (this.isBranchId) {
          Object.assign(data, {'branchId': this.isBranchIdData})
        } else {
          Object.assign(data, {'branchId': ''})
        }
        if (this.isCardProduct) {
          Object.assign(data, {'cardProductId': this.isCardProductData})
        } else {
          Object.assign(data, {'cardProductId': ''});
        }
        if (this.isPhone) {
          Object.assign(data, {'phone': this.search})
        } else {
          Object.assign(data, {'phone': ''})
        }
        if (this.isSearchId) {
          Object.assign(data, {'id': parseInt(this.searchId)})
        } else {
          Object.assign(data, {'id': ''})
        }
        self.$http.post(self.prodApiUrl2 + `/card-product-order?page=${page - 1}&size=5`, data)
          .then((response) => {
            //console.log(response.data.data);
            this.loader = false;
            self.cardOrderData = response.data.data.content;
            if (self.cardOrderData.length === 0) {
              self.errorMessage('Не найдено')
            }
            if (page === 1) {
              self.totalPages = response.data.data.totalPages;
              //console.log(self.totalPages)
            }

          }, self.Error);
      },
      getAllCardProducts() {
        let self = this;
        self.$http.get(self.$store.getters.newApiUrl + "/card-product/all")
          .then((response) => {
            //console.log(response.data.data)
            self.cardProductData = response.data.data;

          }, self.Error);
      },
      Error(response) {
        if (response.status === 401) {
          this.loader = false;
          this.redirect('login');
        }
        if (response.status === 423) {
          this.loader = false;
          this.registerDevice();
        }
        this.loader = false;
        this.loading = false;
        this.historyDialog = false
        this.$store.commit('errorMessage', response.data.errorMessage);
      },
    },
    created() {
      var date = new Date();
      // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      var firstDay = new Date('2020', '03', '01')
      this.date1 = firstDay.getFullYear() + '-' + ('0' + (firstDay.getMonth() + 1)).substr(-2) + '-' + ('0' + 1).substr(-2);
      this.date2 = new Date().toISOString().substr(0, 10);
    },
    mounted() {
      this.orderStatus();
      this.getUsers();
      this.getReasonsList();
      this.getBranchList();
      this.getAllCardProducts();
      // this.getHistory(162)
      // this.getSummery();
    }
  }
</script>

<style scoped>
  .italic {
    font-style: italic;
    font-size: 13px;
  }

  .history-description {
    width: 315px;
  }

  .cancelled {
    background: #d46f6f !important;
  }

  .ready {
    background: #42a545 !important;
  }

  .under-writer {
    background: #ff9100 !important;
  }

  .humo {
    background: #1d3446 !important;
  }

  .uzcard {
    background: #f8ca02 !important;
  }

  .visa-gold {
    background: #c7a64e !important;
  }

  .visa-platinum {
    background: #17232f !important;
  }

  .visa-classic {
    background: #c4d4e2 !important;
    color: #2a376d !important;
  }

  .visa-infinite {
    background: #151a1b !important;
  }

  .visa-infinite-value {
    background: #71717185 !important;
  }

  .stat-text {
    margin: 0;
    /* font-style: italic; */
  }

  .stat-header {
    margin: 0 5px;
    text-align: center;
  }

  .card-products-child-value {
    background: #29292936;
    color: #FFFF;
    padding: 6px;
    border-radius: 15px;
    margin: 0 5px 0 0;
    min-width: 50px;
    text-align: center;
  }

  .card-products-child-name {
    font-style: italic;
  }

  .card-products-child {
    margin: 5px;
    padding: 0px 10px 0px 0;
    background: #bbbbbb;
    border-radius: 15px;
    color: #FFFF;
    display: flex;
    align-items: center;
  }

  .card-products {
    display: flex;
    flex-wrap: wrap;
  }

  .statuses {
    display: flex;
    flex-wrap: wrap;
  }

  .statistics {
    padding: 15px;
    background: #FFFF;
    margin: 15px 10px;
    border-radius: 10px;
  }

  .comment {
    margin: 0 0px 0px 5px !important;
    max-width: 625px !important;
    font-style: italic;
  }

  .progress-circular {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-search {
    margin: 0 65px;
  }

  .radio {
    margin: 0;
    padding: 0;
  }

  .phone-input {
    margin: 0 30px;
  }

  .filter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .filter-child {
    display: flex;
    flex-wrap: wrap;
  }

  .search-box-top {
    display: flex;
  }

  .search-btn {
    margin: 0 10px;
    width: 300px;
  }

  .search-box {
    display: flex;
    /* width: 500px; */
    margin: auto;
    padding: 10px 0px 10px 10px;
    background: white;
    border-radius: 10px;
    flex-direction: column;
    margin: 0 10px;
  }

  .delivery {
    /* border-radius: 10px; */
    padding: 10px;
    background: #ff4545;
    color: #FFFF;
  }

  .history-time {
    margin: 0 5px;
  }

  .history-status-text {
    margin: 0 5px;
    color: #000000;
    font-size: 16px;
  }

  .history-status-desc {
    font-size: 13px;
    color: #929292;
    margin: 0 5px;
  }

  .history-status {
    display: flex;
    flex-direction: column;
    width: 200px;
  }

  .divider-box {
    height: 30px;
    margin: 8px;
  }

  .branch-select {
    padding: 5px 20px;
  }

  .reasons-box-child {
    padding: 0 10px;
    margin: 0;
  }

  .reasons-text {
    padding: 0 15px;
    margin: 0;
  }

  .passport {
    margin: 0 10px;
  }

  .passport-text {
    margin: 2px 0px;
    font-style: italic;
  }

  .image {
    max-width: 100px;
    max-height: 155px;
    margin: 5px;
  }

  .border-left {
    border-radius: 10px 0 0 10px;
  }

  .border-right {
    border-radius: 0 10px 10px 0;
  }

  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-details {

  }

  .history-stepper {
    display: flex;
    flex: 1;
  }

  .stepper {
    display: flex;
    flex: 1;
    align-items: center;
  }

  .history-box {
    flex-direction: column;
  }

  .stepper-box {
    display: flex;
    padding: 10px;
    transition: 0.5s;
    overflow: hidden;
  }

  .stepper-box:hover {
    /* box-shadow: 0px 0px 13px 0px rgb(224, 224, 224); */
    border-radius: 14px;
    background: #eaeaea9e;
    overflow: auto
  }

  .step {
    display: flex;
    align-items: center;
  }

  .step-child {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 30px;
    margin: 0 5px;
    background: #4d81bd;
    color: #FFFF;
  }

  .step-child-text {
    margin: 0 5px;
    color: #8c8a8a;
  }

  .active-step {
    background: #f9ca03 !important;
  }

  .active-step-text {
    color: black !important;
    font-weight: 500 !important;
  }

  .info-box {
    display: flex;
  }

  .passport-box {

  }

  .center {
    margin: 10px;
    display: flex;
    justify-content: center;
  }

  .operation-success {
    background: #4caf50;
    padding: 4px 16px;
    border-radius: 17px;
    color: #FFFF;
  }

  .operation-failed {
    background: #ff4545;
    padding: 4px 16px;
    border-radius: 17px;
    color: #FFFF;
  }

  .other-info {
    width: 100%;
    padding: 10px;
  }

  .other-info-child {
    display: flex;
    align-items: center;
  }

  .other-text {
    margin: 2px 0px;
    font-style: italic;
    width: 235px;
  }

  .other-value {
    margin: 2px 0;
    font-weight: 500;
  }

  .card-title {
    /* margin: 10px 10px 0 10px; */
    display: flex;
    align-items: center;
  }

  .card-title-text {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  .card-title-phone {
    margin: 0 10px;
    color: #545454
  }

  .content-cards {
    /* height: 2248px; */
    /* background: black; */
  }

  .card-header {
    display: flex;
    justify-content: space-between;
  }

  .card-header-left {
    padding: 7px;
    background: #E8E8E8;
    border-radius: 0 0 20px 0;
    color: #5d5019;
  }

  .card-header-right {
    padding: 7px;
    background: #E8E8E8;
    border-radius: 0 0 0 20px;
    color: #5d5019;
    width: 200px;
    text-align: center;
  }

  .card {
    margin: 10px;
    /* padding: 10px; */
    /* height: 150px; */
  }

  .change-box {
    opacity: 0;
    transition: 1s;
  }

  .history {
    opacity: 0;
    transition: 0.25s;
    font-size: 23px;
    color: #e8e8e8;
  }

  .history:hover {
    background: silver;
    width: 345px;
    height: 64px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFF;
  }

  .card:hover {
    box-shadow: 0px 0px 13px 0px rgba(120, 120, 120, 1);
    cursor: pointer;
  }

  .card:hover .change-box {
    opacity: 1;
    transition: 1s;
  }

  .card:hover .history {
    opacity: 1;
    /* transition: 1s; */
  }

  .header {
    text-align: center;
  }

  .main {
    width: 100%;
  }

  .param-box {
    width: 500px;
    margin: 25px auto;
    background: #FFFF;
    padding: 19px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
  }

  .get-button {
    margin: auto;
    width: 240px;
  }

  .user-box {
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }

  .user-text {
    margin: 0 10px 0 0;
    font-size: 16px;
    color: #403f3f;
  }

  .user-btn {
    background: #1966bf !important;
    color: #FFFF !important;
    border-radius: 20px;
    cursor: pointer;
  }

  .content-box {
    height: 300px;
    overflow: auto;
    /* padding: 10px; */
  }

  .box {
    display: flex;
    justify-content: center;
  }

  .box:hover {
    background: #899ea9;
    cursor: pointer;
    color: #FFFF;
  }

  .box-child {
    margin: 10px;
    width: 125px;
  }

  .document-fieldname {
    font-size: 13px;
    font-style: italic;
    color: #757575;
  }

  .cash-payment {
    font-size: 20px;
    color: #ff4545;
    font-weight: 600;
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    background: #eaeaea;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .doc-box {
    display: flex;
    flex-direction: column;
  }
</style>
