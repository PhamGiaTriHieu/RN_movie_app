import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@/services/api';
import {
  IMovieDetail,
  IMovieDetailResponse,
} from '@/libs/interfaces/movie-detail.interface';
import {useVideoPlayer, VideoSource, VideoView} from 'expo-video';
import {Colors} from '@/libs/constants/colors';
import IconAntDesign from '@expo/vector-icons/AntDesign';
import IconFontAwesome from '@expo/vector-icons/FontAwesome';

const MovieDetails = () => {
  const {id: slug} = useLocalSearchParams();
  const [movieDetails, setMovieDetails] = useState<IMovieDetail | undefined>();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [showMoreButton, setShowMoreButton] = useState(true);
  const [textShown, setTextShown] = useState(false);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const getMovieDetail = async (): Promise<IMovieDetailResponse> => {
    if (!slug) {
      throw new Error('Slug is required');
    }
    const response = await apiClient.get(`phim/${slug}`);
    return response as unknown as IMovieDetailResponse;
  };

  const {data, isLoading, isFetched} = useQuery({
    queryKey: ['movie', slug],
    queryFn: getMovieDetail,
    enabled: !!slug,
  });

  useEffect(() => {
    if (data) {
      const movieData = {
        movie: data.movie,
        episodes: data.episodes,
      };
      setMovieDetails(movieData);

      // episode_total
      const {episode_total} = movieData.movie;
      const {link_m3u8} = movieData?.episodes[0].server_data[0];
      setVideoUrl(link_m3u8);
    }
  }, [data]);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  console.log('🚀 ~ MovieDetails ~ movieDetails:', movieDetails);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator color={Colors.accent} size="large" />
        <Text className="mt-2 text-base color-white">
          Đang tải thông tin phim...
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{paddingBottom: 80, flexGrow: 1}}>
        <View className="flex w-full mt-0 pt-0 bg-black">
          <VideoView
            player={player}
            allowsFullscreen={true}
            allowsPictureInPicture={true}
            nativeControls={true}
            contentFit="contain"
            style={styles.video}
          />
        </View>
        {/* Title */}
        <View className="flex-col items-start justify-center mt-3 px-5">
          <Text className="text-white font-bold text-lg">
            {movieDetails?.movie.name} - {movieDetails?.movie.origin_name}{' '}
            {`(${movieDetails?.movie.year})`}
          </Text>
        </View>
        {/* Time */}
        <View className="flex items-start justify-center mt-1 px-5">
          <Text className="text-secondary text-sm">
            {`${movieDetails?.movie?.time} | ${movieDetails?.movie?.quality} | ${movieDetails?.movie?.lang}`}
          </Text>
        </View>

        {/* content */}
        <View className="flex-col items-start justify-center mt-1 px-5">
          <Text
            className="text-secondary text-sm"
            numberOfLines={textShown ? undefined : 2}
            ellipsizeMode="tail"
          >
            {movieDetails?.movie?.content}
          </Text>
          {showMoreButton ? (
            <Text
              className="text-white font-semibold"
              onPress={toggleNumberOfLines}
            >
              {textShown ? 'Read Less' : 'Read More'}
            </Text>
          ) : null}
        </View>
        {/* Actor */}
        <View className="flex-row items-start justify-start gap-1 mt-2 px-5">
          <View className="w-[20%]">
            <Text className="text-secondary text-sm">Diễn viên: </Text>
          </View>
          <View className="w-[80%]">
            <Text className="text-secondary text-sm">
              {movieDetails?.movie?.actor &&
                movieDetails?.movie?.actor.slice(0, 4).join(', ')}
            </Text>
          </View>
        </View>
        {/* Director */}
        <View className="flex-row items-start justify-start gap-1 mt-2 px-5">
          <View className="w-[20%]">
            <Text className="text-secondary text-sm">Đạo diễn: </Text>
          </View>
          <View className="w-[80%]">
            <Text className="text-secondary text-sm">
              {movieDetails?.movie?.director &&
                movieDetails?.movie?.director.slice(0, 4).join(', ')}
            </Text>
          </View>
        </View>
        {/* Country */}
        <View className="flex-row items-start justify-start gap-1 mt-2 px-5">
          <View className="w-[20%]">
            <Text className="text-secondary text-sm">Quốc gia: </Text>
          </View>
          <View className="w-[80%]">
            <Text className="text-secondary text-sm">
              {movieDetails?.movie?.country.length &&
                movieDetails?.movie?.country
                  .slice(0, 4)
                  .map((item) => item.name)
                  .join(', ')}
            </Text>
          </View>
        </View>
        {/* Category */}
        <View className="flex-row items-start justify-start gap-1 mt-2 px-5">
          <View className="w-[20%]">
            <Text className="text-secondary text-sm">Thể loại: </Text>
          </View>
          <View className="w-[80%]">
            <Text className="text-secondary text-sm">
              {movieDetails?.movie?.category.length &&
                movieDetails?.movie?.category
                  .slice(0, 4)
                  .map((item) => item.name)
                  .join(', ')}
            </Text>
          </View>
        </View>

        {/* Liked and Saved action */}
        <View className="flex-row items-center justify-center gap-16 mt-5 px-5">
          <View
            className="flex-col justify-center items-center gap-2"
            onTouchStart={() => setIsLiked(!isLiked)}
          >
            <IconAntDesign
              name={isLiked ? 'like1' : 'like2'}
              size={26}
              color={isLiked ? Colors.accent : Colors.white}
            />
            <Text
              className={`${
                isLiked ? 'text-white font-semibold' : 'text-secondary text-sm'
              }`}
            >
              Thích
            </Text>
          </View>
          <View
            className="flex-col justify-center items-center gap-2"
            onTouchStart={() => setIsSaved(!isSaved)}
          >
            <IconFontAwesome
              name={isSaved ? 'bookmark' : 'bookmark-o'}
              size={26}
              color={isSaved ? Colors.accent : Colors.white}
            />
            <Text
              className={`${
                isSaved ? 'text-white font-semibold' : 'text-secondary text-sm'
              }`}
            >
              Lưu
            </Text>
          </View>
        </View>

        {/* Episodes */}
        <View className="flex-col items-start justify-center mt-3 px-5">
          <Text className="text-white font-bold text-xl">Tập phim</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    paddingTop: 0,
    aspectRatio: 16 / 9,
  },
});
