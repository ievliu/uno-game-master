import { Game } from "@uno-game/protocols";
import React, { createContext, useReducer } from "react";

export interface DashboardState {
    games: Game[];
    loadingCreateGame: boolean;
    loadingGetGames: boolean;
}

const initialState: DashboardState = {
    games: [],
    loadingCreateGame: false,
    loadingGetGames: true,
};

type DashboardAction =
    | { type: "SET_GAMES"; payload: Game[] }
    | { type: "SET_LOADING_CREATE_GAME"; payload: boolean }
    | { type: "SET_LOADING_GET_GAMES"; payload: boolean };

export const DashboardStateContext = createContext<{
    state: DashboardState;
    dispatch: React.Dispatch<DashboardAction>;
}>({
    state: initialState,
    dispatch: () => undefined,
});

const reducer = (
    state: DashboardState,
    action: DashboardAction
): DashboardState => {
    switch (action.type) {
        case "SET_GAMES":
            return { ...state, games: action.payload };
        case "SET_LOADING_CREATE_GAME":
            return { ...state, loadingCreateGame: action.payload };
        case "SET_LOADING_GET_GAMES":
            return { ...state, loadingGetGames: action.payload };
        default:
            return state;
    }
};

export const DashboardStateProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DashboardStateContext.Provider value={{ state, dispatch }}>
            {children}
        </DashboardStateContext.Provider>
    );
};
