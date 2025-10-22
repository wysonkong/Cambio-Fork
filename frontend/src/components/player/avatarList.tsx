import {useEffect, useState} from 'react';

const AvatarList = () => {
    const [avatars, setAvatars] = useState<string[]>([]);

    useEffect(() => {
        fetch("/avatars/manifest.json")
            .then(res => res.json())
            .then(setAvatars);
    }, []);

    return avatars
};

export default AvatarList;