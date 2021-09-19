import { DateTime } from 'luxon';

export function calculateAge(birthday: string) {
   return -DateTime.fromISO(birthday).diffNow('years').years.toFixed(0);
}
