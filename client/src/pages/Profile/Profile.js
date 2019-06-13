import React, { useContext } from 'react';
import { ProfileProvider } from 'providers';
import { ProfileContext } from 'context';
import { ProfileComponent } from 'components';

const Profile = props => {
    const {
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        handleSubmitInput
    } = useContext(ProfileContext);

    return (
        <ProfileComponent
            showMessageInput={showMessageInput}
            setShowMessageInput={setShowMessageInput}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            avatarLocation={avatarLocation}
            profile={profile}
            handleSubmitInput={handleSubmitInput}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <ProfileProvider>
        <Profile {...props} />
    </ProfileProvider>
))
