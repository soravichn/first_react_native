import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScreennWrapper from '../components/screennWrapper'
import EmptyList from '../components/emptyList'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { colors } from '../theme'
import BackButton from '../components/backButton'
import ExpenseCard from '../components/expenseCard'
import { expensesRef } from '../config/firebase'
import { getDocs, query, where } from 'firebase/firestore'

const items = [
  {
    id: 1,
    title: 'ate sandwitch',
    amount: 4,
    category: 'food'
  },
  {
    id: 2,
    title: 'bought a jacket',
    amount: 50,
    category: 'shopping'
  },
  {
    id: 3,
    title: 'watched a movie',
    amount: 100,
    category: 'entertainment'
  },
]

export default function TripExpensesScreen(props) {
  const { id, place, country } = props.route.params;
  const navigation = useNavigation();

  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async () => {
    const q = query(expensesRef, where("tripId", "==", id));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push({ ...doc.data(), id: doc.id })
    });
    setExpenses(data);
  }

  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchExpenses();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScreennWrapper className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute z-10 top-0 left-0">
            <BackButton />
          </View>
          <Text className={`${colors.heading} text-xl font-bold text-center`}>{place}</Text>
          <Text className={`${colors.heading} text-xs text-center`}>{country}</Text>
        </View>

        <View className="flex-row justify-center items-center rounded-xl mb-4">
          <Image source={require('../assets/images/7.png')} className="w-80 h-80" />
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>Expenses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddExpense', { id, place, country })} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={colors.heading}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 430 }}>
            <FlatList
              refreshControl={
                <RefreshControl tintColor={colors.button} refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={expenses}
              ListEmptyComponent={<EmptyList message={"You haven't recordeed any expenses yet"} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({ item }) => {
                return (
                  <ExpenseCard item={item} />
                )
              }}
            />
          </View>
        </View>
      </View>
    </ScreennWrapper>
  )
}