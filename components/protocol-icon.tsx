import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProtocolIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function ProtocolIcon({ name, size = 24, color }: ProtocolIconProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const iconColor = color ?? colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: iconColor + '12' }]}>
      <MaterialCommunityIcons
        name={name as any}
        size={size}
        color={iconColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
