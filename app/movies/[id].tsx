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
import IconMaterialIcons from '@expo/vector-icons/MaterialIcons';
import TextDetail from '@/components/TextDetail/TextDetail';
import TextDetailKeyName from '@/components/TextDetail/TextDetailKeyName';
import EpisodeList from '@/components/episodes/EpisodeList';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const MovieDetails = () => {
  const {id: slug} = useLocalSearchParams();
  const [movieDetails, setMovieDetails] = useState<IMovieDetail | undefined>();
  const [episodeTotal, setEpisodeTotal] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  console.log('🚀 ~ MovieDetails ~ movieDetails:', movieDetails);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [showEpisodeModal, setShowEpisodeModal] = useState(false);

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
      setEpisodeTotal(episode_total as unknown as number);
    }
  }, [data]);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  const handleSelectEpisode = (episode: string) => {
    setVideoUrl(episode);
    player.play();
  };

  // console.log('movieDetails episode: ', movieDetails?.episodes);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-primary">
        <ActivityIndicator color={Colors.accent} size="large" />
        <Text className="mt-2 text-base color-white">
          Đang tải thông tin phim...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <View className="flex w-full pt-0 mt-0 bg-black">
        <VideoView
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          nativeControls={true}
          contentFit="contain"
          style={styles.video}
        />
      </View>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80, flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Title */}
        <View className="flex-col items-start justify-center px-5 mt-3">
          <Text className="text-lg font-bold text-white">
            {movieDetails?.movie.name} - {movieDetails?.movie.origin_name}{' '}
            {`(${movieDetails?.movie.year})`}
          </Text>
        </View>
        {/* Time */}
        <View className="flex items-start justify-center px-5 mt-1">
          <Text className="text-sm text-secondary">
            {`${movieDetails?.movie?.time} | ${movieDetails?.movie?.quality} | ${movieDetails?.movie?.lang}`}
          </Text>
        </View>

        {/* content */}
        <View className="flex-col items-start justify-center px-5 mt-1">
          <Text
            className="text-sm text-secondary"
            numberOfLines={textShown ? undefined : 2}
            ellipsizeMode="tail"
          >
            {movieDetails?.movie?.content}
          </Text>

          <Text
            className="font-semibold text-white"
            onPress={toggleNumberOfLines}
          >
            {textShown ? 'Read Less' : 'Read More'}
          </Text>
        </View>
        {/* Actor */}
        <View>
          <TextDetail title="Diễn viên" data={movieDetails?.movie?.actor} />
        </View>

        {/* Director */}
        <View>
          <TextDetail title="Đạo diễn" data={movieDetails?.movie?.director} />
        </View>

        {/* Country */}
        <View>
          <TextDetailKeyName
            title="Quốc gia"
            data={movieDetails?.movie?.country}
          />
        </View>
        {/* Category */}
        <View>
          <TextDetailKeyName
            title="Thể loại"
            data={movieDetails?.movie?.category}
          />
        </View>

        {/* Liked and Saved action */}
        <View className="flex-row items-center justify-center gap-16 px-5 mt-5">
          <View
            className="flex-col items-center justify-center gap-2"
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
            className="flex-col items-center justify-center gap-2"
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
        {episodeTotal && episodeTotal > 1 && (
          <View className="flex-col items-start justify-center px-5 mt-3">
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-white font-bold text-xl  border-b-2 border-b-red-400 h-[38px]">
                Tập phim
              </Text>

              <IconMaterialIcons
                name="arrow-forward-ios"
                size={20}
                color={Colors.white}
                onPress={() => {
                  console.log('Chọn tập phim Click arrow forward');
                  setShowEpisodeModal(!showEpisodeModal);
                }}
              />
            </View>
            <EpisodeList
              episodes={movieDetails?.episodes}
              onSelectEpisode={handleSelectEpisode}
              episodePlaying={videoUrl}
            />
          </View>
        )}
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
