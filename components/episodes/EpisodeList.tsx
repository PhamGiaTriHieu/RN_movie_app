import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '@/libs/constants/colors';
import {
  IEpisode,
  IServerDetail,
} from '@/libs/interfaces/movie-detail.interface';

import {Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 70;
const ITEM_SPACING = 8;
const TOTAL_WIDTH = ITEM_WIDTH + ITEM_SPACING;

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
  const [isPressedIndex, setIsPressedIndex] = useState<number | null>(null);

  const [shouldCenter, setShouldCenter] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  console.log('🚀 ~ flatListRef:', flatListRef);

  useEffect(() => {
    const findItem = episodes[0].server_data.find(
      (episode) => episode.link_m3u8 === episodePlaying
    );

    if (findItem) {
      setIsActive(findItem.link_m3u8);
    }
    const findIndex = episodes[0].server_data.findIndex(
      (episode) => episode.link_m3u8 === episodePlaying
    );

    if (findIndex === -1 || !flatListRef.current) return;

    // set scroll active episode
    const isFirstFew = findIndex <= 2;

    setShouldCenter(!isFirstFew);
    flatListRef.current.scrollToIndex({
      index: findIndex,
      animated: true,
      viewPosition: 0,
    });
  }, [episodePlaying]);

  const renderEpisode = (episodes: IServerDetail, index: number) => {
    return (
      <Pressable
        className={`${isPressedIndex === index ? 'pressed' : ''} `}
        style={{
          padding: 10,
          marginRight: ITEM_SPACING,
          // marginLeft: index === 0 ? 0 : 5,
          borderWidth: 1,
          borderColor: isActive === episodes.link_m3u8 ? Colors.accent : '#ccc',
          borderRadius: 8,
          height: 50,
          width: ITEM_WIDTH,
        }}
        android_ripple={{color: 'rgba(255,255,255,0.2)', borderless: false}}
        onPress={() => {
          console.log(episodes.link_m3u8);
          if (onSelectEpisode) {
            onSelectEpisode(episodes.link_m3u8);
          }

          // xử lý load video tại đây
        }}
        onPressIn={() => setIsPressedIndex(index)}
        onPressOut={() => setIsPressedIndex(null)}
      >
        <View className="flex items-center justify-center h-full">
          <Text
            className={`text-center text-sm ${
              isActive === episodes.link_m3u8 ? 'text-accent' : 'text-white'
            }`}
          >
            {episodes?.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="h-[80px] mt-4">
      <FlatList
        ref={flatListRef}
        data={episodes[0].server_data}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({item, index}) => renderEpisode(item, index)}
        getItemLayout={(_, index) => ({
          length: TOTAL_WIDTH,
          offset: TOTAL_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 500);
        }}
        contentContainerStyle={{
          // padding: 10,
          // paddingLeft: 0,
          // paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
          paddingHorizontal: shouldCenter ? (SCREEN_WIDTH - ITEM_WIDTH) / 2 : 0,
        }}
      />
    </View>
  );
};

export default EpisodeList;

const styles = StyleSheet.create({});
