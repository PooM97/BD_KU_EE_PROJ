function dateRfc3339(date) {
    const
    year = date.getFullYear(),
    month = (date.getMonth() + 1),
    day = date.getDate(),
    hours = date.getHours(),
    Minutes = date.getMinutes(),
    Seconds = date.getSeconds(),
    result = year + '-' + month + '-' + day + ' ' + hours + ':' + Minutes + ':' + Seconds
    return result

}
export { dateRfc3339 }