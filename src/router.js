import Vue from 'vue';
import Router from 'vue-router';
import Login from "./views/Login";
import Settings from "./views/Settings";
import Profile from "./views/Profile";
import Deposit from "./views/Deposit";
import DepositProductForm from "./components/deposit/DepositProductForm";
import CurrencyRates from "./views/CurrencyRates";
import Bank from "./views/Bank";
import BankForm from "./components/bank/BankForm";
// import Loan from "./views/Loan";
import PaynetCategory from "./views/PaynetCategory";
import PaynetServices from "./views/PaynetServices";
import PaynetCategoryForm from "./components/paynet/PaynetCategoryForm";
import PaynetServicesForm from "./components/paynet/PaynetServicesForm";
import ServiceCategory from "./components/paynet/ServiceCategory";
import Logs from "./components/logs/Logs";
import Clients from "./components/clients/Clients";
import Chat from "./views/Chat";
import Chatting from "./components/chat/Chatting";
import OperationCodes from "./components/operations/OperationCodes";
import OperationCodesForm from "./components/operations/OperationCodesForm";
import Operations from "./views/Operations";
import CardProduct from "./views/CardProduct";
import Report from "./components/report/Report";
import Chatbot from "./components/chat/Chatbot"
import ReportAllBanks from "./components/report/ReportAllBanks";
import ReportByActiveClients from "./components/report/ReportByActiveClients";
import ReportByTransactions from "./components/report/ReportByTransactions";
import ReportDeposit from "./components/report/ReportDeposit";
import ReportCredit from "./components/report/ReportCredit";
import ReportService from "./components/report/ReportService";
import ReportByClientAndCards from "./components/report/ReportByClientAndCards";
import ReportRegisteredUsers from "./components/report/ReportRegisteredUsers";
import ReportConversion from "./components/report/ReportConversion";
import ReportCrossConversion from "./components/report/ReportCrossConversion";

import Branch from "./views/Branch";
import BranchForm from "./components/branch/BranchForm";
import atm from "./components/atm/atm"
import atmForm from "./components/atm/atmForm";
import ClientForm from "./components/clients/ClientForm";
import ClientCredential from "./components/clients/ClientCredential";
import appVersion from "./components/appVersion/appVersion";
import appVersionForm from "./components/appVersion/appVersionForm";
import BlockedDevices from "./components/blockedDevices/BlockedDevices";
import BlockedAccount from "./components/blockedAccount/BlockedAccount";
import Notification from "./components/notification/Notification";
import NotificationForm from "./components/notification/NotificationForm";
import NotificationStatistics from './components/notification/NotificationStatistics'
import Messages from "./components/messages/Messages";
import MessagesForm from "./components/messages/MessagesForm";
import VipClients from "./components/VipClients/VipClients";
import PartialVipClients from "./components/VipClients/PartialVipClients";
import PartialVipClientsForm from "./components/VipClients/PartialVipClientsForm";

import VipClientsForm from "./components/VipClients/VipClientsForm";
import Limits from "./components/limits/Limits";
import LimitsForm from "./components/limits/LimitsForm";
import ServiceLimits from "./components/limits/ServiceLimits"
import EPOS from "./components/epos/EPOS";
import EPOSform from "./components/epos/EPOSform";
import Commission from "./components/commision/Commission";
import CommissionForm from "./components/commision/CommissionForm";
import DepositType from "./views/DepositType";
import DepositTypeForm from "./components/depositType/DepositTypeForm";
import Story from "./views/Story";
import StoryForm from "./components/story/StoryForm";
import Stories from './views/Stories';
import ExternalServices from "./components/externalServices/ExternalServices";
import CardHistory from "./components/cardHistory/CardHistory";
import TelegramButtons from "./components/telegram/TelegramButtons";
import telegramMessages from "./components/telegram/TelegramMessages";
import telegramSendMessages from "./components/telegram/TelegramSendMessages";
import pivotTable from "./components/report/pivotTable";
import newPivotTable from "./components/report/newPivotTable";
import reportOfDeposit from "./components/report/ReportOfDeposit";
import reportOfCredit from "./components/report/ReportOfCredit";
import reportVisaDirect from "./components/report/ReportVisaDirect";

