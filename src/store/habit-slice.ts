import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Habit{
    id: string;
    name: string;
    frequency: "daily" | "weekly";
    completedDates: string[];
    createdAt: string;
}

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
}

const initialState: HabitState = {
    habits: [],
    isLoading: false,
    error: null,
};

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));// 1s timeout
    const mockHabits: Habit[] = [
      {
        id: "1",
        name: "Gym",
        frequency: "daily",
        completedDates: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Read",
        frequency: "daily",
        completedDates: [],
        createdAt: new Date().toISOString(),
      },
    ];
    return mockHabits;
  });

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabit: (
            state,
            action: PayloadAction<{name: string;frequency: "daily" | "weekly"}>
        ) => {
                const newHabit: Habit = {
                    id: Date.now().toString(),
                    name: action.payload.name,
                    frequency: action.payload.frequency,
                    completedDates: [],
                    createdAt: new Date().toISOString(),
                }
                state.habits.push(newHabit);
        },
        toggleHabit: (
            state,
            action: PayloadAction<{id: string; date: string }>
        ) => {
            //check if habit is in habits list
            const habit = state.habits.find((h)=>h.id==action.payload.id)

            if(habit){
                // check if date when toggled is present in a specific habit.
                const index = habit.completedDates.indexOf(action.payload.date)
                if(index>-1){
                    // remove specific date from completed dates
                    habit.completedDates.splice(index,1);
                }else{
                    habit.completedDates.push(action.payload.date);
                }
            }
        },
        removeHabit: (
            state,
            action: PayloadAction<{id: string}>
        ) => {
            const habit = state.habits.find((h)=>h.id==action.payload.id)
            if(habit){
                const index = state.habits.indexOf(habit);
                if(index>-1){
                    state.habits.splice(index,1);
                }
            }
            
        },
    },
    extraReducers: (builder) => {
        // while fetching is taking place
        builder
        .addCase(fetchHabits.pending, (state)=>{
            state.isLoading = true;
        })
        // fetching is complete
        .addCase(fetchHabits.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.habits = action.payload;
        })
        // fetching failed
        .addCase(fetchHabits.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.error.message || "failed to fetch habits";
        })
    },
});

export const {addHabit,toggleHabit,removeHabit} = habitSlice.actions;

export default habitSlice.reducer;
