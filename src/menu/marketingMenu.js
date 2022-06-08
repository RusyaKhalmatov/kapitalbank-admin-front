export default [
  {
    title: 'Отправить PUSH уведомления',
    icon: 'send',
    action: 'notification'
  },
  {
    title: 'Статистика по PUSH уведомлениям',
    icon: 'send',
    action: 'notificationStatistics'
  },
  {
    title: 'Мини объявления',
    icon: 'publish',
    action: 'Publication'
  },
  {
    title: 'Stories',
    icon: 'mdi-dns-outline',
    action: 'Stories'
  },
  {
    title: "Телеграм бот",
    icon: "send",
    child: [
      {
        title: "Отправить сообщение",
        icon: "send",
        action: "telegramSendMessages"
      },
      {
        title: "Настройка кнопок",
        icon: "send",
        action: "TelegramButtons"
      },
      {
        title: 'Список сообщений',
        icon: 'send',
        action: 'telegramMessages',
      }
    ]
  },
];