import eposRevise from "./views/EposRevise.vue"
import Reverse from './views/Reverse.vue'
import FailedRegistration from "./components/report/ReportFailedRegistration";
import ReportUcellComponent from "./components/report/ReportUcellComponent";

import Antifraud from './views/Antifraud';
import ArchiveChat from './components/chat/ArchiveChat'
import ChatStaffMonitoring from './components/chat/ChatStaffMonitoring'
import ChatDataMonitoring from './components/chat/ChatDataMonitoring'
import LoyaltyRecommended from './components/loyalty/LoyaltyRecommended'
import RecommendedStatus from './components/loyalty/RecommendedStatus'
import LoyaltyLevels from './components/loyalty/LoyaltyLevels'
import ServiceProviders from './components/loyalty/ServiceProviders'
import MeasurementUnit from './components/loyalty/MeasurementUnit'
import LoyaltyFilterAccount from './components/loyalty/LoyaltyFilterAccount'
import LoyaltyFilterTariffs from './components/loyalty/LoyaltyFilterTariffs'
import LoyaltyFilterTransactions from './components/loyalty/LoyaltyFilterTransactions'
import specialClients from './components/loyalty/SpecialClients'
import CategoryList from './components/loyalty/CategoryList'
import VirtualCards from './components/virtual/VirtualCards';
import Tariffs from './components/loyalty/Tariffs'
import LoyaltyRates from './components/loyalty/LoyaltyRates'
import LoyaltyBankServices from './components/loyalty/LoyaltyBankServices'
import Bonus from './components/loyalty/Bonus'

import CardProductOrder from './components/cardProduct/CardProductOrder'
import ReportBySummery from './components/cardProduct/ReportBySummery'
import employeeList from './components/employeeList/employeeList';
import employeesList from './components/employeeList/employeesList'
import avtoloan from './views/avtoloan';
import detail from './components/avtoloan/detail';
import Publishings from './views/Publishings';
import terminalAdd from './views/TerminalAdd';
import ShowBalance from './views/ShowBalance';
import UsersByAddedCards from './views/UsersByAddedCards';
import CheckService from './views/CheckService';
import WhiteList from './views/WhiteList';
import ExternalHistoryStatistic from './views/ExternalHistoryStatistic';
import Cache from './views/Cache';
import EposHistory from './views/EposHistory'
import Publication from './views/Publication.vue'
import virtualCardAccountType from './components/cardHistory/VirtualCardAccountType'
import AccountWalletHistory from './components/cardHistory/AccountWalletHistory'
import Faq from './views/Faq'
import virtualCardHistory from './components/cardHistory/VirtualCardHistory'
import ReportRequisite from './components/report/ReportRequisite'
import ReportBeeline from './components/report/ReportBeeline'
import ReportUcell from './components/report/ReportUcell'
import ReportP2pUcell from './components/report/ReportP2pUcell'

