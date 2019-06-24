import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ImageGrid from './ImageGrid';
import {Search} from 'components/SearchArea';

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
    const [customFilter, setCustomFilter] = useState(false);
    const [rawFilters, setRawFilters] = useState({});

    return (
        <React.Fragment>
            <div className={classes.heroUnit}>
                <div className={classes.heroContent}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Bla-Bla-Bla Text
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        Something short and leading about the site.
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
                        We found somebody for you.
                    </Typography>
                    < ImageGrid
                        customFilter={customFilter}
                        rawFilters={rawFilters}
                    />
                </div>) :
                (<div>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        The most rated.
                    </Typography>
                    < ImageGrid attr={'rated'} />
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        Last joined.
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