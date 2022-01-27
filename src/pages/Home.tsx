import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

import AsyncStorage from '@react-native-async-storage/async-storage'

export type EditTaskArgs = {
  taskId: number;
  taskNewTitle: string;
}
export function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const getData = async () => {
    const jsonValue = await AsyncStorage.getItem('@storage_tasksList') // Retorna uma string

    /*   console.log('funcao getData', jsonValue);
      console.log(typeof jsonValue)
      console.log('tasts: ', tasks.length) */

    if (jsonValue) {
      const newTaskStorage = JSON.parse(jsonValue); // Converte para um objeto
      setTasks(newTaskStorage);
    }
  }

  function handleAddTask(newTaskTitle: string) {

    const newTask = {
      id: new Date().getTime(),
      title: newTaskTitle,
      done: false
    }

    const duplicateTask = tasks.find(task => task.title === newTaskTitle);

    if (duplicateTask) {
      return Alert.alert("Task já cadastrada", "Vc não pode cadastrar uma task como mesmo nome");
    }

    if (newTaskTitle !== undefined && newTaskTitle !== null) {

      const newList = tasks.map(task => ({ ...task }));

      newList.push(newTask);

      const jsonValue = JSON.stringify(newList);
      AsyncStorage.setItem('@storage_tasksList', jsonValue);

      setTasks(newList);
    }
  }

  function handleToggleTaskDone(id: number) {
    const toogleTask = tasks.map(task => ({ ...task }));

    const foundTask = toogleTask.find(task => task.id === id);

    if (!foundTask) {
      return
    }

    foundTask.done = !foundTask.done;
    setTasks(toogleTask);

    const jsonValue = JSON.stringify(toogleTask);
    AsyncStorage.setItem('@storage_tasksList', jsonValue);
  }


  const handleRemoveTask = async (id: number) => {
    const newList = tasks.map(task => ({ ...task }));

    Alert.alert('Revomer item', 'Term certeza que você deseja remover esse item?', [
      {
        style: 'cancel',
        text: 'Não'
      },
      {
        style: 'destructive',
        text: 'Sim',
        onPress: () => {
          setTasks(oldTasks => oldTasks.filter(task => task.id !== id));
        }
      }
    ]);
    const jsonValue2 = JSON.stringify(newList);
    AsyncStorage.setItem('@storage_tasksList', jsonValue2);
  }

  function handleEditTask({ taskId, taskNewTitle }: EditTaskArgs) {
    const updatedTasks = tasks.map(task => ({ ...task }))

    const taskToBeUpdated = updatedTasks.find(task => task.id === taskId);

    if (!taskToBeUpdated) {
      return;
    }
    taskToBeUpdated.title = taskNewTitle;
    setTasks(updatedTasks);

    const jsonValue2 = JSON.stringify(updatedTasks);
    AsyncStorage.setItem('@storage_tasksList', jsonValue2);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      {tasks.length > 0 && (
        <>
          <TasksList
            tasks={tasks}
            toggleTaskDone={handleToggleTaskDone}
            removeTask={handleRemoveTask}
            editTask={handleEditTask}
          />

          {console.log('taskList', typeof tasks)}

        </>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB'
  }
})