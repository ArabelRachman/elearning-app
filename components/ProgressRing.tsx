import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  size?: number;          // outer size in px
  stroke?: number;        // ring thickness
  progress: number;       // 0–100
  trackColor?: string;    // background ring
  progressColor?: string; // foreground ring
  text?: string;          // center label
  textStyle?: any;
};

export default function ProgressRing({
  size = 40,
  stroke = 4,
  progress,
  trackColor = '#EAEAEA',
  progressColor = '#4CD964',
  text,
  textStyle,
}: Props) {
  const clamped = Math.max(0, Math.min(100, progress || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* progress (start from top: rotate -90deg) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* center text */}
      <View style={styles.center}>
        <Text style={[styles.txt, textStyle]}>{text ?? Math.round(clamped)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: { fontWeight: '700', color: '#333' },
});
