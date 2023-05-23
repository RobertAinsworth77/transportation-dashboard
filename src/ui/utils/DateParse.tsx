export const formatDate = (date: Date) => {
    // date to dd/mm/yyyy hh:mm
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let mm = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let yyyy = date.getFullYear();
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if(Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(yyyy) || Number.isNaN(hh) || Number.isNaN(min)) return '--/--/---- --:--';
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:00`;
}

export const getDateForInput = (date: Date) => {
    // date to dd-mm-yyyy
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let mm = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}

export const getTimeForInput = (date: Date) => {
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${hh}:${min}:${ss}`;
}

export const stringToDate = (dateString: string) => {
    var arr: number[] = dateString.split(/-|\s|:/).map((val: string) => parseInt(val));// split string and create array.
    while(arr.length < 5) arr.push(0);
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]); // decrease month value by 1
}

const DateParse = {
    formatDate,
    stringToDate,
    getDateForInput,
    getTimeForInput,
}

export default DateParse;
