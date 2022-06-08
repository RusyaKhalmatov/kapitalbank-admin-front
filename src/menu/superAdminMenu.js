export default [
  {
    title: 'Настройки в Apelsin',
    icon: 'mdi-bank-outline',
    child:[
      {
        title: 'Курсы валют',
        icon: 'attach_money',
        action: 'currencyRates'
      },
      {
        title: 'Депозиты',
        icon: 'mdi-cash-multiple',
        action: 'deposit'
      },
      {
        title: 'Виды Кредитов',
        icon: 'mdi-cash-multiple',
        action: 'depositType'
      },
      {
        title: 'Банки',
        icon: 'mdi-bank-outline',
        child: [
          {
            title: 'Банки',
            icon: 'account_balance',
            action: 'bank',
          },
          {
            title: 'Филиал',
            icon: 'account_balance',
            action: 'branch',
          },
          {
            title: 'ATM',
            icon: 'mdi-map-outline',
            action: 'atm'
          },
        ]
      },
      {
        title: 'Операции',
        icon: 'home',
        action: 'operations'
      },
      {
        title: 'Код Операции',
        icon: 'mdi-file-undo',
        action: 'operationCodes'
      },
      {
        title: 'Комиссии',
        icon: 'mdi-file-table-outline',
        action: 'commission'
      },
      {
        title: 'Внешний Сервис',
        icon: 'mdi-settings-outline',
        action: 'externalServices'
      },
      {
        title: 'Сообщения ошибок',
        icon: 'mdi-android-messages',
        action: 'messages'
      },
      {
        title:'Отображение баланса для сохраненных платежей',
        icon: 'mdi-alpha-p-circle-outline',
        action: 'ShowBalance'
      },
      {
        title: "Paynet",
        icon: "mdi-alpha-p-circle-outline",
        child: [
          {
            title: "Paynet Category",
            icon: "mdi-folder-open",
            action: 'PaynetCategory'
          },
          {
            title: "Paynet Services",
            icon: "mdi-folder-star",
            action: 'PaynetServices'
          }
        ]
      },
      {
        title: "Лимиты",
        icon: "mdi-chart-line",
        child: [
          {
            title: "Лимиты по транзакциям",
            icon: "mdi-chart-line",
            action: "limits"
          },
          {
            title: "Лимиты по сервисам",
            icon: "mdi-chart-line",
            action: "serviceLimits"
          }
        ]

      },
      {
        title: "Версия приложения",
        icon: "mdi-basket-unfill",
        action: 'appVersion'
      },
      {
        title: "Активация епосов",
        icon: "mdi-settings-outline",
        action: "terminalAdd",
      },
      {
        title: "Отмена транзакций",
        icon: "loop",
        action: "reverse",
      },
      {
        title: 'Карта продукта',
        icon: 'credit_card',
        action: 'CardProduct',
      },
      {
        title: 'Заказ карт',
        icon: 'credit_card',
        action: 'CardProductOrder',
      },
      {
        title: 'Программа лояльности',
        icon: 'sentiment_satisfied_alt',
        child:[
          {
            title: 'Уровни лояльности',
            icon: 'equalizer',
            action: 'LoyaltyLevels'
          },
          {
            title: 'Поставщики услуг',
            icon: 'directions_car',
            action: 'ServiceProviders'
          },
          {
            title: 'Банковские услуги',
            icon: 'account_balance',
            action: 'LoyaltyBankServices'
          },
          {
            title: "Единицы измерения",
            icon: "schedule",
            action: "MeasurementUnit"
          },
          {
            title: "Тарифы и Промокоды",
            icon: "attach_money",
            action: "Tariffs"
          },
          {
            title: "Ставки апельсинов",
            icon: "fiber_smart_record",
            action: "LoyaltyRates"
          },
          {
            title: "Специальные клиенты",
            icon: "supervisor_account",
            action: "specialClients",
          },
          {
            title: 'Категории лояльности',
            icon: 'loyalty',
            action: 'CategoryList'
          },
          {
            title: 'Статус рекомендаций лояльности',
            icon: 'loyalty',
            action: 'RecommendedStatus'
          },
          {
            title: 'Рекомендации',
            icon: 'loyalty',
            action: 'LoyaltyRecommended'
          }
        ]
      },
      {
        title: 'Управление кэшем',
        icon: 'cached',
        action: 'Cache'
      },
    ]
  },
  {
    title: 'Маркетинг',
    icon:'mdi-dns-outline',
    child: [
      {
        title: 'PUSH уведомления',
        icon: 'send',
        child:[
          {
            title: 'Отправить PUSH уведомления',
            icon: 'send',
            action: 'notification'
          },
          {
            title: 'Статистика по PUSH уведомлениям',
            icon: 'send',
            action: 'notificationStatistics'
          }
        ]
      },
    ]
  },
  {
    title: 'Call Center',
    icon: 'mdi-file-chart',
    child:[
      {
        title: 'Клиенты',
        icon: 'assignment_ind',
        child: [
          {
            title: 'Клиенты',
            icon: 'mdi-account',
            action: 'clients'
          },
          {
            title: 'VIP-Клиенты',
            icon: 'mdi-account-tie',
            action: 'vipClients'
          },
          {
            title: 'Частичные VIP-клиенты',
            icon: 'mdi-account-tie',
            action: 'PartialVipClients'
          },
          {
            title: 'Список сотрудников',
            icon: 'list',
            action: 'employeesList'
          },
          {
            title: 'По добавленным картам',
            icon: 'mdi-account-tie',
            action: 'usersByAddedCards'
          }
        ]
      },
      {
        title: "Блокировки",
        icon: "mdi-cellphone-lock",
        child: [
          {
            title: "Заблокированный Аккаунт",
            icon: "mdi-account-badge-outline",
            action: "blockedAccount"
          },
          {
            title: "Заблокированные Устройства",
            icon: 'mdi-cellphone-erase',
            action: 'blockedDevices'
          }
        ]
      },
      {
        title: "История по картам",
        icon: "mdi-mail",
        action: "cardHistory"
      },
      {
        title: "Информация об оплате сервиса",
        icon: "mdi-alpha-p-circle-outline",
        action: "CheckService"
      }
    ]
  },
  {
    title: 'Автокредит',
    icon: 'directions_car',
    action: 'avtoloan'
  },
  {
    title: "Отчеты",
    icon: "mdi-file-chart",
    action: "report"
  },
  {
    title: 'Поручения',
    icon: 'mdi-account-badge-outline',
    action: 'assignment'
  }
];
