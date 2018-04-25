import { AsyncStorage } from 'react-native'
import {USER_STORE} from '../Config/AppConfig'
export async function setAsync(key, value){
  try {
    await AsyncStorage.setItem(`${USER_STORE}:${key}`, `${value}`)
  } catch (error) {
    // Error saving data
    console.log(`Error setting AsyncStorage with key: ${key}`, error)
    return `Could not set AsyncStorage ${key} with ${value}`
  }
    console.log('finished setAsync')
}
export const getAsync = async (key) =>{
  let token = await AsyncStorage.getItem('@USER_STORE:token')
  return token
}
