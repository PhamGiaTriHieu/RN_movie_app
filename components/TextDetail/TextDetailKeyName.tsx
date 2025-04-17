import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface IData {
  id: string;
  name: string;
  slug: string;
}

interface ITextDetailKeyNameProps {
  title: string;
  data: IData[] | undefined;
}
const TextDetailKeyName = ({title, data}: ITextDetailKeyNameProps) => {
  return (
    <View className="flex-row items-start justify-start gap-1 mt-2 px-5">
      <View className="w-[20%]">
        <Text className="text-secondary text-sm">{title}: </Text>
      </View>
      <View className="w-[80%]">
        <Text className="text-secondary text-sm">
          {(data &&
            data
              .slice(0, 4)
              .map((item) => item.name)
              .join(', ')) ||
            'đang câp nhật'}
        </Text>
      </View>
    </View>
  );
};

export default TextDetailKeyName;

const styles = StyleSheet.create({});
