let И
function Игра_Создать() {
    И = new Игра({
        Ресурсы: {
            Картинки: [
                ["Шар", "assets/sprite/ball.png"],
                ["Кнопка_Возврат_Шара", "assets/sprite/import.png"],
                ["Звезда", "assets/sprite/32x32_Star_1.png"],
                ["Настройки", "assets/sprite/pause.png"],
                ["ЗвукВкл", "assets/sprite/Sound-Three@2x.png"],
                ["ЗвукВыкл", "assets/sprite/Sound-None@2x.png"],
                ["МузыкаВкл", "assets/sprite/Music-On@2x.png"],
                ["МузыкаВыкл", "assets/sprite/Music-Off@2x.png"],
                ["Крестик", "assets/sprite/cross.png"],
                ["Меню", "assets/sprite/home.png"],
                ["Заново", "assets/sprite/return.png"],
            ],
            Аудио: [
                ["Фон", "assets/audio/Back.ogg"],
                ["Бонус", "assets/audio/Trophey.ogg"],
                ["Стена", "assets/audio/touchWall.ogg"],
            ],
            Шрифт: [
                {
                    Название: "FontsLIB",
                    Путь: "assets/font/GolosText_Bold.ttf"
                },
                {
                    Название: "Agua",
                    Путь: "assets/font/AquaWow.otf"
                },
            ]
        },
        Сцены: [Меню_Сцена, Игра_Сцена,],
        Ориентация_Экрана: "Вертикальная",
    })
}

window.onload = function () {
    Игра_Создать()
}