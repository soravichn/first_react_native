import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import ScreennWrapper from '../components/screennWrapper'
import randomImage from '../assets/images/randomImage'
import EmptyList from '../components/emptyList'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../theme'

const items = [
  {
    id: 1,
    place: 'Gujrat',
    country: 'Pakistan'
  },
  {
    id: 2,
    place: 'London Eye',
    country: 'England'
  },
  {
    id: 3,
    place: 'Washington dc',
    country: 'America'
  },
  {
    id: 4,
    place: 'New york',
    country: 'America'
  },
]

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ScreennWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>Expensify</Text>
        <TouchableOpacity className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image source={require('../assets/images/banner.png')} className="w-60 h-60" />
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>Recent Trips</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddTrip')} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
            <Text className={colors.heading}>Add Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 430 }}>
          <FlatList
            data={items}
            numColumns={2}
            ListEmptyComponent={<EmptyList message={"You haven't recordeed any trips yet"} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: 10
            }}
            contentContainerStyle={{
              gap: 10
            }}
            className="mx-1"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate('TripExpenses', { ...item })} className="bg-white p-3 rounded-2xl shadow-sm flex-grow">
                  <View>
                    <Image source={randomImage()} className="w-36 h-36 mb-2" />
                    <Text className={`${colors.heading} font-bold`}>{item.place}</Text>
                    <Text className={`${colors.heading} text-xs`}>{item.country}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </ScreennWrapper>
  )
}