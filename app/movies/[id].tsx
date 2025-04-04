import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useLocalSearchParams} from 'expo-router';
// import {useLocalSearchParams} from 'expo-router';

const MovieDetails = () => {
  const {id} = useLocalSearchParams();
  console.log('🚀 ~ MovieDetails ~ id:', id);
  return (
    <View className="bg-primary flex-1">
      <Text className="text-white">MovieDetails</Text>
      <ScrollView contentContainerStyle={{paddingBottom: 80}}></ScrollView>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({});
