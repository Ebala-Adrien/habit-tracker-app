import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import constants from '@/constants';
import { headerStyles } from '@/styles/header';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  simple?: boolean;
}

export default function Header({
  title,
  onBackPress,
  simple = false,
}: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  if (simple) {
    return (
      <View style={headerStyles.simpleContainer}>
        <Pressable style={headerStyles.backButton} onPress={handleBackPress}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={constants.colorTertiary}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={headerStyles.container}>
      <Pressable style={headerStyles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color={constants.colorTertiary} />
      </Pressable>

      {title && <Text style={headerStyles.title}>{title}</Text>}
    </View>
  );
}
