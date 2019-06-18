import React, { useContext } from 'react';
import { ProfileProvider } from 'providers';
import { ProfileContext } from 'context';
import { Profile as ProfileComponent } from 'components/Profile';

const Profile = () => {
    const {
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        handleSubmitInput,
        submitRateUser
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
            submitRateUser={submitRateUser}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <ProfileProvider>
        <Profile {...props} />
    </ProfileProvider>
))