import CreditAsia from './components/report/CreditAsia'
import Countries from './views/Countries.vue'
import SocialMedia from './views/SocialMedia.vue'
import LocalPaymentCategory from './views/LocalPaymentCategory.vue'
import MarketProviders from './views/MarketProviders.vue'
import Weather from './views/Weather.vue'
import BannedWords from './views/BannedWords.vue'
import Autonotifications from './views/Autonotifications.vue'


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/reportP2pUcell',
      name: 'ReportP2pUcell',
      component: ReportP2pUcell
    },
    /*{
        path:'/marketProviders',
        name: 'MarketProviders',
        component: MarketProviders
    },*/
    {
      path: '/autonotifications',
      name: 'Autonotifications',
      component: Autonotifications
    },
    /*{
        path:'/bannedWords',
        name: 'BannedWords',
        component: BannedWords
    },*/
    /*{
        path: '/reportUcellComponent',
        name: 'ReportUcellComponent',
        component: ReportUcellComponent
    },*/
    /*{
        path:'/weather',
        name: 'Weather',
        component: Weather
    },*/
    {
      path: '/localPaymentCategory',
      name: 'LocalPaymentCategory',
      component: LocalPaymentCategory
    },
    {
      path: '/reportVisaDirect',
      name: 'reportVisaDirect',
      component: reportVisaDirect
    },
    {
      path: '/socialMedia',
      name: 'SocialMedia',
      component: SocialMedia
    },
    {
      path: '/reportOfDeposit',
      name: 'reportOfDeposit',
      component: reportOfDeposit
    },
    {
      path: '/reportOfCredit',
      name: 'reportOfCredit',
      component: reportOfCredit
    },
    /*{
        path: '/bonus',
        name: 'Bonus',
        component: Bonus
    },*/
    {
      path: '/creditAsia',
      name: 'creditAsia',
      component: CreditAsia
    },
    {
      path: '/countries',
      name: 'Countries',
      component: Countries
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/faq',
      name: 'Faq',
      component: Faq
    },
    /*{
        path: '/publication',
        name: 'Publication',
        component: Publication
    },*/
    {
      path: '/reverse',
      name: 'reverse',
      component: Reverse,
    },
    /*{
        path: '/eposHistory',
        name: 'EposHistory',
        component: EposHistory
    },*/
    {
      path: '/cardProductOrder',
      name: 'CardProductOrder',
      component: CardProductOrder,
    },
    {

      path: '/virtualCardAccountType',
      name: 'VirtualCardAccountType',
      component: virtualCardAccountType,
    },
    {
      path: '/reportRequisite',
      name: 'ReportRequisite',
      component: ReportRequisite,
    },
    /*{
        path: '/whiteList',
        name: 'WhiteList',
        component: WhiteList,
    }, */
    {
      path: '/accountWalletHistory',
      name: 'AccountWalletHistory',
      component: AccountWalletHistory
    },
    /*{
        path: '/reportBeeline',
        name: 'ReportBeeline',
        component: ReportBeeline
    },
    {
        path: '/reportUcell',
        name: 'ReportUcell',
        component: ReportUcell
    },*/
    /*{
        path: '/categoryList',
        name: 'CategoryList',
        component: CategoryList
    },*/
    /*{
        path:'/recommendedStatus',
        name: 'RecommendedStatus',
        component: RecommendedStatus
    },*/
    {
      path: '/virtualCardHistory',
      name: 'virtualCardHistory',
      component: virtualCardHistory
    },
    /*{
        path: '/externalHistoryStatistic',
        name: 'ExternalHistoryStatistic',
        component: ExternalHistoryStatistic,
    },  */
    {
      path: '/cache',
      name: 'Cache',
      component: Cache,
    },
    {
      path: '/usersByAddedCards',
      name: 'usersByAddedCards',
      component: UsersByAddedCards,
    },
    {
      path: '/virtualCards',
      name: 'VirtualCards',
      component: VirtualCards,
    },
    {
      path: '/reportBySummery',
      name: 'ReportBySummery',
      component: ReportBySummery,
    },
    {
      path: '/checkService',
      name: 'CheckService',
      component: CheckService,
    },
    /*{
        path: '/loyaltyRecommended',
        name: 'LoyaltyRecommended',
        component: LoyaltyRecommended
    },*/
    {
      path: '/сhatStaffMonitoring',
      name: 'ChatStaffMonitoring',
      component: ChatStaffMonitoring,
    },
    {
      path: '/chatDataMonitoring',
      name: 'ChatDataMonitoring',
      component: ChatDataMonitoring,
    },
    {
      path: '/showBalance',
      name: 'ShowBalance',
      component: ShowBalance,
    },
    /*{
        path: '/publishings',
        name: 'Publishings',
        component: Publishings,
    },*/
    /*{
        path: '/serviceproviders',
        name: 'ServiceProviders',
        component: ServiceProviders,
    }, */
    /*{
        path: '/specialClients',
        name: 'specialClients',
        component: specialClients
    },*/
    {
      path: '/loyaltyFilterAccount',
      name: 'LoyaltyFilterAccount',
      component: LoyaltyFilterAccount,
    },
    {
      path: '/loyaltyFilterTransactions',
      name: 'LoyaltyFilterTransactions',
      component: LoyaltyFilterTransactions,
    },
    {
      path: '/loyaltyFilterTariffs',
      name: 'LoyaltyFilterTariffs',
      component: LoyaltyFilterTariffs,
    },
    /*{
        path: '/terminalAdd',
        name: 'terminalAdd',
        component: terminalAdd,
    },*/
    /*{
        path: '/levels',
        name: 'LoyaltyLevels',
        component: LoyaltyLevels,
    },*/
    /*{
        path: '/measurementUnit',
        name: 'MeasurementUnit',
        component: MeasurementUnit
    },*/
    /*{
        path: '/loyaltyBankServices',
        name: 'LoyaltyBankServices',
        component: LoyaltyBankServices
    },*/
    /*{
        path: '/tariffs',
        name: 'Tariffs',
        component: Tariffs
    },*/
    /*{
        path: '/loyaltyRates',
        name: 'LoyaltyRates',
        component: LoyaltyRates
    },*/
    {
      path: '/cardProduct',
      name: 'CardProduct',
      component: CardProduct,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: "/currencyRates",
      name: "currencyRates",
      component: CurrencyRates
    },
    {
      path: "/deposit",
      name: "deposit",
      component: Deposit
    },
    {
      path: "/createDeposit",
      name: "DepositProductForm",
      component: DepositProductForm,
      params: true
    },
    {
      path: "/bank",
      name: "bank",
      component: Bank
    },
    {
      path: "/addBank",
      name: "BankForm",
      component: BankForm,
      params: true
    },
    /*{
        path: "/loan",
        name: "loan",
        component: Loan
    },*/
    {
      path: "/paynetCategory",
      name: "PaynetCategory",
      component: PaynetCategory
    },
    {
      path: "/paynetCategoryForm",
      name: "PaynetCategoryForm",
      component: PaynetCategoryForm,
      params: true
    },
    {
      path: "/paynetServices",
      name: "PaynetServices",
      component: PaynetServices
    },
    {
      path: "/paynetServicesForm",
      name: "PaynetServicesForm",
      component: PaynetServicesForm,
      params: true
    },
    {
      path: "/serviceCategory",
      name: "ServiceCategory",
      component: ServiceCategory
    },
    /*{
        path: "/logs",
        name: "Logs",
        component: Logs,
        params: true
    },*/
    {
      path: "/clients",
      name: "clients",
      component: Clients
    },
    {
      path: "/user-white-list",
      component: () => import('@/views/white-list/layout'),
      children: [
        { path: '', name: "userWhiteList", component: () => import('@/views/white-list/index')},
        { path: 'add', name: "userWhiteListAdd", component: () => import('@/views/white-list/add')},
        { path: 'update/:id', name: "userWhiteListUpdate", component: () => import('@/views/white-list/update')}
      ]
    },
    /*{
        path: "/telegrambuttons",
        name: "TelegramButtons",
        component: TelegramButtons,
    },*/
    /*{
        path: '/telegramSendMessages',
        name: 'telegramSendMessages',
        component: telegramSendMessages
    },*/
    /*{
        path: '/telgramMessages',
        name: 'telegramMessages',
        component: telegramMessages,
    },*/
    {
      path: "/chat",
      name: 'chat',
      component: Chat,
      params: true,
    },
    {
      path: "/archivechat",
      name: 'archiveChat',
      component: ArchiveChat
    },
    {
      path: "/chatting",
      name: "chatting",
      component: Chatting
    },
    {
      path: "/chatbot",
      name: "chatbot",
      component: Chatbot
    },
    {
      path: "/operationCodes",
      name: "operationCodes",
      component: OperationCodes
    },
    {
      path: "/operationCodesForm",
      name: "OperationCodesForm",
      component: OperationCodesForm,
      params: true
    },
    {
      path: "/operations",
      name: "operations",
      component: Operations
    },
    {
      path: "/report",
      name: "report",
      component: Report
    },
    {
      path: '/reportByActiveClients',
      name: 'ReportByActiveClients',
      component: ReportByActiveClients
    },
    {
      path: "/reportAllBanks",
      name: "reportAllBanks",
      component: ReportAllBanks
    },
    {
      path: "/reportTransactions",
      name: "reportTransactions",
      component: ReportByTransactions
    },
    {
      path: "/reportDeposit",
      name: "reportDeposit",
      component: ReportDeposit
    },

    {
      path: "/reportCredit",
      name: "reportCredit",
      component: ReportCredit
    },
    {
      path: "/reportService",
      name: "reportService",
      component: ReportService
    },
    {
      path: "/reportClientAndCards",
      name: "reportClientAndCards",
      component: ReportByClientAndCards
    },
    {
      path: "/reportRegisteredUsers",
      name: "reportRegisteredUsers",
      component: ReportRegisteredUsers
    },
    {
      path: "/reportCrossConversion",
      name: "reportCrossConversion",
      component: ReportCrossConversion
    },
    {
      path: "/reportConversion",
      name: "reportConversion",
      component: ReportConversion
    },
    {
      path: "/branch",
      name: "branch",
      component: Branch
    },
    {
      path: "/branchForm",
      name: "branchForm",
      component: BranchForm,
      params: true
    },
    {
      path: "/atm",
      name: "atm",
      component: atm
    },
    {
      path: "/atmForm",
      name: "atmForm",
      component: atmForm,
      params: true
    },
    {
      path: "/clientForm",
      name: "clientForm",
      component: ClientForm
    },
    {
      path: "/clientCredential",
      name: "clientCredential",
      component: ClientCredential
    },
    {
      path: "/appVersion",
      name: "appVersion",
      component: appVersion
    },
    {
      path: "/appVersionForm",
      name: "appVersionForm",
      component: appVersionForm
    },
    {
      path: "/blockedDevices",
      name: "blockedDevices",
      component: BlockedDevices
    },
    {
      path: "/blockedAccount",
      name: "blockedAccount",
      component: BlockedAccount
    },
    {
      path: '/notificationStatistics',
      name: 'notificationStatistics',
      component: NotificationStatistics,
    },
    {
      path: "/notification",
      name: "notification",
      component: Notification
    },
    {
      path: "/notificationForm",
      name: "notificationForm",
      component: NotificationForm
    },
    {
      path: "/messages",
      name: "messages",
      component: Messages
    },
    {
      path: "/messagesForm",
      name: "messagesForm",
      component: MessagesForm
    },

    {
      path: "/partialVipClients",
      name: "PartialVipClients",
      component: PartialVipClients
    },
    {
      path: "/vipClients",
      name: "vipClients",
      component: VipClients
    },
    {
      path: "/vipClientsForm",
      name: "vipClientsForm",
      component: VipClientsForm
    },
    {
      path: "/partialVipClientsForm",
      name: "partialVipClientsForm",
      component: PartialVipClientsForm
    },
    {
      path: "/limits",
      name: "limits",
      component: Limits
    },
    {
      path: "/limitForm",
      name: "limitsForm",
      component: LimitsForm
    },
    {
      path: "/serviceLimits",
      name: "serviceLimits",
      component: ServiceLimits,
    },
    /*{
        path: "/epos",
        name: "epos",
        component: EPOS
    },
    {
        path: "/eposForm",
        name: "eposForm",
        component: EPOSform
    },*/
    {
      path: "/commission",
      name: "commission",
      component: Commission
    },
    {
      path: "/commissionForm",
      name: "commissionForm",
      component: CommissionForm
    },
    {
      path: "/depositType",
      name: "depositType",
      component: DepositType
    },
    {
      path: "/depositTypeForm",
      name: "depositTypeForm",
      component: DepositTypeForm
    },
    /*{
        path: '/stories',
        name: 'Stories',
        component: Stories
    },*/
    {
      path: "/story",
      name: "story",
      component: Story
    },
    {
      path: "/storyForm",
      name: "storyForm",
      component: StoryForm
    },
    {
      path: "/externalServices",
      name: "externalServices",
      component: ExternalServices
    },
    {
      path: "/cardHistory",
      name: "cardHistory",
      component: CardHistory,
      params: true,
    },
    {
      path: "/failedRegistration",
      name: "failedRegistration",
      component: FailedRegistration
    },
    {
      path: "/antifraud",
      name: 'Antifraud',
      component: Antifraud,
    },
    {
      path: "/pivotTable",
      name: 'pivotTable',
      component: pivotTable,
    },
    {
      path: "/newPivotTable",
      name: 'newPivotTable',
      component: newPivotTable,
    },
    /*{
        path: '/eposRevise',
        name: "eposRevise",
        component: eposRevise,
    },*/
    {
      path: '/employeeList',
      name: "employeeList",
      component: employeeList,
    },
    {
      path: '/employeesList',
      name: "employeesList",
      component: employeesList
    },
    {
      path: '/avtoloan',
      name: "avtoloan",
      component: avtoloan,
    },
    {
      path: '/detail',
      name: "detail",
      component: detail,
    }
  ]
});
