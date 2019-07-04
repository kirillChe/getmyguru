import React from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'

import message from './Exception.messages'
import config from './typeConfig'

const styles = () => ({
    exception: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        minHeight: '500px'
    },
    imgBlock: {
        flex: '0 0 62.5%',
        width: '62.5%',
        paddingRight: '152px',
    },
    imgEle: {
        height: '360px',
        width: '100%',
        maxWidth: '430px',
        float: 'right',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundSize: 'contain'
    },
    content: {
        flex: 'auto'
    },
    h1: {
        color: '#434e59',
        fontSize: '72px',
        fontWeight: 600,
        lineHeight: '72px',
        marginBottom: '24px'
    },
    desc: {
        fontSize: '20px',
        lineHeight: '28px',
        marginBottom: '16px'
    },
    actions: {
        'button:not(:last-child)': {
            marginRight: '8px'
        }
    }
});

const Exception = (props) => {
    const { backText, type, title, desc, img, redirect, classes } = props;
    const pageType = type in config ? type : '404';

    return (
        <div className={classes.exception}>
            <div className={classes.imgBlock}>
                <div className={classes.imgEle} style={{ backgroundImage: `url(${img || config[pageType].img})` }} />
            </div>

            <div className={classes.content}>
                <h1 className={classes.h1}>{title || config[pageType].title}</h1>
                <div className={classes.desc}>{desc || message[config[pageType].desc].defaultMessage}</div>
                <div className={classes.actions}>
                    <Link to={redirect}>
                        <Button variant={'contained'} color={'primary'}>{backText}</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

Exception.propTypes = {
    classes: PropTypes.object.isRequired,
    backText: PropTypes.string,
    type: PropTypes.string,
    desc: PropTypes.string,
    img: PropTypes.string,
    redirect: PropTypes.string,
    title: PropTypes.string
};

Exception.defaultProps = {
    backText: 'back to home',
    redirect: '/',
};

export default withRouter(withStyles(styles)(Exception));
