import React, { useContext } from 'react';
import { EditProfileProvider } from 'providers';
import { EditProfileContext } from 'context';
import { EditProfile as EditProfileComponent } from 'components/EditProfile';

const EditProfile = () => {
    const {
        state,
        handleChangeSwitch,
        handleChangeSelect,
        handleChangeCheckbox,
        handleChangeTextField,
        handleChangeDate,
        validateForm,
        handleAvatarChange,
        handleSubmit,
        avatarLocation,
        submitError,
        profile,
    } = useContext(EditProfileContext);

    return (
        <EditProfileComponent
            state={state}
            handleChangeSwitch={handleChangeSwitch}
            handleChangeSelect={handleChangeSelect}
            handleChangeCheckbox={handleChangeCheckbox}
            handleChangeTextField={handleChangeTextField}
            handleChangeDate={handleChangeDate}
            validateForm={validateForm}
            handleAvatarChange={handleAvatarChange}
            handleSubmit={handleSubmit}
            avatarLocation={avatarLocation}
            submitError={submitError}
            profile={profile}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <EditProfileProvider>
        <EditProfile {...props} />
    </EditProfileProvider>
))
