import React, { useContext } from 'react';
import { MessagesProvider } from 'providers';
import { MessagesContext } from 'context';
import { Messages as MessagesComponent } from 'components/Messages';

const Messages = () => {
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
