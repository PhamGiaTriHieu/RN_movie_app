import SearchBar from '@/components/Search/SearchBarModal';
import {useRouter} from 'expo-router';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import {Colors} from '@/libs/constants/colors';
import useSearchModalStore from '@/libs/stores/uesSearchModalStore';
import SearchBarModal from '@/components/Search/SearchBarModal';

export default function Index() {
  const route = useRouter();
  const {isVisible, openModal} = useSearchModalStore((state) => state);

  return (
    <SafeAreaView className="bg-red-50 flex-1">
      <StatusBar />
      <View className="bg-primary h-full">
        <View className="mt-10">
          <View className="flex flex-row items-center justify-between px-4">
            <Text className="text-accent font-extrabold text-3xl">MOVIES</Text>
            <TouchableOpacity className="w-[60px]" onPress={() => openModal()}>
              <View className="flex flex-row items-center justify-center border border-accent rounded-full w-full h-[42px] px-4">
                <Icon name="search" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          {isVisible ? <SearchBarModal placeholder="Search Movie" /> : null}
          {/* <Modal visible={isVisible} animationType="fade">
            <SafeAreaView className="bg-primary flex-1">
              <StatusBar />
              <View className="bg-primary h-full mt-2">
                <SearchBar placeholder="Search Movie" />
              </View>
            </SafeAreaView>
          </Modal> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
