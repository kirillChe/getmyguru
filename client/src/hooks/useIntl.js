import { useContext } from 'react';
import { IntlContext } from 'context';

export default function useIntl() {
    return useContext(IntlContext);
};