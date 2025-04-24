import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {useQuery} from '@tanstack/react-query';
import {apiClient, apiClientWithVersion} from '@/services/api';
import {
  IEpisode,
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
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import EpisodeListGrid from '@/components/episodes/EpisodeListGrid';
import {
  TMoviesData,
  TResponseSearchData,
} from '@/libs/interfaces/search-movies.interface';
import {MOVIE_TYPES} from '@/libs/constants/common';
import MovieCard from '@/components/cards/MovieCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MovieDetails = () => {
  const insets = useSafeAreaInsets();
  const {id: slug} = useLocalSearchParams();
  const [movieDetails, setMovieDetails] = useState<IMovieDetail | undefined>();
  const [episodes, setEpisodes] = useState<IEpisode[] | undefined>();

  const [relatedMovies, setRelatedMovies] = useState<TMoviesData[]>([]);

  const [episodeTotal, setEpisodeTotal] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [episodeLang, setEpisodeLang] = useState<number>(0);
  const [langs, setLangs] = useState<string[] | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [indexShowModal, setIndexShowModal] = useState(-1);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    setIndexShowModal(index);
  }, []);

  const handleClosePress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

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

  const getRelatedMovies = async (): Promise<TResponseSearchData> => {
    if (!movieDetails?.movie) {
      throw new Error('Movie details are required');
    }
    const {type, category, country} = movieDetails?.movie;
    const typeName = MOVIE_TYPES.find((item) => item.key === type)?.value;
    const categoryName = category?.length && category.map((item) => item.slug);

    const response = await apiClientWithVersion.get(`danh-sach/${typeName}`, {
      category: categoryName,
      // sort_field: '_id',
      // sort_type: 'asc',
      // page: 1,
      // country: countryName ?? '',
    });

    return response.data as unknown as TResponseSearchData;
  };

  const {data, isLoading} = useQuery({
    queryKey: ['movie', slug],
    queryFn: getMovieDetail,
    enabled: !!slug,
  });

  const {data: relatedMovieData, isLoading: isLoadingRelatedMovies} = useQuery({
    queryKey: ['relatedMovie', slug], //
    queryFn: getRelatedMovies,
    enabled: !!movieDetails?.movie?.type,
  });

  useEffect(() => {
    if (data) {
      const movieData = {
        movie: data.movie,
        episodes: data.episodes,
      };
      // episode_total
      const {episode_total} = movieData.movie;
      const {link_m3u8} = movieData?.episodes[0].server_data[0];

      setVideoUrl(link_m3u8);
      setEpisodeTotal(episode_total as unknown as number);
      setMovieDetails(movieData);
    }
  }, [data]);

  useEffect(() => {
    if (!movieDetails?.episodes.length) return;

    const episodeData = movieDetails.episodes;

    const isMultipleServerLangs = episodeData.length > 1;
    if (isMultipleServerLangs) {
      const multipleServerLangs = episodeData.map((item) => item.server_name);
      setLangs(multipleServerLangs);
    }

    setEpisodes([episodeData[episodeLang]]);
  }, [episodeLang, movieDetails]);

  useEffect(() => {
    if (relatedMovieData) {
      setRelatedMovies(relatedMovieData.items);
    } else {
      setRelatedMovies([]);
    }
  }, [relatedMovieData]);

  const handleSelectServerLang = (number: number) => {
    setEpisodeLang(number);
    if (!movieDetails?.episodes.length) return;
    setEpisodes([movieDetails?.episodes[number]]);
  };

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  const handleSelectEpisode = (episode: string) => {
    setVideoUrl(episode);
    player.play();
  };

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

  const renderHeader = () => {
    return (
      <View>
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
      </View>
    );
  };
  const renderEpisodeList = () => {
    return episodeTotal && episodeTotal > 1 ? (
      <View className="flex-col px-5 mt-3">
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-white font-bold text-xl  border-b-2 border-b-red-400 h-[38px]">
            Tập phim
          </Text>

          <TouchableOpacity
            className="px-2"
            onPress={() => {
              handleSheetChanges(1);
            }}
          >
            <IconMaterialIcons
              className="w-full"
              name="arrow-forward-ios"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View>
          <EpisodeList
            episodes={episodes}
            onSelectEpisode={handleSelectEpisode}
            episodePlaying={videoUrl}
            serverLangs={langs}
            onSelectServerLang={handleSelectServerLang}
            episodeLang={episodeLang}
          />
        </View>

        {/* <View>
          <FlatList
            data={relatedMovies}
            renderItem={({item}) => {
              return (
                <View className="flex-row items-center justify-between w-full px-5">
                  <Text className="text-white font-bold text-xl">
                    {item.name}
                  </Text>
                </View>
              );
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 80}}
          />
        </View> */}
      </View>
    ) : null;
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="flex w-full pt-0 mt-0 bg-black">
        {/* Video player */}
        <VideoView
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          nativeControls={true}
          contentFit="contain"
          style={styles.video}
        />
      </View>

      {/* content */}
      <View className="">
        <FlatList
          data={episodes}
          renderItem={renderEpisodeList}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View className="flex-col mt-5">
              <FlatList
                data={relatedMovies}
                renderItem={({item}) => {
                  return (
                    <View className="flex-row items-center justify-between w-full px-5">
                      <MovieCard {...item} />
                    </View>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          }
          ListFooterComponentStyle={{
            paddingBottom: insets.bottom + 120,
          }}
          contentContainerStyle={{paddingBottom: 80}}
        />

        {/* Bottom sheet modal */}
        <BottomSheetModalProvider>
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={['98%']}
            handleIndicatorStyle={{backgroundColor: Colors.accent}}
            handleStyle={{backgroundColor: Colors.primary}}
            index={indexShowModal}
            style={{backgroundColor: Colors.primary}}
            handleComponent={() => (
              <View className="flex items-center justify-center h-[30px]">
                <IconMaterialIcons
                  name="keyboard-arrow-down"
                  size={30}
                  color={Colors.accent}
                  onPress={handleClosePress}
                />
              </View>
            )}
          >
            <BottomSheetView
              style={styles.contentContainer}
              className="bg-primary"
            >
              {episodeTotal && episodeTotal > 1 && episodes && (
                <EpisodeListGrid
                  episodes={episodes ?? []}
                  onSelectEpisode={handleSelectEpisode}
                  episodePlaying={videoUrl}
                  onClose={handleClosePress}
                />
              )}
            </BottomSheetView>
          </BottomSheet>
        </BottomSheetModalProvider>
      </View>
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
  contentContainer: {
    paddingHorizontal: 5,
    height: '100%',
  },
});
