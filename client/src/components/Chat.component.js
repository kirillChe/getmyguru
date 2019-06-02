import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(({ palette, spacing }) => {
    const radius = spacing(2.5);
    const rightBgColor = palette.primary.main;
    // if you want the same as facebook messenger, use this color '#09f'
    return {
        msg: {
            padding: spacing(1, 2),
            borderRadius: 4,
            marginBottom: 4,
            display: "inline-block",
            wordBreak: "break-all",
            fontFamily:
            // eslint-disable-next-line max-len
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        },
        leftRow: {
            textAlign: "left"
        },
        left: {
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
            backgroundColor: palette.grey[100]
        },
        leftFirst: {
            borderTopLeftRadius: radius
        },
        leftLast: {
            borderBottomLeftRadius: radius
        },
        rightRow: {
            textAlign: "right"
        },
        right: {
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            backgroundColor: rightBgColor,
            color: palette.common.white
        },
        rightFirst: {
            borderTopRightRadius: radius
        },
        rightLast: {
            borderBottomRightRadius: radius
        }
    };
});

const ChatMessages = ({ messages, side, uniqKey }) => {
    const classes = useStyles();
    const attachClass = index => {
        if (index === 0) {
            return classes[`${side}First`];
        }
        if (index === messages.length - 1) {
            return classes[`${side}Last`];
        }
        return "";
    };
    return (
        <Grid
            container
            spacing={2}
            justify={side === "right" ? "flex-end" : "flex-start"}
        >
            <Grid item xs={8}>
                {messages.map((msg, i) => (
                    <div key={uniqKey} className={classes[`${side}Row`]}>
                        <Typography
                            align={"left"}
                            className={`${classes.msg} ${classes[side]} ${attachClass(i)}`}
                        >
                            {msg}
                        </Typography>
                    </div>
                ))}
            </Grid>
        </Grid>
    );
};

ChatMessages.propTypes = {
    uniqKey: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    side: PropTypes.oneOf(["left", "right"])
};
ChatMessages.defaultProps = {
    uniqKey: '123',
    messages: [],
    side: "left"
};
ChatMessages.metadata = {
    name: "Chat Messages"
};
ChatMessages.codeSandbox = "";

export default ChatMessages;
