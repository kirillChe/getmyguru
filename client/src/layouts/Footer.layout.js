import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { useIntl } from 'hooks';
import messages from './Footer.messages';

const styles = theme => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    }
});

function Footer(props) {
    const { classes } = props;
    const { formatMessage } = useIntl();
    return (
        <React.Fragment>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    {formatMessage(messages.companyFooter)}
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" component="p">
                    {formatMessage(messages.footerText)}
                </Typography>
            </footer>
        </React.Fragment>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);