// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: plug;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget = new ListWidget();
widget.url = 'https://www.tauron.pl/';
// Create a shortcut to open the app
// 1. Open the "Shortcuts" app on your iPhone.
// 2. Tap the "+" icon in the top right to create a new shortcut.
// 3. Search for "Open app" action and select it.
// 4. Tap the faded blue word "App" and select "eLicznik" from your list of installed apps.
// 5. Tap the name at the top of the screen (it says "Open app") and rename it to "eLicznik".
// 6. Save the changes.
// 7. Uncomment the line below:
// widget.url = 'shortcuts://run-shortcut?name=eLicznik';
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
const orange = '#FFD028';
const red = '#FF4D4D';
const greenRecommendation = 'Korzystaj z prądu';
const orangeRecommendation = 'Neutralne stawki prądu';
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
    recommendation = orangeRecommendation;
    backgroundColor = new Color(orange);
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
widget.refreshAfterDate = nextRefresh;
widget.backgroundColor = backgroundColor;
const timePeriodText = widget.addText(timePeriod);
timePeriodText.textColor = new Color(white, 0.8);
timePeriodText.shadowColor = new Color(black, 0.2);
timePeriodText.shadowRadius = 1;
timePeriodText.font = Font.boldSystemFont(14);
widget.addSpacer(4);
const recommendationText = widget.addText(recommendation);
recommendationText.textColor = Color.white();
recommendationText.shadowColor = new Color(black, 0.4);
recommendationText.shadowRadius = 1;
recommendationText.font = Font.boldSystemFont(24);
Script.setWidget(widget);
Script.complete();
widget.presentSmall();
