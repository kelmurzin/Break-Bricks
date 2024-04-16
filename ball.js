class Шар {
    constructor() {
        this.Начальная_Позиция = {
            Позиция_X: 540,
            Позиция_Y: 1600
        }

        this.Спрайт = new Спрайт({ Позиция_X: this.Начальная_Позиция.Позиция_X, Позиция_Y: this.Начальная_Позиция.Позиция_Y, Картинка: Картинки.Шар, Якорь: 0.5 }).Коллайдер_Добавить()
        this.Коллайдер = new Круг({ Позиция_X: this.Начальная_Позиция.Позиция_X, Позиция_Y: this.Начальная_Позиция.Позиция_Y, Радиус: 16, Прозрачность: 0, }).Коллайдер_Добавить()
        this.Запущен = false
        this.Скорость_Шара = 18
        this.На_Земле = true
        this.Объект_Косания = {}
        this.Стена = ""

        this.Состояние_Управление = new Шар_Состояние_Управление(this)
        this.Состояние_Управление.Вызвать()
    }

    Запустить_Шар(Позиция_X, Позиция_Y) {
        let Угол_Направления_Шара = Math.atan2(
            Позиция_Y +
            Мышь.Высота / 2 - (this.Коллайдер.Позиция.Y + this.Коллайдер.Радиус / 2),
            Позиция_X + Мышь.Ширина / 2 - (this.Коллайдер.Позиция.X + this.Коллайдер.Радиус / 2)
        )
        let Направление_Шара = {
            Направление_X: Math.cos(Угол_Направления_Шара) * this.Скорость_Шара,
            Направление_Y: Math.sin(Угол_Направления_Шара) * this.Скорость_Шара,
        }

        this.На_Земле = false
        this.Коллайдер.Скорость_По_X = Направление_Шара.Направление_X
        this.Коллайдер.Скорость_По_Y = Направление_Шара.Направление_Y
    }

    Изменить_Направление_Движения(п_Направление) {
        if (п_Направление == "X")
            this.Коллайдер.Скорость_По_X *= -1
        else
            this.Коллайдер.Скорость_По_Y *= -1
            Звук_Стена_Запустить()
    }

    Вернуть_На_Место(Позиция_X = "") {
        this.Коллайдер.Скорость_По_X = 0
        this.Коллайдер.Скорость_По_Y = 0
        this.Позиции_Применить(Позиция_X)
        this.Запущен = false
        this.На_Земле = true
        this.Объект_Косания = {}
        this.Стена = ""
    }

    Позиции_Применить(Позиция_X) {
        this.Коллайдер.Позиция.Y = this.Начальная_Позиция.Позиция_Y
        this.Коллайдер.Позиция.X = Позиция_X || this.Начальная_Позиция.Позиция_X
    }

    Обновить() {
        this.Состояние_Управление.Обновить(this)
    }
}

const Стены = {
    Левая: "Левая",
    Правая: "Правая",
    Верхняя: "Верхняя"
} 