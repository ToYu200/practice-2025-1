var express = require("express")
var app = express()
var bodyParser = require("body-parser")
const axios = require("axios")

app.use(bodyParser.json()) // for parsing application/json
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post("/new-message", async function(req, res) {
    console.log("Получен запрос от Telegram:", JSON.stringify(req.body, null, 2));
    const { message } = req.body;

    if (!message || !message.text) {
        return res.end();
    }

    // Кнопки меню
    const keyboard = {
        keyboard: [
            [{ text: "Главная" }, { text: "О проекте" }],
            [{ text: "Участники" }, { text: "Журнал" }],
            [{ text: "Ресурсы" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };

    let reply = "Выберите пункт меню:";
    let extraMarkup = keyboard;
    // Кнопка "Узнать больше о проекте"
    if (message.text === "Главная") {
        // Сначала отправляем фото
        await axios.post(
            `https://api.telegram.org/bot7989202853:AAFwWZaYwnRhfYrOmUEi-CjFkpaHsMEUj80/sendPhoto`,
            {
                chat_id: message.chat.id,
                photo: "https://practice-2025.onrender.com/images/car.png",
                caption: "Беспилотная KIA Ceed для Робокросса\n\nПроект по созданию автономного автомобиля на базе KIA Ceed для участия в мероприятии «Робокросс». Используем современные технологии навигации, компьютерного зрения и управления."
            }
        );
        // Затем отправляем кнопку
        reply = "";
        extraMarkup = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Узнать больше о проекте", callback_data: "about_project" }]
                ]
            }
        };
    } else if (message.text === "О проекте") {
        reply = "*Цель и задачи проекта*\n\n" +
            "Цель проекта — разработка и внедрение исполнительных механизмов (актуатор тормоза, рулевое управление, трансмиссия) " +
            "в систему управления беспилотным транспортным средством, а также создание и отладка программного обеспечения для их работы.\n\n" +
            "*Основные задачи:*\n" +
            "• Интеграция и тестирование исполнительных механизмов\n" +
            "• Разработка и сборка схем подключения\n" +
            "• Создание и отладка программного обеспечения\n" +
            "• Проведение испытаний и анализ результатов\n" +
            "• Оформление технической документации\n\n" +
            "*О предприятии и партнёрах*\n" +
            "Практика проходила на базе Московского Политеха, кафедра «СМАРТ-технологии». " +
            "В работе учитывался опыт ведущих компаний отрасли, таких как Яндекс.Беспилотники.\n\n" +
            "*Техническая часть*\n" +
            "В ходе работы использовались:\n" +
            "• Электромеханический актуатор тормоза 01KS3-12-20-200-IP65\n" +
            "• Плата Arduino Mega ADK\n" +
            "• Драйвер BTS7960";

        extraMarkup = {
            reply_markup: {
                ...keyboard,
                parse_mode: "Markdown"
            }
        };
    } else if (message.text === "Участники") {
        reply = "*Команда проекта:*\n\n" +
            "👨‍💼 *Кухаренко Александр*\n" +
            "Тимлид нашей команды\n\n" +
            "👨‍💻 *Андреев Анатолий*\n" +
            "Разработка модели Webots, написание кода для Arduino, подключение к актуатору, рефакторинг кода\n\n" +
            "👨‍🔧 *Буторов Никита*\n" +
            "Тестирование актуатора, написание отчётов, составление электросхемы";
        
        extraMarkup = {
            reply_markup: {
                ...keyboard,
                parse_mode: "Markdown"
            }
        };
    } else if (message.text === "Журнал") {
        reply = "Журнал проекта\n\n" +
            "1 марта 2025 — Запуск проекта и формирование команды\n" +
            "Сформирована команда, определены цели и задачи, начат сбор информации.\n\n" +
            "12 марта 2025 — Создана 3D-модель для Webots\n" +
            "Webots — это приложение с открытым исходным кодом, используемое для моделирования роботов.\n\n" +
            "10 апреля 2025 — Получено управление актуатором тормоза\n" +
            "Получили управление актуатором тормоза через Arduino.";
        extraMarkup = keyboard;
    } else if (message.text === "Ресурсы") {
        reply = "*Полезные ресурсы:*\n\n" +
            "*Документация:*\n" +
            "• ГОСТ Р 58808-2020 Транспорт беспилотный\n" +
            "• ГОСТ 2.701-2008 ЕСКД\n" +
            "• Техническая документация на актуатор\n" +
            "• Datasheet на драйвер BTS 7960\n" +
            "• Руководство Arduino Mega ADK\n\n" +
            "*Литература:*\n" +
            "• Петров А.В. Беспилотные транспортные системы\n" +
            "• Сидоров И.Н. Микроконтроллеры в системах\n" +
            "• Козлов Д.А. Алгоритмы управления\n\n" +
            "*Ссылки:*\n" +
            "• [Официальный сайт Робокросса](http://robocross.ru)\n" +
            "• [Arduino](http://arduino.cc)\n" +
            "• [НИИАС](http://www.vniias.ru)";

        extraMarkup = {
            reply_markup: {
                ...keyboard,
                parse_mode: "Markdown"
            }
        };
    }

    try {
        await axios.post(
            `https://api.telegram.org/bot7989202853:AAFwWZaYwnRhfYrOmUEi-CjFkpaHsMEUj80/sendMessage`,
            {
                chat_id: message.chat.id,
                text: reply,
                ...extraMarkup
            }
        );
        console.log("Message posted");
        res.end("ok");
    } catch (err) {
        console.log("Error :", err);
        res.end("Error :" + err);
    }
});

// Обработка нажатий на inline-кнопки
app.post("/new-message", async function(req, res, next) {
    if (req.body.callback_query) {
        const { callback_query } = req.body;
        if (callback_query.data === "about_project") {
            await axios.post(
                `https://api.telegram.org/bot7989202853:AAFwWZaYwnRhfYrOmUEi-CjFkpaHsMEUj80/sendMessage`,
                {
                    chat_id: callback_query.message.chat.id,
                    text: "Это проект для демонстрации Telegram-бота на Node.js.",
                    reply_markup: keyboard
                }
            );
        }
        return res.end();
    }
    next && next();
});

// Finally, start our server
app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
})