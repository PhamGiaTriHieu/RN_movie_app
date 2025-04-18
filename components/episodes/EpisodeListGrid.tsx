import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '@/libs/constants/colors';
import {
  IEpisode,
  IServerDetail,
} from '@/libs/interfaces/movie-detail.interface';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 8;
const NUM_COLUMNS = 4;
const ITEM_WIDTH =
  (SCREEN_WIDTH - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface IEpisodeListProps {
  episodes: IEpisode[] | undefined;
  onSelectEpisode?: (episode: string) => void;
  episodePlaying: string | null;
}

const EpisodeListGrid = ({
  episodes,
  onSelectEpisode,
  episodePlaying,
}: IEpisodeListProps) => {
  if (!episodes) {
    return null;
  }
  const insets = useSafeAreaInsets();
  console.log('🚀 ~ EpisodeList ~ episodes:', episodes);

  const [isActive, setIsActive] = useState(episodePlaying);

  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(episodes[0].server_data.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const findItem = episodes[0].server_data.find(
      (episode) => episode.link_m3u8 === episodePlaying
    );

    if (findItem) {
      setIsActive(findItem.link_m3u8);
    }
  }, [episodePlaying]);

  const getPagedEpisodes = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return episodes[0].server_data.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  };

  const renderEpisode = (episodes: IServerDetail, index: number) => {
    return (
      <TouchableOpacity
        style={{
          //   flex: 1,
          width: ITEM_WIDTH,
          margin: ITEM_MARGIN / 2,
          padding: 10,
          borderWidth: 1,
          borderColor: isActive === episodes.link_m3u8 ? Colors.accent : '#ccc',
          borderRadius: 8,
          backgroundColor: Colors.primary,
        }}
        onPress={() => {
          console.log(episodes.link_m3u8);
          if (onSelectEpisode) {
            onSelectEpisode(episodes.link_m3u8);
          }

          // xử lý load video tại đây
        }}
      >
        <View className={`flex items-center justify-center`}>
          <Text
            className={`${
              isActive === episodes.link_m3u8
                ? 'text-accent'
                : 'text-white text-center text-[12px]'
            }`}
          >
            {episodes?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className={`h-auto`}>
      {/* Node Pagination */}
      <FlatList
        data={Array.from({length: totalPages}, (_, i) => i + 1)}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        keyExtractor={(item, index) => `${item.toString()}-${index}`}
        renderItem={({item}) => {
          const start = (item - 1) * ITEMS_PER_PAGE + 1;
          const end = Math.min(
            item * ITEMS_PER_PAGE,
            episodes[0].server_data.length
          );
          const label = `${start}-${end}`;
          return (
            <TouchableOpacity
              onPress={() => setCurrentPage(item)}
              style={{
                margin: ITEM_MARGIN / 2,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: currentPage === item ? '#333' : '#ccc',
                height: 30,
              }}
            >
              <Text style={{color: currentPage === item ? '#fff' : '#000'}}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Render episode List  */}
      <FlatList
        data={getPagedEpisodes()}
        showsVerticalScrollIndicator={false}
        numColumns={4}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({item, index}) => renderEpisode(item, index)}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          paddingTop: 12,
        }}
        nestedScrollEnabled
      />
    </View>
  );
};

export default EpisodeListGrid;
