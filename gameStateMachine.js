class Игра_Структура_Состояния {
    Применить(п_Объект) {
        this.п_Объект = п_Объект
    }
    Обновить(п_Объект) {
        п_Объект.Эффекты_Фона.forEach(п_Элемент => {
            п_Элемент.Обновить()
        })

        п_Объект.Интерфейс.Обновить()

        Рамка_Обновить()
        Объекты_В_Массиве_Обновить(Игра_Сцена.Шары)
        Объекты_В_Массиве_Обновить(Блоки)
        Объекты_В_Массиве_Обновить(Игра_Сцена.Бонусы)
        Шар_Запустить()
    }
    Состояние_Сменить(п_Состояние) {
        this.п_Объект.Состояние_Управление.Состояние_Сменить(п_Состояние)
    }
}

class Игра_Состояние_Управление {
    constructor(п_Объект) {
        this.п_Объект = п_Объект

        this.Структура_Состояния = new Игра_Структура_Состояния(this.п_Объект)
        this.Игра_Состояние_Ожидание = new Игра_Состояние_Ожидание()
        this.Игра_Состояние_Шар_Запущен = new Игра_Состояние_Шар_Запущен()
        this.Игра_Состояние_Ход_Завершение = new Игра_Состояние_Ход_Завершение()
        this.Игра_Состояние_Конец = new Игра_Состояние_Конец()
        this.Игра_Состояние_Пауза = new Игра_Состояние_Пауза()

        this.Текущее_Состояние
    }

    Вызвать(п_Состояние) {
        this.Состояние_Сменить("Ожидание")
    }

    Обновить(п_Объект) {
        this.Структура_Состояния.Обновить(п_Объект)
    }

    Состояние_Сменить(п_Состояние) {
        this.Текущее_Состояние = п_Состояние
        let Состояние
        switch (п_Состояние) {
            case "Ожидание":
                Состояние = this.Игра_Состояние_Ожидание
                break;
            case "Шар_Запущен":
                Состояние = this.Игра_Состояние_Шар_Запущен
                break;
            case "Ход_Завершение":
                Состояние = this.Игра_Состояние_Ход_Завершение
                break;
            case "Пауза":
                Состояние = this.Игра_Состояние_Пауза
                break;
            case "Конец":
                Состояние = this.Игра_Состояние_Конец
                break;
        }
        this.Структура_Состояния = Состояние
        this.Структура_Состояния.Применить(this.п_Объект)
    }
}

class Игра_Состояние_Ожидание extends Игра_Структура_Состояния {

    Применить(п_Объект) {
        super.Применить(п_Объект)
    }

    Состояние_Сменить() {
        super.Состояние_Сменить("Шар_Запущен")
    }

    Обновить(п_Объект) {
        super.Обновить(п_Объект)

        if (Шар_Запущен) {
            this.Состояние_Сменить()
            return
        }

        if (Мышь.Позиция.Y < Нижняя_Граница_Для_Мыши && (Мышь.Позиция.Y > Игра_Сцена.Верхняя_Граница) && Мышь.Клик) {
            let п_Линия = new Линия_Создать({ Начало_Линии_Позиция_X: Игра_Сцена.Шары[0].Коллайдер.Позиция.X, Конец_Линии_Позиция_X: Мышь.Позиция.X, Начало_Линии_Позиция_Y: Игра_Сцена.Шары[0].Коллайдер.Позиция.Y, Конец_Линии_Позиция_Y: Мышь.Позиция.Y, Цвет: "white", Штрих: true })
        }
    }
}

class Игра_Состояние_Шар_Запущен extends Игра_Структура_Состояния {
    Применить(п_Объект) {
        super.Применить(п_Объект)
    }

    Состояние_Сменить() {
        super.Состояние_Сменить("Ход_Завершение")
    }

    Обновить(п_Объект) {
        super.Обновить(п_Объект)
    }
}

