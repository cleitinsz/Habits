import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import CheckBox from '../components/CheckBox'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { api } from '../lib/axios'

const availableWeekDays = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado',]

const New = () => {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleWeekDay(weekDayIndex: number) {
    if(weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
    } else{
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }

  }

  async function handleCreateNewHabit(){
    try{
      if(!title.trim() || weekDays.length === 0 ){
         Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha a recorrência.')
      } else {
        await api.post('/habits', {title, weekDays})

      setTitle('');
      setWeekDays([]);
      
      Alert.alert('Novo hábito', 'Hábito criado com sucesso.')
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível criar um novo hábito')
    }
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 75}}>
        <BackButton/>

        <Text className='mt-8 text-white font-extrabold text-3xl'>
          Criar hábito
        </Text>
        <Text className='mt-6 text-white font-semibold text-base'>
          Qual seu compromentimento?
        </Text>

        <TextInput className='h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600'
        placeholder='ex.: Exercícios, dormir bem, etc...'
        placeholderTextColor={colors.zinc[400]}
        onChangeText={setTitle}
        value={title}
        />

        <Text className='font-semibold mt-12 mb-3 text-white text-base'>
          Qual a recorrência?
        </Text>
        {
          availableWeekDays.map((weekDay, index) => (
            <CheckBox 
            key={weekDay}
            checked={weekDays.includes(index)}
            title={weekDay}
            onPress={() => handleToggleWeekDay(index)}
            />
          ))
        }
        

        <TouchableOpacity onPress={handleCreateNewHabit} className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-24'
        activeOpacity={0.7}>
          <Feather name='check' size={20} color={colors.white}/>

          <Text className='font-semibold text-base text-white ml-2'>
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default New