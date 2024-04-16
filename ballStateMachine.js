class Шар_Структура_Состояния {
    Применить(п_Объект) {
        this.п_Объект = п_Объект
    }
    Обновить(п_Объект) {
        п_Объект.Коллайдер.Обновить()
        п_Объект.Спрайт.Позиция.X = п_Объект.Коллайдер.Позиция.X
        п_Объект.Спрайт.Позиция.Y = п_Объект.Коллайдер.Позиция.Y
        п_Объект.Спрайт.Обновить()
    }
    Состояние_Сменить(п_Состояние) {
        this.п_Объект.Состояние_Управление.Состояние_Сменить(п_Состояние)
    }
}

class Шар_Состояние_Управление {
    constructor(п_Объект) {
        this.п_Объект = п_Объект
        this.Структура_Состояния = new Шар_Структура_Состояния(this.п_Объект)
        this.Ожидание = new Шар_Состояние_Ожидание()
        this.Движение = new Шар_Состояние_Движение()
    }

    Вызвать(п_Состояние) {
        this.Состояние_Сменить("Ожидание")
    }

    Обновить(п_Объект) {
        this.Структура_Состояния.Обновить(п_Объект)
    }

    Состояние_Сменить(п_Состояние) {
        let Состояние

        switch (п_Состояние) {
            case "Ожидание":
                Состояние = this.Ожидание
                break;
            case "Движение":
                Состояние = this.Движение
                break;
        }
        this.Структура_Состояния = Состояние
        this.Структура_Состояния.Применить(this.п_Объект)
    }
}

class Шар_Состояние_Ожидание extends Шар_Структура_Состояния {

    Применить(п_Объект) {
        super.Применить(п_Объект)
        п_Объект.Спрайт.Скорость_По_X = 0
        п_Объект.Спрайт.Скорость_По_Y = 0
    }

    Состояние_Сменить() {
        super.Состояние_Сменить("Движение")
    }

    Обновить(п_Объект) {
        super.Обновить(п_Объект)
        if (!п_Объект.Запущен) {
            if (!п_Объект.На_Земле && (п_Объект.Коллайдер.Позиция.Y < Игра_Сцена.Нижняя_Граница - п_Объект.Коллайдер.Радиус)
            ) {
                п_Объект.Запущен = true
                this.Состояние_Сменить()
            }
            return
        }
    }
}

class Шар_Состояние_Движение extends Шар_Структура_Состояния {

    Применить(п_Объект) {
        super.Применить(п_Объект)
    }

    Состояние_Сменить() {
        super.Состояние_Сменить("Ожидание")
    }

    Обновить(п_Объект) {
        super.Обновить(п_Объект)

        for (let и = 0; и < Блоки.length; и++) {
            if (Столкновение_Определить(Блоки[и].Квадрат, п_Объект.Коллайдер)) {
                п_Объект.Стена = ""

                if (п_Объект.Объект_Косания === Блоки[и].Квадрат)
                    return

                let Кол = { Позиция_X: (Блоки[и].Квадрат.Позиция.X + Блоки[и].Квадрат.Ширина / 2) - п_Объект.Коллайдер.Позиция.X, Позиция_Y: (Блоки[и].Квадрат.Позиция.Y + Блоки[и].Квадрат.Высота / 2) - п_Объект.Коллайдер.Позиция.Y }
                let Дистанция = Math.sqrt(((Блоки[и].Квадрат.Позиция.X + Блоки[и].Квадрат.Ширина / 2) - п_Объект.Коллайдер.Позиция.X) * ((Блоки[и].Квадрат.Позиция.X + Блоки[и].Квадрат.Ширина / 2) - п_Объект.Коллайдер.Позиция.X) + ((Блоки[и].Квадрат.Позиция.Y + Блоки[и].Квадрат.Высота / 2) - п_Объект.Коллайдер.Позиция.Y) * ((Блоки[и].Квадрат.Позиция.Y + Блоки[и].Квадрат.Высота / 2) - п_Объект.Коллайдер.Позиция.Y))
                let КолНорм = { Позиция_X: Округление_Числа((Кол.Позиция_X / Дистанция), 1), Позиция_Y: Округление_Числа((Кол.Позиция_Y / Дистанция), 1) }

                if (КолНорм.Позиция_Y >= 0.6 || КолНорм.Позиция_Y <= -0.6) {
                    if (КолНорм.Позиция_X == -0.8 || КолНорм.Позиция_X == 0.8) {
                        п_Объект.Коллайдер.Скорость_По_X *= -1
                        п_Объект.Коллайдер.Скорость_По_Y *= -1
                    }
                    else if (КолНорм.Позиция_X < -0.8 || КолНорм.Позиция_X > 0.8) {
                        п_Объект.Изменить_Направление_Движения("X")
                    } else {
                        п_Объект.Изменить_Направление_Движения("Y")
                    }

                    п_Объект.Объект_Косания = Блоки[и].Квадрат
                    Блоки[и].Здоровье_Уменьшить()
                } else {
                    п_Объект.Изменить_Направление_Движения("X")
                    п_Объект.Объект_Косания = Блоки[и].Квадрат
                    Блоки[и].Здоровье_Уменьшить()
                }
                return
            }
        }

        if (Игра_Сцена.Бонусы.length > 0) {
            for (let и = 0; и < Игра_Сцена.Бонусы.length; и++) {
                let п_Элемент = Игра_Сцена.Бонусы[и]
                if (!п_Элемент.Активный) {
                    continue
                }
                if (Столкновение_Определить(п_Элемент.Круг, п_Объект.Коллайдер)) {
                    п_Элемент.Собрать()
                }
            }
        }
        if ((п_Объект.Коллайдер.Позиция.X + п_Объект.Коллайдер.Радиус >= 1080)) {
            if (п_Объект.Стена !== Стены.Правая)
                п_Объект.Изменить_Направление_Движения("X")

            п_Объект.Стена = Стены.Правая
            п_Объект.Объект_Косания = {}
            return

        } else if ((п_Объект.Коллайдер.Позиция.X - п_Объект.Коллайдер.Радиус <= 0)) {
            if (п_Объект.Стена !== Стены.Левая)
                п_Объект.Изменить_Направление_Движения("X")

            п_Объект.Стена = Стены.Левая
            п_Объект.Объект_Косания = {}
            return

        } else if (п_Объект.Коллайдер.Позиция.Y - п_Объект.Коллайдер.Радиус <= Игра_Сцена.Верхняя_Граница) {
            if (п_Объект.Стена !== Стены.Верхняя)
                п_Объект.Изменить_Направление_Движения("Y")

            п_Объект.Стена = Стены.Верхняя
            п_Объект.Объект_Косания = {}
            return

        }
        else if (п_Объект.Коллайдер.Позиция.Y + п_Объект.Коллайдер.Радиус / 2 >= Игра_Сцена.Нижняя_Граница) {
            п_Объект.Коллайдер.Скорость_По_X = 0
            п_Объект.Коллайдер.Скорость_По_Y = 0
            п_Объект.Коллайдер.Позиция.Y = п_Объект.Начальная_Позиция.Позиция_Y
            п_Объект.Запущен = false
            п_Объект.На_Земле = true
            Шары_Коснулись_Земли_Проверка()
            п_Объект.Объект_Косания = {}
            п_Объект.Стена = {}
            this.Состояние_Сменить()
            return
        }
    }
}