import moment, {Moment} from 'moment';

export function getCurrentDate(): Moment {
  return moment();
}

export function GetWeekArray(
  forwardWeek: number,
  backwardWeek: number,
): Array<Array<Moment>> {
  const now = moment().startOf('day').startOf('week');

  const currentWeekArray = getDayArrayForDays(now, 7);

  const forwardWeekArray = getForwardWeekArray(now, forwardWeek);

  const backwardWeekArray = getBackwardWeekArray(now, backwardWeek);

  return [...backwardWeekArray, currentWeekArray, ...forwardWeekArray];
}

export function getCurrentWeekArray() {
  const now = moment();
  now.startOf('day');
  now.startOf('week');

  return getDayArrayForDays(now, 7);
}

export function getDayArrayForDays(currentDate: Moment, noOfDays: number = 7) {
  const mutationCopy = moment(currentDate);

  const daysArray: Array<Moment> = [];

  let index = 0;

  for (index = 1; index <= noOfDays; index += 1) {
    mutationCopy.add(1, 'day');
    daysArray.push(moment(mutationCopy));
  }

  return daysArray;
}

export function getForwardWeekArray(currentDate: Moment, noOfWeeks: number) {
  const mutationCopy = moment(currentDate);

  const currentWeekDay = mutationCopy;

  let daysArray: Array<Array<Moment>> = [];

  for (let i = 1; i <= noOfWeeks; ++i) {
    currentWeekDay.add(1, 'week');
    const array = getDayArrayForDays(currentWeekDay, 7);

    daysArray.push(array);
  }

  return daysArray;
}

export function getBackwardWeekArray(currentDate: Moment, noOfWeeks: number) {
  const mutationCopy = moment(currentDate);

  const currentWeekDay = mutationCopy;

  let daysArray: Array<Array<Moment>> = [];

  for (let i = 1; i <= noOfWeeks; ++i) {
    currentWeekDay.subtract(1, 'week');
    const array = getDayArrayForDays(currentWeekDay, 7);

    daysArray.unshift(array);
  }

  return daysArray;
}

export function getCurrentDayInWeek(): number {
  const now = moment();
  return now.get('day');
}

export function getWeekDayOn(data: Moment | string): number {
  const date = moment(data);
  const day = date.get('day');

  if (day === 0) {
    // for sunday, return 6, as 6 is last day of week
    return 7;
  }

  return day;
}

export function getMonthIndex(
  monthArray: Array<string>,
  date: Moment | number,
): number {
  const now = moment(date);
  const currentMonth = now.format('MMMM');

  return monthArray.indexOf(currentMonth);
}
