import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'

import styles from './Exception.less'
import message from './Exception.messages'
import config from './typeConfig'

class Exception extends Component {
    static defaultProps = {
        backText: 'back to home',
        redirect: '/'
    };

    static propTypes = {
        backText: PropTypes.string,
        type: PropTypes.string,
        desc: PropTypes.string,
        img: PropTypes.string,
        redirect: PropTypes.string,
        title: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log('___________________');
        console.log('____Exception________');
        console.log(this.props);
        console.log('___________________');
        const { backText, type, title, desc, img, redirect } = this.props;

        const pageType = type in config ? type : '404';

        return (
            <div className={styles.exception}>
                <div className={styles.imgBlock}>
                    <div className={styles.imgEle} style={{ backgroundImage: `url(${img || config[pageType].img})` }} />
                </div>

                <div className={styles.content}>
                    <h1>{title || config[pageType].title}</h1>
                    <div className={styles.desc}>{desc || message[config[pageType].desc].defaultMessage}</div>
                    <div className={styles.actions}>
                        <Link to={redirect}>
                            <Button type="primary">{backText}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Exception);
