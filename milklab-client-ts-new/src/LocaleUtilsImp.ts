import { LocaleUtils } from 'react-day-picker/types/utils';

class LocaleUtilsImp implements LocaleUtils {
    formatDay(day: Date, locale: string): string {
        return 'День';
    }
    formatMonthTitle (month: Date, locale: string): string {
        return 'Месяц';
    }
    formatWeekdayLong (weekday: number, locale: string): string {
        const days = [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
            'Воскресенье'
        ];
        return days[weekday];
    }
    formatWeekdayShort (weekday: number, locale: string): string {
        const days = [
            'Пн',
            'Вт',
            'Ср',
            'Чт',
            'Пт',
            'Сб',
            'Вс'
        ];
        return days[weekday];
    }
    getFirstDayOfWeek (locale: string): number {
        return 0;
    }
    getMonths (locale: string): [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string] {
        return [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];
    }
}

export default new LocaleUtilsImp();