import {
  FlatList,
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
import {apiClient} from '@/services/axios';
import {useDebounce} from '@uidotdev/usehooks';
import {
  TMoviesData,
  TResponseSearchData,
} from '@/libs/interfaces/search-movies.interface';
import MovieCard from '@/components/cards/MovieCard';

interface ISearchProps {
  placeholder: string;
  onPress?: () => void;
  onClose?: () => void;
}

const SearchBar = ({placeholder, onPress, onClose}: ISearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [resultData, setResultData] = useState<TResponseSearchData | []>([]);
  const [movies, setMovies] = useState<TMoviesData[] | []>([]);

  const inputRef = useRef<TextInput>(null);

  const debouncedSearchTerm = useDebounce(searchValue, 300);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const getSearchMovies = async () => {
    const response = await apiClient.get(
      `tim-kiem?keyword=${debouncedSearchTerm}`
    );
    return response.data;
  };

  const {data} = useQuery({
    queryKey: ['search', searchValue],
    queryFn: getSearchMovies,
    enabled: !!debouncedSearchTerm,
  });

  useEffect(() => {
    if (searchValue) {
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
    if (onClose) {
      onClose();
    }
  };

  return (
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
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
