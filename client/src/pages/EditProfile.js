import React, { useContext } from 'react';
import { EditProfileProvider } from 'providers';
import { EditProfileContext } from 'context';
import { EditProfile as EditProfileComponent } from 'components/EditProfile';

const EditProfile = () => {
    const {
        state,
        handleChangeSwitch,
        handleChangeCheckbox,
        handleChange,
        handleChangeDate,
        validateForm,
        handleAvatarChange,
        handleSubmit,
        avatarLocation,
        submitError,
    } = useContext(EditProfileContext);

    return (
        <EditProfileComponent
            state={state}
            handleChangeSwitch={handleChangeSwitch}
            handleChangeCheckbox={handleChangeCheckbox}
            handleChange={handleChange}
            handleChangeDate={handleChangeDate}
            validateForm={validateForm}
            handleAvatarChange={handleAvatarChange}
            handleSubmit={handleSubmit}
            avatarLocation={avatarLocation}
            submitError={submitError}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <EditProfileProvider>
        <EditProfile {...props} />
    </EditProfileProvider>
))
