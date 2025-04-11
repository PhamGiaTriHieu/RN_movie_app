import {TMoviesData} from '@/libs/interfaces/search-movies.interface';
import useSearchModalStore from '@/libs/stores/uesSearchModalStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MovieCard = ({
  _id,
  name,
  poster_url,
  episode_current,
  year,
  slug,
}: TMoviesData) => {
  const [loading, setLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  const router = useRouter();
  const {closeModal} = useSearchModalStore();

  const handlePress = () => {
    setTimeout(() => {
      router.push(`/movies/${slug}`);
      closeModal();
    }, 300);
  };

  return (
    <Pressable
      className={`${isPressed ? 'pressed' : ''} pb-4 flex`}
      onPress={handlePress}
      android_ripple={{color: 'rgba(255,255,255,0.2)', borderless: false}}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View className="flex flex-row gap-6">
        <View className="relative h-44 rounded-lg">
          {loading && (
            <View className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
          <Image
            source={{
              uri: poster_url
                ? `${process.env.EXPO_PUBLIC_API_URL_IMAGE}${poster_url}`
                : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
            }}
            className="w-44 h-44 rounded-lg"
            resizeMode="stretch"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </View>
        <View className="max-w-[200px] flex flex-col gap-2 justify-center">
          <Text className="text-white font-bold">{name}</Text>
          <Text className="text-secondary font-bold">{episode_current}</Text>
          <Text className="text-secondary font-bold">{year}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MovieCard;

const styles = StyleSheet.create({});
