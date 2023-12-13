import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    gameCardButton: {
        maxWidth: 400,
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0, 0, 2, 0),
            width: "100vw",
        },
    },
    pageTitleContainer: {
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
        },
    },
    pageSubtitleContainer: {
        fontSize: 20,
        paddingTop: theme.spacing(2),
        color: "#888888",
    },
}));

export default useStyles;
