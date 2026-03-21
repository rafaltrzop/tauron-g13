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
const isWeekend = isSaturday || isSunday;

const white = '#FFFFFF';
const black = '#000000';
const green = '#93B223';
const orange = '#FFD028';
const red = '#FF4D4D';

const weekendTimePeriod = 'do pon. 7:00';

const greenRecommendation = 'Korzystaj z prądu';
const orangeRecommendation = 'Neutralne stawki prądu';
const redRecommendation = 'Ogranicz zużycie prądu';

let backgroundColor: Color = Color.black();
let timePeriod: string = 'Ups!';
let recommendation: string = 'Wystąpił błąd';

if (isSummerTariff) {
  const isNight = hour < 7;
  const isMorning = hour >= 7 && hour < 13;
  const isAfternoon = hour >= 13 && hour < 19;
  const isEvening = hour >= 19 && hour < 22;
  const isLateEvening = hour >= 22;

  if (isLateEvening && isFriday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 3);
    nextRefresh.setHours(7);
  } else if (isSaturday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 2);
    nextRefresh.setHours(7);
  } else if (isSunday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(7);
  } else if (isLateEvening || isNight) {
    timePeriod = '22:00 - 7:00';
    isLateEvening && nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(7);
  } else if (isAfternoon) {
    timePeriod = '13:00 - 19:00';
    nextRefresh.setHours(19);
  }

  if (isLateEvening || isNight || isAfternoon || isWeekend) {
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
  } else if (isMorning) {
    timePeriod = '7:00 - 13:00';
    nextRefresh.setHours(13);
    recommendation = orangeRecommendation;
    backgroundColor = new Color(orange);
  } else if (isEvening) {
    timePeriod = '19:00 - 22:00';
    nextRefresh.setHours(22);
    recommendation = redRecommendation;
    backgroundColor = new Color(red);
  }
} else {
  const isNight = hour < 7;
  const isMorning = hour >= 7 && hour < 13;
  const isAfternoon = hour >= 13 && hour < 16;
  const isEvening = hour >= 16 && hour < 21;
  const isLateEvening = hour >= 21;

  if (isLateEvening && isFriday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 3);
    nextRefresh.setHours(7);
  } else if (isSaturday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 2);
    nextRefresh.setHours(7);
  } else if (isSunday) {
    timePeriod = weekendTimePeriod;
    nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(7);
  } else if (isLateEvening || isNight) {
    timePeriod = '21:00 - 7:00';
    isLateEvening && nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(7);
  } else if (isAfternoon) {
    timePeriod = '13:00 - 16:00';
    nextRefresh.setHours(16);
  }

  if (isLateEvening || isNight || isAfternoon || isWeekend) {
    recommendation = greenRecommendation;
    backgroundColor = new Color(green);
  } else if (isMorning) {
    timePeriod = '7:00 - 13:00';
    nextRefresh.setHours(13);
    recommendation = orangeRecommendation;
    backgroundColor = new Color(orange);
  } else if (isEvening) {
    timePeriod = '16:00 - 21:00';
    nextRefresh.setHours(21);
    recommendation = redRecommendation;
    backgroundColor = new Color(red);
  }
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
