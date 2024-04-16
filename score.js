const Награда_Количество_За_Блок = 10

class Очки {
    constructor() {
        this.Сброс()
    }

    Сброс() {
        this.Количество = 0
        this.Количество_За_Ход = 0
        this.Количество_За_Блок = 0
    }

    Количество_За_Ход_Изменить() {
        this.Количество_За_Блок += Награда_Количество_За_Блок
        this.Количество_За_Ход += this.Количество_За_Блок
    }

    Количество_Изменить() {
        let Количество_Изначально = this.Количество
        let Количество_Всего = this.Количество + this.Количество_За_Ход
        Анимация_Запустить({
            Продолжительность_Анимации: 0.2,
            Анимация: function (п_Время) {
                this.Количество = Math.floor(Линейная_Интерполяция(Количество_Изначально, Количество_Всего, п_Время))
            }.bind(this),
            Конец_Анимации: function () {
                this.Количество_За_Ход = 0
                this.Количество_За_Блок = 0
            }.bind(this)
        })
    }
}

const Награда_Количество_За_Чистое_Поле = 200

function Очки_За_Чистое_Поле_Получить() {
    Игра_Сцена.Очки.Количество_За_Ход += Награда_Количество_За_Чистое_Поле
}