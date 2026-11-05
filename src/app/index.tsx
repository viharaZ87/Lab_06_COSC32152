import * as Notifications from 'expo-notifications';
import {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function ReminderTab() {
  const[isReminding, setIsReminding] = useState(false);
  const[message,setMessage]=useState("Time to drink a glass of water!");
  const[intervalMinutes,setIntervalMinutes]=useState(1);


//Request notification permissions on mount
  useEffect(()=>{
    async function requestPermissions(){
      const {status} = await Notifications.requestPermissionsAsync();
      if(status!=='granted'){
        Alert.alert('Permission required','We need notifications to remind you to drink water!');
      }
    }
    requestPermissions();
  },[]);

  //Shedule a notification
  async function scheduleReminder(){
    await Notifications.requestPermissionsAsync(); // Safe check jist in case

    //Clear old ones first so they don't stack up
    await Notifications.cancelAllScheduledNotificationsAsync();

    //Schedule the new notification
    await Notifications.scheduleNotificationAsync({
      content:{ title:"💧Hydration Alert",//Notification title 
        body:message,
        sound: true,
      },
      
      trigger:{
        type:Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds:intervalMinutes*60,
        repeats:true,
      },
    });

    setIsReminding(true);
    Alert.alert("Set!",'Reminding you every ${intervalMinutes} minutes.');
  }

  async function stopReminder(){
    await Notifications.cancelAllScheduledNotificationsAsync();
    setIsReminding(false);
    Alert.alert("Stopped!","Reminders canceled.");
  }

  return (
    <View style={styles.container}>
      <Text style= {styles.emoji}>🥤</Text>

      <Text style={styles.lable}></Text>Set Interval(minutes)</Text>
      <TextInput style={styles.input}  value={intervalMinutes.toString()} onChangeText={text=>setIntervalMinutes(ParseInt(text) || 1)} keyBoardType="numeric" />

      <Text style={styles.status}>
         Status:{isReminding? "Active 🟢":"Inactive 🔴"} 
        </Text>

      
  );
}

