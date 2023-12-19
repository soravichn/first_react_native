import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScreennWrapper from '../components/screennWrapper'
import randomImage from '../assets/images/randomImage'
import EmptyList from '../components/emptyList'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { colors } from '../theme'
import { signOut } from 'firebase/auth'
import { auth, tripsRef } from '../config/firebase'
import { useSelector } from 'react-redux'
import { getDocs, orderBy, query, where } from 'firebase/firestore'

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

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);
  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};

export default function HomeScreen() {
  const navigation = useNavigation();

  const { user } = useSelector(state => state.user);
  const [trips, setTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const fetchTrips = async () => {
    try {
      const q = query(tripsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id })
      });
      setTrips(data);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchTrips();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchTrips();
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  }
  return (
    <ScreennWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>Expensify</Text>
        <TouchableOpacity onPressIn={handleLogout} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
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
        <View style={{ height: 420 }}>
          <FlatList
            refreshControl={
              <RefreshControl tintColor={colors.button} refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={formatData(trips, 2)}
            numColumns={2}
            ListEmptyComponent={<EmptyList message={"You haven't recordeed any trips yet"} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: 10
            }}
            contentContainerStyle={{
              gap: 10,
            }}
            className="mx-1"
            renderItem={({ item }) => {
              if (item.empty === true) {
                return <View className="invisible flex-1" />;
              }
              return (
                <TouchableOpacity onPress={() => navigation.navigate('TripExpenses', { ...item })} className="bg-white p-3 rounded-2xl shadow-sm flex-1">
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