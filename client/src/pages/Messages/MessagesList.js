import React, { useContext } from 'react';
import { MessagesProvider } from 'providers';
import { MessagesContext } from 'context';
import { MessagesComponent } from 'components';

const Messages = props => {
    const {
        partners,
        dialog,
        selectedPartnerId,
        handleSubmitInput,
        handleClickPartner
    } = useContext(MessagesContext);

    return (
        <MessagesComponent
            partners={partners}
            dialog={dialog}
            selectedPartnerId={selectedPartnerId}
            handleSubmitInput={handleSubmitInput}
            handleClickPartner={handleClickPartner}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <MessagesProvider>
        <Messages {...props} />
    </MessagesProvider>
))
