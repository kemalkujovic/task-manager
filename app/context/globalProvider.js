"use client";
import { createContext, useContext, useEffect, useState } from "react";
import themes from "./themes";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
export const GlobalContext = createContext();

export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState();
  const [selectedTheme, setSelectedTheme] = useState(0);

  const [tasks, setTasks] = useState([]);

  const theme = themes[selectedTheme];

  const allTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/tasks");
      console.log(res.data);
      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted");

      allTasks();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const completedTasks = tasks.filter((task) => task.isComplated);
  const importantTasks = tasks.filter((task) => task.isImportant);
  const incompleteTasks = tasks.filter((task) => !task.isComplated);

  useEffect(() => {
    if (user) allTasks();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        tasks,
        deleteTask,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
      }}
    >
      <GlobalUpdateContext.Provider value={{}}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
