import lunarCalendar from "lunar-calendar";
const { solarToLunar } = lunarCalendar;

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const lunar = solarToLunar(year, month, day);
  return `${year}年${month}月${day}日，${lunar.GanZhiYear}${lunar.lunarMonthName}${lunar.lunarDayName}`;
};