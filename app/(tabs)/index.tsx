import SearchBar from '@/components/Search/SearchBar';
import {useRouter} from 'expo-router';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import IconMaterial from '@expo/vector-icons/MaterialIcons';
import {Colors} from '@/libs/constants/colors';
import {useState} from 'react';

export default function Index() {
  const route = useRouter();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleCloseModal = () => setShowSearchModal(false);

  return (
    <SafeAreaView className="bg-red-50 flex-1">
      <StatusBar />
      <View className="bg-primary h-full">
        <View className="mt-10">
          <View className="flex flex-row items-center justify-between px-4">
            <Text className="text-accent font-extrabold text-3xl">MOVIES</Text>
            <TouchableOpacity
              className="w-[60px]"
              onPress={() => setShowSearchModal(true)}
            >
              <View className="flex flex-row items-center justify-center border border-accent rounded-full w-full h-[42px] px-4">
                <Icon name="search" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          <Modal visible={showSearchModal} animationType="fade">
            <SafeAreaView className="bg-primary flex-1">
              <StatusBar />
              <View className="bg-primary h-full mt-2">
                <SearchBar
                  placeholder="Search Movie"
                  onPress={() => route.push('/search')}
                  onClose={handleCloseModal}
                />
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
