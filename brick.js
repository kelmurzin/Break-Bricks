class Блок {
    constructor({ Позиция_X, Позиция_Y, Здоровье, }) {
        this.Значение_H = 70
        this.Квадрат = new Квадрат({
            Позиция_X: 20 + Позиция_X, Позиция_Y: Позиция_Y, Ширина: 165, Высота: 120, Цвет: `hsl(${this.Значение_H}, 100%, 50%)`, Прозрачность: 0.9, Обводка: true, Толщина_Линии_Обводки: 7,
            Закргулить_Углы: true,
        }).Коллайдер_Добавить()
        this.Здоровье = Здоровье
        this.Здоровье_Текст = new Текст({ Текст: this.Здоровье + "", Выравнивание_По: "center", Размер_Шрифта: 50, Цвет: "white", Базовая_Линия: "middle", Тень: true })
        this.Активный = true
        this.Очки_За_Ход = 0
        this.Цвет_Применить()
        this.Время_Эффекта_Косания = 0
    }

    Здоровье_Уменьшить() {
        this.Здоровье--
        this.Здоровье_Текст.Текст = this.Здоровье + ""
        if (this.Здоровье <= 0 && this.Активный) {
            Игра_Сцена.Очки.Количество_За_Ход_Изменить()
            this.Эффект_Активировать()
            Массив_Удалить_Элемент(Блоки, Индекс_В_Массиве_По_Элементу_Получить(Блоки, this))
            return
        }
        this.Время_Эффекта_Косания = 5
        this.Цвет_Применить()
    }

    Цвет_Применить() {
        this.Значение_H = 70 + (this.Здоровье * 10)
        this.Квадрат.Цвет = `hsl(${this.Значение_H}, 70%, 50%)`
    }

    Эффект_Активировать() {
        const Позиция_X = this.Квадрат.Центр_Получить().Позиция.X
        const Позиция_Y = this.Квадрат.Центр_Получить().Позиция.Y
        Эффект_Уничтожения_Блока_Активировать(Позиция_X, Позиция_Y)
        Эффект_Уничтожение_Блока_Очки_Активировать(Позиция_X, Позиция_Y)
    }

    Текст_Здоровье_Обновить() {
        this.Здоровье_Текст.Позиция.X = this.Квадрат.Центр_Получить().Позиция.X
        this.Здоровье_Текст.Позиция.Y = this.Квадрат.Центр_Получить().Позиция.Y
        this.Здоровье_Текст.Обновить()
    }

    Обновить() {
        this.Квадрат.Обновить()

        this.Текст_Здоровье_Обновить()

        if (this.Время_Эффекта_Косания > 0) {
            this.Время_Эффекта_Косания -= 1
            this.Квадрат.Цвет_Обводки = "white"
        } else {
            this.Квадрат.Цвет_Обводки = `hsl(${this.Значение_H - 5}, 70%, 50%)`
        }
    }
}

let Блоки = []
let Индексы_Создаваемых_Блоков = []
let Пустой_Блок

const Создание_Позиция_Y = 330
const Увеличение_Шага = 175

function Блоки_Активировать() {
    Получить_Индексы_Блоков()
    let Шаг_X = 0
    Пустой_Блок = Значение_Получить_Случайное(1, 5)
    Игра_Сцена.Ход++
    for (let и = 0; и < 6; и++) {
        for (let к = 0; к < Индексы_Создаваемых_Блоков.length; к++) {
            if (и === Индексы_Создаваемых_Блоков[к]) {
                Блоки.push(new Блок({ Позиция_X: Шаг_X, Позиция_Y: Создание_Позиция_Y, Здоровье: Игра_Сцена.Ход }))
            }
        }
        if (и == Индекс_Бонуса) {
            for (const п_Элемент of Игра_Сцена.Бонусы) {
                if (!п_Элемент.Активный) {
                    п_Элемент.Активировать(Шаг_X, Создание_Позиция_Y)
                    break
                }
            }
        }
        Шаг_X += Увеличение_Шага
    }
    Блоки_Сдвинуть()
}
let И_Блоков
let Индекс_Бонуса

function Получить_Индексы_Блоков() {
    И_Блоков = [0, 1, 2, 3, 4, 5]
    Индексы_Создаваемых_Блоков = []

    let Количество_Блоков_На_Ходу = Количество_Блоков_На_Ходу_Получить()

    for (let и = 0; и < Количество_Блоков_На_Ходу; и++) {
        let Случайный_Индекс_Блока = Элемент_В_Массиве_Получить_Случайный(И_Блоков)
        Индексы_Создаваемых_Блоков.push(Случайный_Индекс_Блока)
        Массив_Удалить_Элемент(И_Блоков, Индекс_В_Массиве_По_Элементу_Получить(И_Блоков, Случайный_Индекс_Блока))
    }
    Индекс_Бонуса = Индекс_Для_Бонуса()
}

function Индекс_Для_Бонуса() {
    return Элемент_В_Массиве_Получить_Случайный(И_Блоков)
}

function Количество_Блоков_На_Ходу_Получить() {
    let п_Макс_Количество_Блоков
    let п_Мин_Количество_Блоков = 1
    if (Игра_Сцена.Ход < 5) {
        п_Макс_Количество_Блоков = 2
    } else if (Игра_Сцена.Ход < 15) {
        п_Макс_Количество_Блоков = 3
        п_Мин_Количество_Блоков = 2
    } else if (Игра_Сцена.Ход < 50) {
        п_Макс_Количество_Блоков = 4
        п_Мин_Количество_Блоков = 3
    } else {
        п_Макс_Количество_Блоков = 5
        п_Мин_Количество_Блоков = 4
    }

    return Значение_Получить_Случайное(п_Мин_Количество_Блоков, п_Макс_Количество_Блоков)
}


function Блоки_Сдвинуть() {
    for (let и = 0; и < Блоки.length; и++) {
        Блоки[и].Квадрат.Позиция.Y += 130
    }
    for (let и = 0; и < Игра_Сцена.Бонусы.length; и++) {
        Игра_Сцена.Бонусы[и].Круг.Позиция.Y += 130
    }
}