class Игра_Состояние_Ход_Завершение extends Игра_Структура_Состояния {
    Применить(п_Объект) {
        super.Применить(п_Объект)
        for (let и = 0; и < п_Объект.Бонусов_Собрано; и++) {
            п_Объект.Шары.push(new Шар())
        }
        п_Объект.Бонусов_Собрано = 0
        Позиция_X_Возврат = п_Объект.Шары[0].Коллайдер.Позиция.X

        for (let и = 1; и < п_Объект.Шары.length; и++) {
            п_Объект.Шары[и].Вернуть_На_Место(Позиция_X_Возврат)
        }

        Шар_Запущен = false
        Запуск_Шаров_Через_Корутину_Создать()

        this.Очередь = this.Генератор()
        this.Очередь.next()
    }

    Генератор = function* () {
        yield this.Поле_Свободно_Проверить()
        yield this.Очки_Зачислить()
        yield this.Блоки_Активировать_Вызвать()
        yield this.Конец_Игры_Проверка()
        yield this.Состояние_Сменить()
    }

    Очки_Зачислить(п_Объект) {
        this.п_Объект.Очки.Количество_Изменить()
        this.Следующая_Операция_Запустить()
    }

    Поле_Свободно_Проверить() {
        if (Блоки.length === 0) {
            Очки_За_Чистое_Поле_Получить()
            Анимация_Запустить({
                Продолжительность_Анимации: 0.5,
                Анимация: function (п_Время) {
                    let п_Текст = new Текст({
                        Текст: `Чистая Работа  \n +200`, Позиция_X: 540, Позиция_Y: 960, Выравнивание_По: "center", Цвет: "white", Тень: true,
                        Размер_Шрифта: Линейная_Интерполяция(50, 100, п_Время), Прозрачность: Линейная_Интерполяция(4, 0, п_Время)
                    }).Обновить()
                }.bind(this),
                Конец_Анимации: function () {
                    this.Следующая_Операция_Запустить()
                }.bind(this)
            })
            return
        }
        this.Следующая_Операция_Запустить()
    }

    Блоки_Активировать_Вызвать() {
        Блоки_Активировать()
        this.Следующая_Операция_Запустить()
    }

    Конец_Игры_Проверка() {
        if (Блоки.length !== 0) {
            if (Блоки[0].Квадрат.Позиция.Y + Блоки[0].Квадрат.Высота >= Игра_Сцена.Нижняя_Граница) {
                this.Состояние_Сменить("Конец")
                return
            } else {
                for (let и = 0; и < Игра_Сцена.Бонусы.length; и++) {
                    let п_Элемент = Игра_Сцена.Бонусы[и]
                    if (п_Элемент.Активный && п_Элемент.Круг.Позиция.Y + 120 >= Игра_Сцена.Нижняя_Граница) {
                        this.Состояние_Сменить("Конец")
                        return
                    }
                }
                this.Следующая_Операция_Запустить()
            }
            return
        }
        this.Следующая_Операция_Запустить()
    }

    Следующая_Операция_Запустить() {
        Анимация_Запустить({
            Продолжительность_Анимации: 0,
            Конец_Анимации: function () {
                this.Очередь.next()
            }.bind(this)
        })
    }

    Состояние_Сменить(п_Состояние = "Ожидание") {
        super.Состояние_Сменить(п_Состояние)
    }

    Обновить(п_Объект) {
        super.Обновить(п_Объект)
    }
}

class Игра_Состояние_Пауза extends Игра_Структура_Состояния {

    Применить(п_Объект) {
        super.Применить(п_Объект)
    }

    Состояние_Сменить() {
    }

    Обновить(п_Объект) {
        this.п_Объект.Интерфейс.Панель_Пауза_Обновить()
    }
}

class Игра_Состояние_Конец extends Игра_Структура_Состояния {

    Применить(п_Объект) {
        super.Применить(п_Объект)
        Лучший_Результат_Проверка()
    }

    Состояние_Сменить() {
    }

    Обновить(п_Объект) {
        п_Объект.Интерфейс_Конец_Игры.Обновить()
    }
}