// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: plug;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eLicznik = false;
const url = eLicznik
    ? 'shortcuts://run-shortcut?name=eLicznik'
    : 'https://www.tauron.pl/';
const nextRefresh = new Date();
nextRefresh.setMinutes(0);
nextRefresh.setSeconds(0);
const date = new Date();
const month = date.getMonth();
const day = date.getDay();
const hour = date.getHours();
const isSummerTariff = month >= 3 && month <= 8;
const isFriday = day === 5;
const isSaturday = day === 6;
const isSunday = day === 0;
const white = '#FFFFFF';
const black = '#000000';
const green = '#93B223';
const yellow = '#FFD028';
const red = '#FF4D4D';
const greenRecommendation = 'Korzystaj z prądu';
const yellowRecommendation = 'Neutralne stawki prądu';
const redRecommendation = 'Ogranicz zużycie prądu';
let backgroundColor = Color.black();
let timePeriod = 'Ups!';
let recommendation = 'Wystąpił błąd';
const morningStart = 7;
const afternoonStart = 13;
const eveningStart = isSummerTariff ? 19 : 16;
const lateEveningStart = isSummerTariff ? 22 : 21;
const isNight = hour < morningStart;
const isMorning = hour >= morningStart && hour < afternoonStart;
const isAfternoon = hour >= afternoonStart && hour < eveningStart;
const isEvening = hour >= eveningStart && hour < lateEveningStart;
const isLateEvening = hour >= lateEveningStart;
const weekendTimePeriod = `do pon. ${morningStart}:00`;
if (isLateEvening && isFriday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 3);
    nextRefresh.setHours(morningStart);
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
}
else if (isSaturday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 2);
    nextRefresh.setHours(morningStart);
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
}
else if (isSunday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(morningStart);
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
}
else if (isLateEvening || isNight) {
    timePeriod = `${lateEveningStart}:00 - ${morningStart}:00`;
    isLateEvening && nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(morningStart);
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
}
else if (isMorning) {
    timePeriod = `${morningStart}:00 - ${afternoonStart}:00`;
    nextRefresh.setHours(afternoonStart);
    recommendation = yellowRecommendation;
    backgroundColor = new Color(yellow);
}
else if (isAfternoon) {
    timePeriod = `${afternoonStart}:00 - ${eveningStart}:00`;
    nextRefresh.setHours(eveningStart);
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
}
else if (isEvening) {
    timePeriod = `${eveningStart}:00 - ${lateEveningStart}:00`;
    nextRefresh.setHours(lateEveningStart);
    recommendation = redRecommendation;
    backgroundColor = new Color(red);
}
function buildWidget(url, backgroundColor, label, title) {
    const widget = new ListWidget();
    widget.url = url;
    widget.backgroundColor = backgroundColor;
    const labelText = widget.addText(label);
    labelText.textColor = new Color(white, 0.8);
    labelText.shadowColor = new Color(black, 0.2);
    labelText.shadowRadius = 1;
    labelText.font = Font.boldSystemFont(14);
    widget.addSpacer(4);
    const titleText = widget.addText(title);
    titleText.textColor = Color.white();
    titleText.shadowColor = new Color(black, 0.4);
    titleText.shadowRadius = 1;
    titleText.font = Font.boldSystemFont(24);
    return widget;
}
async function previewWidget() {
    const greenWidgetPreview = buildWidget(url, new Color(green), `${afternoonStart}:00 - ${eveningStart}:00`, greenRecommendation);
    await greenWidgetPreview.presentSmall();
    const yellowWidgetPreview = buildWidget(url, new Color(yellow), `${morningStart}:00 - ${afternoonStart}:00`, yellowRecommendation);
    await yellowWidgetPreview.presentSmall();
    const redWidgetPreview = buildWidget(url, new Color(red), `${eveningStart}:00 - ${lateEveningStart}:00`, redRecommendation);
    await redWidgetPreview.presentSmall();
    Script.complete();
}
if (config.runsInApp) {
    previewWidget();
}
else {
    const widget = buildWidget(url, backgroundColor, timePeriod, recommendation);
    widget.refreshAfterDate = nextRefresh;
    Script.setWidget(widget);
    Script.complete();
}
