import { DateTime } from 'luxon';
import { getRequiredDates, groupDatesInChunks } from './utils';

test('should get required dates today and selected day same', () => {
    const today = DateTime.fromISO('2020-04-13');
    const selectedDate = today;

    const margin = 3;
    const history = 7;

    const result = getRequiredDates(today, selectedDate, margin, history).map((x) => x.toISODate());
    expect(result).toEqual([
        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ]);
});

test('should get required dates', () => {
    const today = DateTime.fromISO('2020-04-13');
    const selectedDate = DateTime.fromISO('2020-02-10');

    const margin = 3;
    const history = 7;

    const result = getRequiredDates(today, selectedDate, margin, history).map((x) => x.toISODate());
    expect(result).toEqual([
        '2020-02-07',
        '2020-02-08',
        '2020-02-09',
        '2020-02-10',
        '2020-02-11',
        '2020-02-12',
        '2020-02-13',

        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ]);
});

test('should chunk one big chunk', () => {
    const dates = [
        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ];

    const chunks = groupDatesInChunks(
        dates.map((x) => DateTime.fromISO(x)),
        10,
    );
    expect(chunks.length).toBe(1);

    const chunk = chunks[0];
    expect(chunk.map((x) => x.toISODate())).toEqual([
        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ]);
});

test('should chunk two chunks', () => {
    const dates = [
        '2020-02-07',
        '2020-02-08',
        '2020-02-09',
        '2020-02-10',
        '2020-02-11',
        '2020-02-12',
        '2020-02-13',

        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ];

    const chunks = groupDatesInChunks(
        dates.map((x) => DateTime.fromISO(x)),
        10,
    );

    expect(chunks.length).toBe(2);

    expect(chunks[0].map((x) => x.toISODate())).toEqual([
        '2020-02-07',
        '2020-02-08',
        '2020-02-09',
        '2020-02-10',
        '2020-02-11',
        '2020-02-12',
        '2020-02-13',
    ]);

    expect(chunks[1].map((x) => x.toISODate())).toEqual([
        '2020-04-06',
        '2020-04-07',
        '2020-04-08',
        '2020-04-09',
        '2020-04-10',
        '2020-04-11',
        '2020-04-12',
        '2020-04-13',
    ]);
});

test('should chunk in one item chunks if necessary', () => {
    const dates = ['2020-02-07', '2020-03-02', '2020-03-20', '2020-04-13'];

    const chunks = groupDatesInChunks(
        dates.map((x) => DateTime.fromISO(x)),
        10,
    );

    expect(chunks.map((x) => x.map((y) => y.toISODate()))).toEqual([
        ['2020-02-07'],
        ['2020-03-02'],
        ['2020-03-20'],
        ['2020-04-13'],
    ]);
});
