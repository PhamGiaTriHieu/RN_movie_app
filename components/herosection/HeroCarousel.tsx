import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {IItemLatest} from '@/libs/interfaces/latest-movie.interface';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface IHeroCarouselProps {
  movies: IItemLatest[];
  onMoviePress: (slug: string) => void;
}

export default function HeroCarousel({
  movies,
  onMoviePress,
}: IHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<IItemLatest>>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % movies.length;
      scrollToIndex(nextIndex);
    }, 5000);
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [activeIndex]);

  useEffect(() => {
    if (movies.length) {
      startAutoScroll();
    }
  }, [movies]);

  const renderItem: ListRenderItem<IItemLatest> = ({item}) => (
    <View>
      <TouchableOpacity
        key={item._id}
        activeOpacity={0.9}
        onPress={() => onMoviePress(item.slug)}
        className="w-full"
        style={{width: SCREEN_WIDTH, height: 450}}
      >
        <ImageBackground
          source={{uri: item.poster_url}}
          className="w-full h-full"
          resizeMode="stretch"
        >
          <LinearGradient
            colors={['transparent', 'rgba(5, 0, 0, 0.1)', 'rgba(0,0,0,0.8)']}
            className="absolute w-full h-full"
          >
            <View className="justify-end h-full w-full pb-10 px-4">
              {item.origin_name && (
                <Text className="text-yellow-300 text-base font-semibold mb-1">
                  {item.origin_name}
                </Text>
              )}
              <Text className="text-white text-2xl font-bold">{item.name}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="w-full h-[450px]">
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }}
        onTouchStart={() => {
          if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
          }
        }}
        onTouchEnd={startAutoScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View className="flex-row absolute bottom-2 self-center z-20">
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full z-20 mx-1 ${
              index === activeIndex ? 'w-5 h-2 bg-white' : 'bg-white/40 '
            }`}
          />
        ))}
      </View>
    </View>
  );
}
