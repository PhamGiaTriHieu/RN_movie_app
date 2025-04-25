import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import {TMoviesData} from '@/libs/interfaces/search-movies.interface';

const MovieCardHorizontal = ({poster_url, name, slug}: TMoviesData) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    router.push(`/movies/${slug}`);
  };

  return (
    <View>
      <Pressable
        className={`${isPressed ? 'pressed' : ''} pb-4 mr-2`}
        onPress={handlePress}
        android_ripple={{color: 'rgba(255,255,255,0.2)', borderless: false}}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <View className="flex flex-col items-cente">
          <View className="relative h-44 rounded-lg">
            {loading && (
              <View className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            )}
            <View className="w-[8.7rem] h-44 rounded-lg border border-0.5 border-accent">
              <Image
                source={{
                  uri: poster_url
                    ? `${process.env.EXPO_PUBLIC_API_URL_IMAGE}${poster_url}`
                    : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
                }}
                className="w-full h-full rounded-lg"
                resizeMode="stretch"
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </View>
          </View>
          <View className="max-w-[8.7rem] pt-2">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-secondary font-bold text-center"
            >
              {name}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default MovieCardHorizontal;

const styles = StyleSheet.create({});
