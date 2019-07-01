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
        handleClickEdit,
        avatarLocation,
        handleSubmitInput,
        submitRateUser,
        profileImages,
        getRootProps,
        getInputProps,
        removeImage
    } = useContext(ProfileContext);

    return (
        <ProfileComponent
            showMessageInput={showMessageInput}
            setShowMessageInput={setShowMessageInput}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            avatarLocation={avatarLocation}
            profile={profile}
            handleClickEdit={handleClickEdit}
            handleSubmitInput={handleSubmitInput}
            submitRateUser={submitRateUser}
            profileImages={profileImages}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            removeImage={removeImage}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <ProfileProvider>
        <Profile {...props} />
    </ProfileProvider>
))
