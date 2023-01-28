import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'
import Header from '../components/Header'
import { Loading } from '../components/Loading'
import { HabitDay } from '../components/HabitDay'
import { DAY_SIZE } from '../components/HabitDay'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '../lib/axios'
import dayjs from 'dayjs'

type SummaryProps = {
  id: string,
  date: string,
  amount: number,
  completed: number,
}[]

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSize = 18 * 5;
const AmountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true)
      const response = await api.get('summary');
      setSummary(response.data)
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData();
  }, []))

  if(loading) {
    return (
      <Loading/>
    )
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      {/* HEADER */}
      <Header/>

      {/* Days of the Week */}

      <View className='flex-row mt-6 mb-2'>
        {
          weekDays.map((weekDay, i) => (
            <Text key={`${weekDay}-${i}`} className='text-zinc-400 text-xl font-bold text-center mx-1' style={{ width: DAY_SIZE}}>
              {weekDay}
            </Text>
          ))
        }
      </View>


      {/* Days Square */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50}}>
        { 
          summary &&
          <View className='flex-row flex-wrap'>
          {
            datesFromYearStart.map(date => {
              const dayWithHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              return (
              <HabitDay 
              key={date.toISOString()}
              onPress={() => navigate('habit', { date: date.toISOString() })} date={date}
              amountOfHabits={dayWithHabits?.amount}
              amountCompleted={dayWithHabits?.completed}
              />
            )})
          }
          {
            AmountOfDaysToFill > 0 && Array.from({ length: AmountOfDaysToFill }).map((_, index) => (
              <View
                className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))
          }
          </View>
        }
      </ScrollView>

      
    </View>
  )
}

export default Home