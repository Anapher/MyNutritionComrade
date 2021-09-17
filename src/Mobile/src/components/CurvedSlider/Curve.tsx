import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Path } from 'react-native-svg';
import { computePosOnArc } from './math';
import { Vector2 } from './vector';

type CurveProps = {
   radius: number;
   startPos: Vector2;
   endPos: Vector2;
   strokeWidth: number;
   progress: Animated.AnimatedValue;
   marginLeft: number;
   height: number;

   progressColor: string;
   color: string;
};

export function Curve({
   radius,
   startPos,
   endPos,
   strokeWidth,
   progress,
   progressColor,
   color,
   marginLeft,
   height,
}: CurveProps) {
   const progressPath = useRef<any>(null);

   useEffect(() => {
      const listenerId = progress.addListener((p) => {
         const { x, y } = computePosOnArc(radius, endPos.x - startPos.x, p.value);

         progressPath.current?.setNativeProps({
            d: `M ${startPos.x} ${startPos.y} A ${radius} ${radius} 0 0 1 ${x + marginLeft} ${height - y}`,
         });
      });
      return () => {
         progress.removeListener(listenerId);
      };
   }, [progress, marginLeft, height]);

   return (
      <>
         <Path
            d={`M ${startPos.x} ${startPos.y} A ${radius} ${radius} 0 0 1 ${endPos.x} ${endPos.y}`}
            fill="transparent"
            stroke={color}
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
         />
         <Path
            ref={progressPath}
            d={`M ${startPos.x} ${startPos.y} A ${radius} ${radius} 0 0 1 ${startPos.x} ${startPos.y}`}
            fill="transparent"
            stroke={progressColor}
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
         />
      </>
   );
}
