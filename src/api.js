export default {
  prodApiUrl: 'https://online.kapitalbank.uz/api',
  prodApiUrl2: process.env.NODE_ENV === 'development' ? 'http://localhost:8091/api' : 'http://192.168.132.12:8091/api',
  apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8091/api' : 'http://192.168.132.12:8091/api',
  newApiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8091/api' : 'http://192.168.132.12:8091/api',
  chatApiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8091/api' : 'http://192.168.132.12:8091/api',
  loyaltyUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8091/api' : 'http://192.168.132.12:8091/api',
  api5Url: 'http://192.168.132.5:7072/api',
  avtoApiUrl: 'https://dev.kapitalbank.uz/api',
  apiStomp: 'http://192.168.120.23:8082/ws',
  telegramBotUrl: 'http://192.168.120.9:8077/api',
  ecommerceUrl: 'https://api.kapitalbank.uz/api',
  ucellUrl: 'https://ek.kapitalbank.uz/api',
  ucellApiUrl: 'http://192.168.118.34:8079/api',
  beelineUrl: 'http://192.168.120.22:8078/api',
  newChatApiUrl: 'http://192.168.120.14:8081/api',
}