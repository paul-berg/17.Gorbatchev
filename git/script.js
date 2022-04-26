// "Создать форму - 2 инпута даты и кнопка ""Рассчитать"". При нажатии на кнопку получить курс доллара с сайта нацбанка на все даты в диапазоне и вывести на интерфейс дату с минимальным и максимальным курсами(с указанием курса). Кнопку можно нажать только есть обе даты введены и диапазон корректен (то есть левая дата меньше правой). Одним запросом можно получать курс только на один день(нельзя использовать эндпоинт на получение курсов на диапазон дат)
// ДЗ разместить на GIT скинуть ссылку на репозиторий"
function createDate(dateValueMs) {
    let currentDate
    if (dateValueMs) {
        currentDate = new Date(dateValueMs)
    } else {
        currentDate = new Date()
    }
    let currentDay = currentDate.getDate()
    if (currentDay < 10) {
        currentDay = `0${currentDay}`
    }
    let currentMonth = currentDate.getMonth() + 1
    if (currentMonth < 10) {
        currentMonth = `0${currentMonth}`
    }
    let currentYear = currentDate.getFullYear()
    return `${currentYear}-${currentMonth}-${currentDay}`
}
let maxDate = createDate()
document.querySelector('#count').addEventListener('click', () => {
    let dateFrom = document.querySelector('#dateFrom').value
    let dateTo = document.querySelector('#dateTo').value
    if ((dateFrom || dateTo) > maxDate || dateFrom > dateTo || (dateFrom || dateTo) === '') {
        return
    }
    function getDates(dateFrom, dateTo) {
        let arrayOfDates = []
        let startDateMs = Date.parse(dateFrom)
        while (startDateMs <= Date.parse(dateTo)) {
            startDateMs += 24 * 3600 * 1000
            let date = createDate(startDateMs)
            arrayOfDates.push(date)
        }
        return arrayOfDates
    }
    getDates(dateFrom, dateTo)
    let getFetchList = getDates(dateFrom, dateTo).map(date => fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`).then(response => response.json()).then(response => response.Cur_OfficialRate))
    Promise.all(getFetchList).then(rates => {
        let datesWithRates = {}
        rates.forEach((el, ind) => {
            datesWithRates[getDates(dateFrom, dateTo)[ind]] = el
        })
        let minRate = datesWithRates[getDates(dateFrom, dateTo)[0]]
        let maxRate = datesWithRates[getDates(dateFrom, dateTo)[0]]
        let minRateDate = getDates(dateFrom, dateTo)[0]
        let maxRateDate = getDates(dateFrom, dateTo)[0]
        for (key in datesWithRates) {
            if (datesWithRates[key] > maxRate) {
                maxRate = datesWithRates[key]
                maxRateDate = key
            } else if (datesWithRates[key] < minRate) {
                minRate = datesWithRates[key]
                minRateDate = key
            }
        }
        document.querySelector('#out').innerHTML = `min USD rate: ${maxRate}. It was ${minRateDate.replaceAll('-', '.')} </br> max USD rate: ${maxRate}. It was ${maxRateDate.replaceAll('-', '.')}`
    })
})

