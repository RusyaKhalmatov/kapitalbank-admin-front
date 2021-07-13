const menuItems = {
    'SUPER_ADMIN':[
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
                // {
                //     title: 'Кредиты',
                //     icon: 'mdi-cash-refund',
                //     action: 'loan'
                // },
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
                /*{
                    title: 'EPOS',
                    icon: 'mdi-file-table-outline',
                    action: 'epos'
                },*/
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
                /*{
                    title: "Сверка епосов",
                    icon: "mdi-settings-outline",
                    action: "eposRevise",
                },*/
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
                /*{
                    title: 'Публикации',
                    icon: 'publish',
                    action: 'Publishings',
                },*/
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
                /*{
                    title: 'Белый список по скорингу',
                    icon: 'list_alt',
                    action: 'WhiteList'
                },*/
                {
                    title: 'Управление кэшем',
                    icon: 'cached',
                    action: 'Cache'
                },
                // {
                //     title: 'Количество запросов по скорингу',
                //     icon: 'list_alt',
                //     action: 'ExternalHistoryStatistic'
                // }
                

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
                /*{
                    title: 'Stories',
                    icon: 'mdi-dns-outline',
                    action: 'Stories'
                },*/
                /*{
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
                },*/
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
                /*{
                    title: 'Логи для Call Center',
                    icon: 'mdi-file-chart',
                    action: 'Logs'
                },*/
                /*{
                    title: "Chat",
                    icon: "mdi-android-messages",
                    child: [
                        {
                            title: "Chat",
                            icon: 'send',
                            action: 'chatting'
                        },
                        {
                            title: "Архив чат",
                            icon: 'send',
                            action: 'archiveChat'
                        },
                        {
                            title: 'Chatbot',
                            icon: 'send',
                            action: 'chatbot',
                        },
                    ]
                },*/
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
                /*{
                    title: "История по епосам",
                    icon: "mdi-mail",
                    action: "EposHistory"
                },*/
                
                {
                    title: "Виртуальная карта",
                    icon: "cloud",
                    child: [
                        {
                            title: 'История виртуальных карт',
                            icon: 'cloud_upload',
                            action: 'virtualCardHistory'
                        },
                        {
                            title: 'Список виртуальных карт',
                            icon: 'cloud_upload',
                            action: 'VirtualCardAccountType'
                        }
                    ]
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
        // {
        //     title: 'Антифрод',
        //     icon: 'mdi-account-badge-outline',
        //     action: 'Antifraud'
        // }
    ],
    'ADMIN': [
        {
            title: 'Backend-настройки',
            icon: 'mdi-bank-outline',
            child: [
                {
                    title: 'Курсы валют',
                    icon: 'attach_money',
                    action: 'currencyRates'
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
                /*{
                    title: 'EPOS',
                    icon: 'mdi-file-table-outline',
                    action: 'epos'
                },*/
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
                /*{
                    title: "Активация епосов Uzcard",
                    icon: "mdi-settings-outline",
                    action: "terminalAdd",
                },
                {
                    title: "Сверка епосов",
                    icon: "mdi-settings-outline",
                    action: "eposRevise",
                },*/
                {
                    title: "Отмена транзакций",
                    icon: "loop",
                    action: "reverse",
                },
                /*{
                    title: "История по епосам",
                    icon: "mdi-mail",
                    action: "EposHistory"
                },*/
                
                {
                    title: "Виртуальная карта",
                    icon: "cloud",
                    child: [
                        {
                            title: 'История виртуальных карт',
                            icon: 'cloud_upload',
                            action: 'virtualCardHistory'
                        },
                        {
                            title: 'Список виртуальных карт',
                            icon: 'cloud_upload',
                            action: 'VirtualCardAccountType'
                        }
                    ]
                },
                /*{
                    title: 'Белый список по скорингу',
                    icon: 'list_alt',
                    action: 'WhiteList'
                },*/
                {
                    title: 'Управление кэшем',
                    icon: 'cached',
                    action: 'Cache'
                },
                /*{
                    title: 'Управление погодой',
                    icon: 'brightness_7',
                    action: 'Weather'
                },*/
                {
                    title: 'Страны',
                    icon: 'flag',
                    action: 'Countries'
                },
                /*{
                    title: 'Запрещенные слова Visa Direct',
                    icon: 'clear',
                    action: 'BannedWords'
                },*/
                {
                    title: 'Автопушки',
                    icon: 'web',
                    action: 'Autonotifications'
                }
            ]
        },
        {
            title: 'Front-настройки',
            icon: 'mdi-bank-outline',
            child: [
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
                    title: 'Типы Кредитов',
                    icon: 'mdi-cash-multiple',
                    action: 'loanTypeList'
                },
                {
                    title: 'Баннеры',
                    icon: 'mdi-cash-multiple',
                    action: 'backgroundImageList'
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
                    title:'Отображение баланса для сохраненных платежей',
                    icon: 'mdi-alpha-p-circle-outline',
                    action: 'ShowBalance'
                },
                {
                    title: "Paynet",
                    icon: "mdi-alpha-p-circle-outline",
                    child: [
                        {
                            title: "Категории для оплаты на местах",
                            icon: "mdi-folder-open",
                            action: 'LocalPaymentCategory'
                        },
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
                /*{
                    title: 'Поставщики маркетплейса',
                    icon: 'mdi-folder-star',
                    action: 'MarketProviders',
                },*/
                {
                    title: 'Карточные продукты',
                    icon: 'credit_card',
                    action: 'CardProduct',
                },
                /*{
                    title: 'Описание разделов',
                    icon: 'publish',
                    action: 'Publishings',
                },*/
                {
                    title: 'Социальные адреса',
                    icon: 'publish',
                    action: 'SocialMedia'
                },
                /*{
                    title: 'Программа лояльности',
                    icon: 'sentiment_satisfied_alt',
                    child:[
                        {
                            title: 'Начисление баллов',
                            icon: 'fiber_smart_record',
                            action: 'Bonus'
                        },
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
                },*/
            ]
        },
        {
            title: 'Call Center & Front',
            icon: 'mdi-bank-outline',
            child: [
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
                                /*{
                                    title: 'Белый список',
                                    icon: 'mdi-account',
                                    action: 'userWhiteList'
                                },*/
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
                        /*{
                            title: 'Логи для Call Center',
                            icon: 'mdi-file-chart',
                            action: 'Logs'
                        },*/
                        /*{
                            title: "Chat",
                            icon: "mdi-android-messages",
                            child: [
                                {
                                    title: "Chat",
                                    icon: 'send',
                                    action: 'chatting'
                                },
                                {
                                    title: "Архив чат",
                                    icon: 'send',
                                    action: 'archiveChat'
                                },
                                {
                                    title: 'Chatbot',
                                    icon: 'send',
                                    action: 'chatbot',
                                },
                            ]
                        },*/
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
                            title: 'История по счету',
                            icon: 'mdi-mail',
                            action: 'AccountWalletHistory'
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
                        },
                        {
                            title: "FAQ",
                            icon: "help",
                            action: "Faq"                    
                        }
                    ]
                },
                {
                    title: 'Front',
                    icon: 'mdi-file-chart',
                    child: [
                        {
                            title: 'Заказ карты',
                            icon: 'credit_card',
                            action: 'CardProductOrder',
                        },
                        {
                            title: 'Автокредит',
                            icon: 'directions_car',
                            action: 'avtoloan'
                        },
                    ]
                }
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
                /*{
                    title: 'Stories',
                    icon: 'mdi-dns-outline',
                    action: 'Stories'
                },*/
                /*{
                    title: 'Мини объявления',
                    icon: 'publish',
                    action: 'Publication'
                },*/
                /*{
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
                },*/
            ]
        },
        {
            title: "Отчеты",
            icon: "mdi-file-chart",
            action: "report"
        },
        // {
        //     title: 'Антифрод',
        //     icon: 'mdi-account-badge-outline',
        //     action: 'Antifraud'
        // }
    ],
    'MANAGER': [
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
        /*{
            title: 'Запрещенные слова Visa Direct',
            icon: 'clear',
            action: 'BannedWords'
        },*/
        // {
        //     title: 'Антифрод',
        //     icon: 'mdi-account-badge-outline',
        //     action: 'Antifraud'
        // }
    ],
    'HEAD_CALL_CENTER': [
        {
            title: 'Клиенты',
            icon: 'mdi-account',
            action: 'clients'
        },
        {
            title: "Отчеты",
            icon: "mdi-file-chart",
            action: "report"
        },
        /*{
            title: 'Логи для Call Center',
            icon: 'mdi-file-chart',
            action: 'Logs'
        },*/
        {
            title: "Заблокированный Аккаунт",
            icon: "mdi-account",
            action: "blockedAccount"
        },
        {
            title: "Заблокированные Устройства",
            icon: 'mdi-account-badge-outline',
            action: 'blockedDevices'
        },
        {
            title: "Chat",
            icon: 'send',
            action: 'chatting'
        },
        {
            title: "Архив чат",
            icon: 'send',
            action: 'archiveChat'
        },
        {
            title: 'Chatbot',
            icon: 'send',
            action: 'chatbot',
        },
        {
            title: 'История по счету и кошельку',
            icon: 'mdi-mail',
            action: 'AccountWalletHistory'
        },
        {
            title: "История по картам",
            icon: "mdi-mail",
            action: "cardHistory"
        },
        {
            title: 'Пользователи по добавленным картам',
            icon: 'mdi-account-tie',
            action: 'usersByAddedCards'
        },
        {
            title: "Информация об оплате сервиса",
            icon: "mdi-alpha-p-circle-outline",
            action: "CheckService"                    
        },
        {
            title: "Отмена транзакций",
            icon: "loop",
            action: "reverse",
        },
        {
            title: 'Заказ карт',
            icon: 'credit_card',
            action: 'CardProductOrder',
        },
        {
            title: 'Начисление баллов',
            icon: 'fiber_smart_record',
            action: 'Bonus'
        },
    ],
    'CALL_CENTER': [
        {
            title: 'Клиенты',
            icon: 'assignment_ind',
            action: 'clients'
        },
        {
            title: "Отчеты",
            icon: "mdi-file-chart",
            action: "report"
        },
        {
            title: "Заблокированный Аккаунт",
            icon: "mdi-account",
            action: "blockedAccount"
        },
        {
            title: "Заблокированные Устройства",
            icon: 'mdi-account-badge-outline',
            action: 'blockedDevices'
        },
        /*{
            title: 'Логи для Call Center',
            icon: 'mdi-file-chart',
            action: 'Logs'
        },*/
        {
            title: "Chat",
            icon: 'send',
            action: 'chatting'
        },
        {
            title: "Архив чат",
            icon: 'send',
            action: 'archiveChat'
        },
        {
            title: 'История по счету и кошельку',
            icon: 'mdi-mail',
            action: 'AccountWalletHistory'
        },
        {
            title: "История по картам",
            icon: "mdi-mail",
            action: "cardHistory"
        },
        {
            title: 'Пользователи по добавленным картам',
            icon: 'mdi-account-tie',
            action: 'usersByAddedCards'
        },
        {
            title: "Информация об оплате сервиса",
            icon: "mdi-alpha-p-circle-outline",
            action: "CheckService"                    
        },
        /*{
            title: 'Запрещенные слова Visa Direct',
            icon: 'clear',
            action: 'BannedWords'
        },*/
        {
            title: 'Заказ карт',
            icon: 'credit_card',
            action: 'CardProductOrder',
        },
        {
            title: "FAQ",
            icon: "help",
            action: "Faq"                    
        }
    ],
    'MARKETING': [
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
        
    ],
    'PLASTIC_CALL_CENTER' : [
        {
            title: 'Клиенты',
            icon: 'mdi-account',
            action: 'clients'
        },
        {
            title: "Chat",
            icon: 'send',
            action: 'chatting'
        },
    ],
    'FRONT_OFFICE':[
        {
            title: 'Заказ карт',
            icon: 'credit_card',
            action: 'CardProductOrder',
        },
    ],
    'CREDIT_ADMIN':[
        {
            title: 'Автокредит',
            icon: 'directions_car',
            action: 'avtoloan'
        },
    ],
    'MANAGER_REPORT':[       
        {
            title: "Отчет по транзакциям", 
            icon: "mdi-file-chart",            
            action: "reportTransactions"
        },
        {
            title: "Отчет по вкладам", 
            icon: "mdi-file-chart",            
            action: "reportDeposit"
        },
        {
            title: "Отчет по конвертации валют", 
            icon: "mdi-file-chart",            
            action: "reportConversion"
        },
        /*{
            title: "Отчет по кросс-конвертации валют", 
            icon: "mdi-file-chart",            
            action: "reportCrossConversion"
        },*/
        {
            title: "Отчеты Paynet", 
            icon: "mdi-file-chart",            
            action: "reportService"
        }        
    ]
};
export default menuItems;
