import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import IconFontAwesome from '@expo/vector-icons/FontAwesome';
import {Colors} from '@/libs/constants/colors';
import {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import {useDebounce} from '@uidotdev/usehooks';
import Modal from 'react-native-modal';
import {
  TMoviesData,
  TResponseSearchData,
} from '@/libs/interfaces/search-movies.interface';
import MovieCard from '@/components/cards/MovieCard';
import useSearchModalStore from '@/libs/stores/uesSearchModalStore';
// import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import {apiClientWithVersion} from '@/services/api';

interface ISearchProps {
  placeholder: string;
}

const SearchBarModal = ({placeholder}: ISearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [resultData, setResultData] = useState<TResponseSearchData | []>([]);
  const [movies, setMovies] = useState<TMoviesData[] | []>([]);

  const {isVisible, closeModal} = useSearchModalStore();

  const inputRef = useRef<TextInput>(null);

  const debouncedSearchTerm = useDebounce(searchValue, 400);

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const getSearchMovies = async (): Promise<TResponseSearchData> => {
    const response = await apiClientWithVersion.get(
      `tim-kiem?keyword=${debouncedSearchTerm}`
    );
    return response.data;
  };

  const {data, isFetched} = useQuery({
    queryKey: ['search', searchValue],
    queryFn: getSearchMovies,
    enabled: !!debouncedSearchTerm,
  });

  useEffect(() => {
    if (searchValue && data) {
      setResultData(data);
      data?.items?.length ? setMovies(data.items) : setMovies([]);
    } else {
      setResultData([]);
      setMovies([]);
    }
  }, [debouncedSearchTerm, data]);

  const handleTextChange = (value: string) => {
    setSearchValue(value);
  };

  const handleCancel = () => {
    setSearchValue('');
    closeModal();
  };

  return (
    <View>
      <StatusBar />
      <Modal
        isVisible={isVisible}
        coverScreen={true}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        style={{margin: 0}}
        className="bg-primary"
      >
        <SafeAreaView className="flex-1 mt-10">
          <View className="w-full px-4">
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-row items-center gap-2 border border-secondary rounded-full h-[42px] px-4 max-w-[300px] w-full">
                <TextInput
                  className="text-white flex-1"
                  // onPress={onPress}
                  onChangeText={(value) => handleTextChange(value)}
                  value={searchValue}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.secondary}
                  ref={inputRef}
                />
                {searchValue ? (
                  <IconFontAwesome
                    name="times-circle-o"
                    size={24}
                    color={Colors.white}
                    onPress={() => setSearchValue('')}
                  />
                ) : (
                  <TouchableOpacity>
                    <Icon name="search" size={22} color={Colors.white} />
                  </TouchableOpacity>
                )}
              </View>

              <View>
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-white font-bold text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Render Items */}
            <View className="w-full pb-[120px] mt-4">
              <FlatList
                data={movies}
                renderItem={({item}) => {
                  return <MovieCard {...item} />;
                }}
                keyExtractor={(item) => item._id}
                // numColumns={2}
                // columnWrapperStyle={{
                //   justifyContent: 'flex-start',
                //   gap: 20,
                //   paddingRight: 5,
                //   marginBottom: 10,
                // }}
                scrollEnabled={true}
                className="mt-2 w-full"
                ListEmptyComponent={
                  isFetched && data?.items.length === 0 ? (
                    <View className="flex flex-row justify-center w-full mt-10">
                      <Text className="text-white font-semibold text-2xl">
                        No movies found
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default SearchBarModal;

const styles = StyleSheet.create({});
