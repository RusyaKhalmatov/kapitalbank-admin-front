export default [
  {
    title: "Отчеты",
    icon: "mdi-file-chart",
    action: "report"
  },
  {
    title: 'Клиенты',
    icon: 'mdi-account',
    action: 'clients'
  },
  {
    title: 'Заказ карт',
    icon: 'credit_card',
    action: 'CardProductOrder',
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
];
