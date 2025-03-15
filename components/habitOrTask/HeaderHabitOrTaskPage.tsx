import constants from '@/constants';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View, Pressable } from 'react-native';

type Props = {
  id: string;
  type: 'Habit' | 'Task';
  setShowDeleteModal: (show: boolean) => void;
};

export default function HeaderHabitOrTaskPage({
  setShowDeleteModal,
  type,
  id,
}: Props) {
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: constants.colorSecondary,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: constants.padding,
      }}
    >
      <Pressable
        style={{ padding: constants.padding }}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={28} color={constants.colorTertiary} />
      </Pressable>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: constants.padding,
          gap: constants.padding,
        }}
      >
        <Pressable onPress={() => setShowDeleteModal(true)}>
          <FontAwesome6 name="trash-can" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push(`/Update${type}?id=${id}`)}>
          <FontAwesome6 name="edit" size={28} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
