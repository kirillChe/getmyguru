import React, { useContext } from 'react';
import { EditProfileProvider } from 'providers';
import { EditProfileContext } from 'context';
import { EditProfileComponent } from 'components';

const EditProfile = props => {
    const {
        allowedLanguages,
        submitError,
        values,
        avatarLocation,
        validateForm,
        handleInputChange,
        handleAvatarChange,
        handleSubmit,
        ages
    } = useContext(EditProfileContext);

    return (
        <EditProfileComponent
            allowedLanguages={allowedLanguages}
            submitError={submitError}
            values={values}
            avatarLocation={avatarLocation}
            validateForm={validateForm}
            handleInputChange={handleInputChange}
            handleAvatarChange={handleAvatarChange}
            handleSubmit={handleSubmit}
            ages={ages}
        />
    )
};

export default React.forwardRef((props, ref) => (
    <EditProfileProvider>
        <EditProfile {...props} />
    </EditProfileProvider>
))
