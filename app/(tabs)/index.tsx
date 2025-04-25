import {useRouter} from 'expo-router';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import {Colors} from '@/libs/constants/colors';
import useSearchModalStore from '@/libs/stores/uesSearchModalStore';
import SearchBarModal from '@/components/Search/SearchBarModal';

import {featuredMovies} from '@/mocks/movies';
import {
  IItemLatest,
  ILatestMoviesResponse,
} from '@/libs/interfaces/latest-movie.interface';
import {apiClient, apiClientWithVersion} from '@/services/api';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import HeroCarousel from '@/components/herosection/HeroCarousel';
import {TResponseData} from '@/libs/interfaces/common.interface';
import MovieCardHorizontal from '@/components/cards/MovieCardHorizontal';
import {IMovie} from '@/libs/interfaces/movie-detail.interface';

export default function Index() {
  const router = useRouter();
  const {isVisible, openModal} = useSearchModalStore((state) => state);

  const [latestMovies, setLatestMovies] = useState<IItemLatest[]>([]);

  const getLatestMovies = async (): Promise<ILatestMoviesResponse> => {
    const response = await apiClient.get('danh-sach/phim-moi-cap-nhat?page=1');

    return response as unknown as ILatestMoviesResponse;
  };

  const getVieNameMovies = async (): Promise<TResponseData> => {
    const response = await apiClientWithVersion.get('quoc-gia/viet-nam', {
      sort_field: '_id',
      sort_type: 'asc',
      page: 1,
      year: 2025,
    });

    return response.data;
  };

  const {data, isLoading} = useQuery({
    queryKey: ['latestMovies'],
    queryFn: getLatestMovies,
  });

  const {data: vietNameMoviesData, isLoading: isLoadingVietNameMoviesData} =
    useQuery({
      queryKey: ['vietNameMovies'],
      queryFn: getVieNameMovies,
    });

  useEffect(() => {
    if (data) {
      setLatestMovies(data.items);
    }
    if (vietNameMoviesData) {
      console.log('VietNameMoviesData:', vietNameMoviesData.items);
    }
  }, [data, vietNameMoviesData]);

  const handleMoviePress = (slugMovie: string) => {
    router.push(`/movies/${slugMovie}`);
  };

  return (
    <SafeAreaView className="bg-red-50 flex-1">
      <StatusBar />
      <View className="bg-primary h-full">
        <ScrollView>
          <View className="mt-3">
            <View className="flex flex-row items-center justify-between px-4">
              <Text className="text-accent font-extrabold text-3xl">
                MOVIES
              </Text>
              <TouchableOpacity
                className="w-[60px]"
                onPress={() => openModal()}
              >
                <View className="flex flex-row items-center justify-center border border-accent rounded-full w-full h-[42px] px-4">
                  <Icon name="search" size={24} color={Colors.white} />
                </View>
              </TouchableOpacity>
            </View>

            {isVisible ? <SearchBarModal placeholder="Search Movie" /> : null}
          </View>

          {/* Hero Carousel */}
          <View className="mt-3">
            <HeroCarousel
              movies={latestMovies}
              onMoviePress={handleMoviePress}
            />
          </View>

          {/* Viet Nam movies Section */}
          <View className="px-2 mt-3">
            <View className="py-2">
              <Text className="text-white text-2xl font-extrabold">
                Viet Nam movies
              </Text>
            </View>
            <FlatList
              data={vietNameMoviesData?.items}
              renderItem={({item}) => {
                return <MovieCardHorizontal {...item} />;
              }}
              keyExtractor={(item, index) => item._id + index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Viet Nam movies Section */}
          <View className="mt-3">
            <View className="py-2">
              <Text className="text-white text-2xl font-extrabold">
                Viet Nam movies
              </Text>
            </View>
            <FlatList
              data={vietNameMoviesData?.items}
              renderItem={({item}) => {
                return <MovieCardHorizontal {...item} />;
              }}
              keyExtractor={(item, index) => item._id + index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
