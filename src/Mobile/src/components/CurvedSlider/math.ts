import { Vector2 } from './vector';

/**
 * Calculate the vector of the value on the arc
 * @param r radius
 * @param s chord length
 * @param value the value on the x axis ∈ [0,1]
 */
export function computePosOnArc(r: number, s: number, value: number): Vector2 {
   const x = s * value;

   const f = (x: number) => Math.sqrt(Math.pow(r, 2) - Math.pow(x - r, 2));
   const x0 = (r * 2 - s) / 2;
   const g = (x: number) => f(x + x0) - f(x0);

   return new Vector2(x, g(x));
}

/**
 * Approximate the position on the x-axis by a given graph length
 * @param f the graph function (f(x) = y)
 * @param len the length of the arc
 * @param precision the precision. Smaller numbers generate more precise results
 */
export function computeXByGraphLength(f: (x: number) => number, len: number, precision: number = 1): number {
   let currentLen = 0;
   let currentX = 0;

   let previous = new Vector2(0, f(0));

   while (currentLen < len) {
      currentX += precision;
      const v = new Vector2(currentX, f(currentX));
      currentLen += previous.subtract(v).length();
      previous = v;
   }

   return currentX;
}

export type ScalePoint = {
   arcPos: Vector2;
   perpendicular: Vector2;
   value: number;
   relativeValue: number;
};

/**
 *
 * @param r radius
 * @param s chord length
 * @param minValue the minimum value of the scale
 * @param maxValue the maximum value of the scale
 * @param step the difference between each point
 */
export function calculateScale(r: number, s: number, minValue: number, maxValue: number, step: number): ScalePoint[] {
   const steps = (maxValue - minValue + 1) / step;

   const numberOfSegments = steps - 1; // because the 0 and the max value are steps

   const arcLength = 2 * r * Math.asin(s / (2 * r)); // arc length
   const arcSegmentLength = arcLength / numberOfSegments; // the length of each segment

   const f = (x: number) => Math.sqrt(Math.pow(r, 2) - Math.pow(x - r, 2));
   const x0 = (r * 2 - s) / 2;
   const g = (x: number) => f(x + x0) - f(x0);

   const gD = (x: number) => -(x0 - r + x) / Math.sqrt(-(x0 + x) * (x0 - 2 * r + x)); // g'

   const result: ScalePoint[] = [];
   for (let i = 0; i < steps; i++) {
      const graphLen = i * arcSegmentLength; // the length of the graph where the point should sit
      const lastStep = i === steps - 1; // true if this is the last point

      const translatedX = lastStep ? s : computeXByGraphLength(g, graphLen, 2);

      const arcPos = new Vector2(translatedX, g(translatedX));
      const perpendicular = new Vector2(gD(translatedX), 1);
      const value = lastStep ? maxValue : minValue + step * i;
      const relativeValue = translatedX / s;

      result.push({
         arcPos,
         perpendicular,
         value,
         relativeValue,
      });
   }

   return result;
}

/**
 * Interpolate the graph by calculating vectors
 * @param scale the scale points that will be found in the return value so the thumb snaps to the scale
 * @param r radius
 * @param arcWidth chord length
 * @param density the density of interpolated points
 */
export function interpolateGraph(
   scale: ScalePoint[],
   r: number,
   arcWidth: number,
   density: number = 0.05,
): { v: Vector2; val: number }[] {
   const count = 1 / density;

   if (scale.length >= count) {
      return scale.map((x) => ({
         v: x.arcPos,
         val: x.relativeValue,
      }));
   }

   let interpolation: { v: Vector2; val: number }[] = [];
   let currentScalePointIndex = 0;
   let currentScalePoint = scale[0];

   for (let i = 0; i < count; i++) {
      const relativeVal = i * density;

      if (relativeVal >= currentScalePoint.relativeValue) {
         interpolation.push({
            v: currentScalePoint.arcPos,
            val: currentScalePoint.relativeValue,
         });

         currentScalePointIndex += 1;
         currentScalePoint = scale[currentScalePointIndex];
      } else {
         const v = computePosOnArc(r, arcWidth, relativeVal);
         interpolation.push({
            v,
            val: i * density,
         });
      }
   }

   return interpolation;
}
