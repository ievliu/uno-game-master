import { Grid, makeStyles } from "@material-ui/core";
import React from "react";

import { Menu, NotificationBar } from "@/components";
import Routes from "@/routes";

import colors from "@/styles/colors";
import { DashboardStateProvider } from "./pages/Dashboard/DashboardStateContext";

const useStyles = makeStyles((theme) => ({
    routesContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: colors.palette.blue1,
    },
    appContainer: {
        overflowX: "hidden",
        backgroundColor: colors.grayScale[1],
        height: "100%",
        flex: 1,
    },
    socketContainer: {
        height: "100%",
        flex: 1,
    },
}));

const App: React.FC = () => {
    const classes = useStyles();

    return (
        <>
            <Grid
                container
                direction="column"
                className={classes.socketContainer}
            >
                <NotificationBar />

                <Grid container className={classes.appContainer}>
                    <Menu />

                    <Grid
                        container
                        direction="column"
                        className={classes.routesContainer}
                    >
                        <DashboardStateProvider>
                            <Routes />
                        </DashboardStateProvider>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default App;
