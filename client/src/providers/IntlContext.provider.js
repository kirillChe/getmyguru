import React from 'react';
import { injectIntl } from 'react-intl';
import { IntlContext } from 'context';

const IntlContextProvider = injectIntl(({ intl, children }) => {
    // const formatCurrency = (number, currency) =>
    //     intl.formatNumber(number, {
    //         currency: currency || _.get(boot, 'localization.currency', 'USD'),
    //         style: 'currency'
    //     });

    return <IntlContext.Provider value={{ ...intl }}>{children}</IntlContext.Provider>
});

export default IntlContextProvider
