import {
  FlatList,
  InteractionManager,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '@/libs/constants/colors';
import {
  IEpisode,
  IServerDetail,
} from '@/libs/interfaces/movie-detail.interface';

// import {Dimensions} from 'react-native';
// const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 70;
const ITEM_SPACING = 8;
const TOTAL_WIDTH = ITEM_WIDTH + ITEM_SPACING;

interface IEpisodeListProps {
  episodes: IEpisode[] | undefined;
  onSelectEpisode?: (episode: string) => void;
  episodePlaying: string | null;
  serverLangs?: string[] | null;
  onSelectServerLang?: (index: number) => void;
  episodeLang?: number;
}

const EpisodeList = ({
  episodes,
  onSelectEpisode,
  episodePlaying,
  serverLangs,
  episodeLang = 0,
  onSelectServerLang,
}: IEpisodeListProps) => {
  if (!episodes) {
    return null;
  }

  const [isActive, setIsActive] = useState(episodePlaying);
  const [isPressedIndex, setIsPressedIndex] = useState<number | null>(null);
  // const [indexScrollTo, setIndexScrollTo] = useState<number>(0);
  const [currentEpisodes, setCurrentEpisode] = useState<IServerDetail[]>([]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const {server_data} = episodes[0];
    setCurrentEpisode(server_data);
  }, [episodes]);

  useEffect(() => {
    const findItem = currentEpisodes.find(
      (episode) => episode.link_m3u8 === episodePlaying
    );
    if (findItem) {
      setIsActive(findItem.link_m3u8);
    }
  }, [episodePlaying, currentEpisodes]);

  useEffect(() => {
    if (!isActive) return;

    const findIndex = currentEpisodes.findIndex(
      (episode) => episode.link_m3u8 === episodePlaying
    );

    if (findIndex === -1 || !flatListRef.current) return;

    // setIndexScrollTo(findIndex);
    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToIndex({
        index: findIndex,
        animated: true,
        viewOffset: 0,
        viewPosition: 0,
      });
    });

    // flatListRef?.current?.scrollToIndex({
    //   index: findIndex,
    //   // viewOffset: ITEM_SPACING,
    //   viewOffset: 0,
    //   animated: true,
    //   viewPosition: 0,
    // });
  }, [isActive, currentEpisodes]);

  const renderEpisode = (episodes: IServerDetail, index: number) => {
    return (
      <Pressable
        className={`${isPressedIndex === index ? 'pressed' : ''} `}
        style={{
          padding: 10,
          marginRight: ITEM_SPACING,
          borderWidth: 1,
          borderColor: isActive === episodes.link_m3u8 ? Colors.accent : '#ccc',
          borderRadius: 8,
          height: 50,
          width: ITEM_WIDTH,
        }}
        android_ripple={{color: 'rgba(255,255,255,0.2)', borderless: false}}
        onPress={() => {
          if (onSelectEpisode) {
            onSelectEpisode(episodes.link_m3u8);
          }
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
    <View className="mt-4">
      <View className="mb-4">
        <FlatList
          data={serverLangs}
          renderItem={({item, index}) => {
            return (
              <View className="">
                <TouchableOpacity
                  className={`py-2 px-3 border border-1 border-[#ccc] rounded-lg mr-2 ${
                    episodeLang === index ? 'border-accent' : ''
                  }`}
                  onPress={() => {
                    if (onSelectServerLang) {
                      onSelectServerLang(index);
                    }
                  }}
                >
                  <Text className="text-white text-sm">{item}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          horizontal
          keyExtractor={(item, index) => item + index}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        ref={flatListRef}
        initialScrollIndex={0}
        data={currentEpisodes}
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
        // contentContainerStyle={{
        //   paddingLeft: ITEM_SPACING,
        // }}
      />
    </View>
  );
};

export default EpisodeList;

const styles = StyleSheet.create({});
