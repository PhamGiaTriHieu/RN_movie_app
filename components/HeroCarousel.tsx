import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import colors from '@/libs/colorTest';
import {IItemLatest} from '@/libs/interfaces/latest-movie.interface';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface IHeroCarouselProps {
  movies: IItemLatest[];
  onMoviePress: (movie: IItemLatest) => void;
}

export default function HeroCarousel({
  movies,
  onMoviePress,
}: IHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;

    const newIndex = Math.round(contentOffsetX / SCREEN_WIDTH);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: index * SCREEN_WIDTH, animated: true});
    }
  };

  // Auto scroll functionality
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

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % movies.length;
      scrollToIndex(nextIndex);
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={() => {
          if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
          }
        }}
        onTouchEnd={startAutoScroll}
      >
        {movies.map((movie, index) => (
          <TouchableOpacity
            key={movie._id}
            activeOpacity={0.9}
            onPress={() => onMoviePress(movie)}
            style={styles.slideContainer}
          >
            <ImageBackground
              source={{uri: movie.poster_url}}
              style={styles.image}
              resizeMode="stretch"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
              >
                <View style={styles.textContainer}>
                  {movie.origin_name && (
                    <Text style={styles.originalTitle}>
                      {movie.origin_name}
                    </Text>
                  )}
                  <Text style={styles.title}>{movie.name}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    width: '100%',
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: 450,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  originalTitle: {
    color: colors.dark.accent,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    color: colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genrePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: colors.dark.text,
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.dark.text,
    width: 12,
    height: 8,
  },
});
