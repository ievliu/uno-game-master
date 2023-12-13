import { Button, Grid, Typography } from "@material-ui/core";
import { Add as CreateIcon } from "@material-ui/icons";
import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import {
    CreateGameEventResponse,
    CreateSuperGameEventResponse,
} from "@uno-game/protocols";

import DeviceUtil from "@/utils/device";
import { orderByCreatedAtDesc } from "@/utils/game";

import api from "@/services/api";
import SocketService from "@/services/socket";

import { Divider, GameCard, LoadingComponent } from "@/components";

import useSocket from "@/hooks/useSocket";
import useStyles from "@/pages/Dashboard/styles";
import useCustomStyles from "@/styles/custom";
import { DashboardStateContext } from "./DashboardStateContext";

const getTimeOfDay = () => {
    const hours = new Date().getHours();

    if (hours >= 0 && hours < 12) {
        return "morning";
    }

    if (hours >= 12 && hours < 18) {
        return "afternoon";
    }

    return "night";
};

const Dashboard: React.FC = () => {
    const { state, dispatch } = useContext(DashboardStateContext);
    const { games, loadingCreateGame, loadingGetGames, greetingMessage } =
        state;

    const history = useHistory();
    const classes = useStyles();
    const customClasses = useCustomStyles({});
    const socket = useSocket();

    useEffect(() => {
        const fetchGames = async () => {
            dispatch({ type: "SET_LOADING_GET_GAMES", payload: true });
            const { data } = await api.get("/games");

            dispatch({ type: "SET_GAMES", payload: data.games });
            dispatch({ type: "SET_LOADING_GET_GAMES", payload: false });
            dispatch({
                type: "SET_GREETING_MESSAGE",
                payload: `Good ${getTimeOfDay()}!`,
            });
        };

        socket.onGameListUpdated(async () => {
            if (loadingGetGames) {
                return;
            }

            dispatch({ type: "SET_LOADING_GET_GAMES", payload: true });
            const { data } = await api.get("/games");
            dispatch({ type: "SET_GAMES", payload: data.games });
            dispatch({ type: "SET_LOADING_GET_GAMES", payload: false });
            dispatch({
                type: "SET_GREETING_MESSAGE",
                payload: `Good ${getTimeOfDay()}!`,
            });
        });
        fetchGames();
    }, []);

    const handleCreateNewGame = async () => {
        dispatch({ type: "SET_LOADING_CREATE_GAME", payload: true });

        const { gameId } = await SocketService.emit<
            unknown,
            CreateGameEventResponse
        >("CreateGame", {});

        dispatch({ type: "SET_LOADING_CREATE_GAME", payload: false });

        history.push(`/${gameId}`);
    };

    const handleCreateNewSuperGame = async () => {
        dispatch({ type: "SET_LOADING_CREATE_GAME", payload: true });

        const { gameId } = await SocketService.emit<
            unknown,
            CreateSuperGameEventResponse
        >("CreateSuperGame", {});

        dispatch({ type: "SET_LOADING_CREATE_GAME", payload: false });

        history.push(`/${gameId}`);
    };

    return (
        <LoadingComponent loading={loadingGetGames}>
            <>
                <Grid container className={customClasses.pageContainer}>
                    <Grid
                        container
                        alignItems="center"
                        justify="flex-start"
                        className={classes.pageTitleContainer}
                    >
                        <Typography variant="h1" color="textSecondary">
                            Games
                        </Typography>

                        {DeviceUtil.isMobile ? (
                            <Divider orientation="horizontal" size={3} />
                        ) : (
                            <Divider orientation="vertical" size={5} />
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CreateIcon />}
                            onClick={handleCreateNewGame}
                            disabled={loadingCreateGame}
                        >
                            {loadingCreateGame
                                ? "CREATING..."
                                : "CREATE NEW GAME"}
                        </Button>

                        {DeviceUtil.isMobile ? (
                            <Divider orientation="horizontal" size={3} />
                        ) : (
                            <Divider orientation="vertical" size={5} />
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CreateIcon />}
                            onClick={handleCreateNewSuperGame}
                            disabled={loadingCreateGame}
                        >
                            {loadingCreateGame
                                ? "CREATING..."
                                : "CREATE NEW SUPER GAME"}
                        </Button>
                    </Grid>

                    <Typography
                        variant="h1"
                        color="textSecondary"
                        className={classes.pageSubtitleContainer}
                    >
                        {greetingMessage}
                    </Typography>

                    <Divider orientation="horizontal" size={4} />

                    <Grid container wrap="wrap">
                        {games
                            .sort(orderByCreatedAtDesc)
                            .filter((game) => game.status !== "ended")
                            .map((game) => (
                                <Button
                                    {...{
                                        component: Link,
                                        to: `/${game.id}`,
                                        className: classes.gameCardButton,
                                    }}
                                >
                                    <GameCard
                                        key={game.id}
                                        gameId={game.id}
                                        name={game.title}
                                        players={game.players}
                                        status={game.status}
                                        maxPlayers={game.maxPlayers}
                                        mode="preview"
                                    />
                                </Button>
                            ))}
                    </Grid>
                </Grid>
            </>
        </LoadingComponent>
    );
};

export default Dashboard;
