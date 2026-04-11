// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: plug;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eLicznik = false;
const COLOR_WHITE = new Color('#FFFFFF');
const COLOR_BLACK = new Color('#000000');
const COLOR_GREEN = new Color('#93B223');
const COLOR_YELLOW = new Color('#FFD028');
const COLOR_RED = new Color('#FF4D4D');
void displayWidget(eLicznik);
async function displayWidget(eLicznik) {
    const url = eLicznik
        ? 'shortcuts://run-shortcut?name=eLicznik'
        : 'https://www.tauron.pl/';
    const today = new Date();
    const month = today.getMonth();
    const hour = today.getHours();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTodayFree = isFreeDay(today);
    const isTomorrowFree = isFreeDay(tomorrow);
    const nextRefresh = new Date(today);
    nextRefresh.setMinutes(0, 0, 0);
    const greenRecommendation = 'Korzystaj z prądu';
    const yellowRecommendation = 'Neutralne stawki prądu';
    const redRecommendation = 'Ogranicz zużycie prądu';
    let timePeriod = 'Ups!';
    let recommendation = 'Wystąpił błąd';
    let backgroundColor = COLOR_BLACK;
    const isSummerTariff = month >= 3 && month <= 8;
    const morningStart = 7;
    const afternoonStart = 13;
    const eveningStart = isSummerTariff ? 19 : 16;
    const lateEveningStart = isSummerTariff ? 22 : 21;
    const isNight = hour < morningStart;
    const isMorning = hour >= morningStart && hour < afternoonStart;
    const isAfternoon = hour >= afternoonStart && hour < eveningStart;
    const isEvening = hour >= eveningStart && hour < lateEveningStart;
    const isLateEvening = hour >= lateEveningStart;
    if (isTodayFree || (isLateEvening && isTomorrowFree)) {
        timePeriod = `do ${morningStart}:00 w dzień roboczy`;
        nextRefresh.setDate(nextRefresh.getDate() + 1);
        nextRefresh.setHours(morningStart);
        recommendation = greenRecommendation;
        backgroundColor = COLOR_GREEN;
    }
    else if (isLateEvening || isNight) {
        timePeriod = `${lateEveningStart}:00 - ${morningStart}:00`;
        isLateEvening && nextRefresh.setDate(nextRefresh.getDate() + 1);
        nextRefresh.setHours(morningStart);
        recommendation = greenRecommendation;
        backgroundColor = COLOR_GREEN;
    }
    else if (isMorning) {
        timePeriod = `${morningStart}:00 - ${afternoonStart}:00`;
        nextRefresh.setHours(afternoonStart);
        recommendation = yellowRecommendation;
        backgroundColor = COLOR_YELLOW;
    }
    else if (isAfternoon) {
        timePeriod = `${afternoonStart}:00 - ${eveningStart}:00`;
        nextRefresh.setHours(eveningStart);
        recommendation = greenRecommendation;
        backgroundColor = COLOR_GREEN;
    }
    else if (isEvening) {
        timePeriod = `${eveningStart}:00 - ${lateEveningStart}:00`;
        nextRefresh.setHours(lateEveningStart);
        recommendation = redRecommendation;
        backgroundColor = COLOR_RED;
    }
    if (config.runsInApp) {
        const greenWidgetPreview = {
            url,
            backgroundColor: COLOR_GREEN,
            label: `${afternoonStart}:00 - ${eveningStart}:00`,
            title: greenRecommendation,
        };
        const yellowWidgetPreview = {
            url,
            backgroundColor: COLOR_YELLOW,
            label: `${morningStart}:00 - ${afternoonStart}:00`,
            title: yellowRecommendation,
        };
        const redWidgetPreview = {
            url,
            backgroundColor: COLOR_RED,
            label: `${eveningStart}:00 - ${lateEveningStart}:00`,
            title: redRecommendation,
        };
        const widgetConfigs = [
            greenWidgetPreview,
            yellowWidgetPreview,
            redWidgetPreview,
        ];
        await previewWidget(widgetConfigs);
    }
    else {
        const widget = buildWidget({
            url,
            backgroundColor,
            label: timePeriod,
            title: recommendation,
        });
        widget.refreshAfterDate = nextRefresh;
        Script.setWidget(widget);
    }
    Script.complete();
}
function isFreeDay(date) {
    return isSaturday(date) || isSunday(date) || isPolishHoliday(date);
}
function isSaturday(date) {
    return date.getDay() === 6;
}
function isSunday(date) {
    return date.getDay() === 0;
}
function isPolishHoliday(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    /** Fixed holidays */
    if (month === 0 && dayOfMonth === 1)
        return true; // Nowy Rok
    if (month === 0 && dayOfMonth === 6)
        return true; // Trzech Króli (Objawienie Pańskie)
    if (month === 4 && dayOfMonth === 1)
        return true; // Święto Pracy
    if (month === 4 && dayOfMonth === 3)
        return true; // Święto Konstytucji Trzeciego Maja
    if (month === 7 && dayOfMonth === 15)
        return true; // Wniebowzięcie Najświętszej Maryi Panny
    if (month === 10 && dayOfMonth === 1)
        return true; // Wszystkich Świętych
    if (month === 10 && dayOfMonth === 11)
        return true; // Święto Niepodległości
    if (month === 11 && dayOfMonth === 24)
        return true; // Wigilia Bożego Narodzenia
    if (month === 11 && dayOfMonth === 25)
        return true; // Boże Narodzenie (I dzień)
    if (month === 11 && dayOfMonth === 26)
        return true; // Boże Narodzenie (II dzień)
    /** Moveable feasts */
    // Calculate the date of Easter (Meeus/Jones/Butcher algorithm)
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
    // Wielkanoc - Sunday
    const easter = new Date(year, easterMonth, easterDay);
    if (month === easter.getMonth() && dayOfMonth === easter.getDate()) {
        return true;
    }
    // Poniedziałek Wielkanocny (+1 day) - Monday
    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);
    if (month === easterMonday.getMonth() &&
        dayOfMonth === easterMonday.getDate()) {
        return true;
    }
    // Zesłanie Ducha Świętego (Zielone Świątki) (+49 days) - Sunday
    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);
    if (month === pentecost.getMonth() && dayOfMonth === pentecost.getDate()) {
        return true;
    }
    // Boże Ciało (Uroczystość Najświętszego Ciała i Krwi Chrystusa) (+60 days) - Thursday
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    if (month === corpusChristi.getMonth() &&
        dayOfMonth === corpusChristi.getDate()) {
        return true;
    }
    return false;
}
function buildWidget({ url, backgroundColor, label, title, }) {
    const widget = new ListWidget();
    widget.url = url;
    widget.backgroundColor = backgroundColor;
    const labelText = widget.addText(label);
    labelText.textColor = new Color(COLOR_WHITE.hex, 0.8);
    labelText.shadowColor = new Color(COLOR_BLACK.hex, 0.2);
    labelText.shadowRadius = 1;
    labelText.font = Font.boldSystemFont(14);
    widget.addSpacer(4);
    const titleText = widget.addText(title);
    titleText.textColor = COLOR_WHITE;
    titleText.shadowColor = new Color(COLOR_BLACK.hex, 0.4);
    titleText.shadowRadius = 1;
    titleText.font = Font.boldSystemFont(24);
    return widget;
}
async function previewWidget(widgetConfigs) {
    for (const widgetConfig of widgetConfigs) {
        const widgetPreview = buildWidget(widgetConfig);
        await widgetPreview.presentSmall();
    }
}
