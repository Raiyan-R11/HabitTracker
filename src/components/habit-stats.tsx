import { useSelector, useDispatch } from "react-redux"; 
import { fetchHabits, Habit } from "../store/habit-slice";
import { AppDispatch, RootState } from "../store/store";
import React, { useEffect } from "react";
import { LinearProgress, Paper, Typography } from "@mui/material";

const HabitStats: React.FC = () => {
    const {habits,isLoading,error} = useSelector((state: RootState)=>state.habits)//{habits} destructure
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
        dispatch(fetchHabits());
    },[])

    if(isLoading){
        return <LinearProgress/>
    }
    if(error){
        return <Typography color="error">{error}</Typography>
    }

    const getCompletedToday = () => {
        const today = new Date().toISOString().split("T")[0];

        return habits.filter((habit)=>
            habit.completedDates.includes(today)).length;
    }

    const getStreak = (habit: Habit) => {
        let streak = 0;
        const currentDate = new Date();

        while(true){
            const dateString = currentDate.toISOString().split("T")[0];

            if(habit.completedDates.includes(dateString)){
                streak++;
                currentDate.setDate(currentDate.getDate()-1);
            }else{
                break;
            }
        }
    return streak;
    }

    const getLongestStreak = () => {
        //spread habits arr. replace elements with streak. get max
        return Math.max(...habits.map(getStreak));
    }

    return (
        <Paper elevation={2} sx={{p: 2, mt: 4}}>
            <Typography variant="h6" gutterBottom>
                Habit Statistics
            </Typography>
            <Typography variant="body1">
                Total Habits:{habits.length}
            </Typography>
            <Typography variant="body1">
                Completed Today: {getCompletedToday()}
            </Typography>
            <Typography variant="body1">
                Longest Streak: {getLongestStreak()}
            </Typography>
        </Paper>

    )
  

}

export default HabitStats