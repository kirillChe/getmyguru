import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import {ImageGridProvider as ImageGrid } from 'providers';
import Search from './Search';
import { useIntl } from 'hooks';
import messages from './Main.messages';

const styles = theme => ({
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
    }
});

const Main = (props) => {
    const { classes } = props;
    const { formatMessage } = useIntl();
    const [customFilter, setCustomFilter] = useState(false);
    const [rawFilters, setRawFilters] = useState({});

    return (
        <React.Fragment>
            <div className={classes.heroUnit}>
                <div className={classes.heroContent}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        {formatMessage(messages.companyName)}
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        {formatMessage(messages.slogan)}
                    </Typography>
                    <Search
                        setCustomFilter={setCustomFilter}
                        setRawFilters={setRawFilters}
                    />
                </div>
            </div>
            {customFilter ?
                (<div>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        {formatMessage(messages.foundText)}
                    </Typography>
                    < ImageGrid
                        customFilter={customFilter}
                        rawFilters={rawFilters}
                    />
                </div>) :
                (<div>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        {formatMessage(messages.mostRated)}
                    </Typography>
                    < ImageGrid attr={'rated'} />
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        {formatMessage(messages.lastJoined)}
                    </Typography>
                    <ImageGrid attr={'last'}/>
                </div>)
            }
        </React.Fragment>
    );
};

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);