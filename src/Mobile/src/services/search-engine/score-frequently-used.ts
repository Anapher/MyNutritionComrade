import _ from 'lodash';
import { ConsumptionTime } from 'src/types';
import { selectFrequentlyUsedFood } from '../sqlite/diary-repository';
import { SQLiteDatabase } from '../sqlite/types';

export default async function getFrequentlyUsedScore(
   db: SQLiteDatabase,
   time: ConsumptionTime,
   weekday: number,
): Promise<Map<string, number>> {
   const foodScores = await selectFrequentlyUsedFood(db, time, weekday);
   const maxScore = _.maxBy(foodScores, (x) => x.score)?.score;
   if (maxScore === undefined) return new Map();

   const maxScoreAdded = 400;

   const result = new Map<string, number>();
   for (const { foodId, score } of foodScores) {
      result.set(foodId, (score / maxScore) * maxScoreAdded);
   }

   return result;
}
