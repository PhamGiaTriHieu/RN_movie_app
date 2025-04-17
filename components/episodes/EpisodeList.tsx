import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {act, useEffect, useState} from 'react';
import {Colors} from '@/libs/constants/colors';
import {
  IEpisode,
  IServerDetail,
} from '@/libs/interfaces/movie-detail.interface';

interface IEpisodeListProps {
  episodes: IEpisode[] | undefined;
  onSelectEpisode?: (episode: string) => void;
  episodePlaying: string | null;
}

const EpisodeList = ({
  episodes,
  onSelectEpisode,
  episodePlaying,
}: IEpisodeListProps) => {
  if (!episodes) {
    return null;
  }
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

  const renderEpisode = (episodes: IServerDetail, index: number) => (
    <TouchableOpacity
      style={{
        padding: 10,
        margin: 5,
        marginLeft: index === 0 ? 0 : 5,
        borderWidth: 1,
        borderColor: isActive === episodes.link_m3u8 ? Colors.accent : '#ccc',
        borderRadius: 8,
      }}
      onPress={() => {
        console.log(episodes.link_m3u8);
        if (onSelectEpisode) {
          onSelectEpisode(episodes.link_m3u8);
        }

        // xử lý load video tại đây
      }}
    >
      <View className="flex items-center justify-center h-full">
        <Text
          className={`${
            isActive === episodes.link_m3u8
              ? 'text-accent'
              : 'text-white text-center text-sm'
          }`}
        >
          {episodes?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="h-[80px]">
      {/* Danh sách nút phân trang */}
      {/* <FlatList
        data={Array.from({length: totalPages}, (_, i) => i + 1)}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              margin: 5,
              padding: 8,
              backgroundColor: item === currentPage ? '#333' : '#ccc',
              borderRadius: 6,
            }}
            onPress={() => setCurrentPage(item)}
          >
            <Text style={{color: item === currentPage ? '#fff' : '#000'}}>
              {`${(item - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                item * ITEMS_PER_PAGE,
                episodes.length
              )}`}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.toString()}
      /> */}

      {/* Danh sách các tập của trang hiện tại */}
      <FlatList
        data={getPagedEpisodes()}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({item, index}) => renderEpisode(item, index)}
        contentContainerStyle={{padding: 10, paddingLeft: 0}}
      />
    </View>
  );
};

export default EpisodeList;

const styles = StyleSheet.create({});
