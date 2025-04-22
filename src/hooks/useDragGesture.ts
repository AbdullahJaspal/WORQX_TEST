import {useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture} from 'react-native-gesture-handler';

export const useDragGesture = (
  monthHeight: number,
  weekHeight: number,
  snapThreshold: number,
) => {
  const translateY = useSharedValue(0);
  const isExpanded = useSharedValue(false);

  const dragGesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = Math.min(
        Math.max(event.translationY, 0),
        monthHeight - weekHeight,
      );
    })
    .onEnd(() => {
      const shouldExpand = translateY.value > snapThreshold;
      translateY.value = withTiming(
        shouldExpand ? monthHeight - weekHeight : 0,
      );
      isExpanded.value = shouldExpand;
    });

  return {translateY, isExpanded, dragGesture};
};
