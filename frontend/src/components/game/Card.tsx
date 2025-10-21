import card from "/images/svgtopng/card-back.png"
import {useState} from 'react';

const Card = () => {
    const [isVisible, setIsVisible] = useState(false);

    return(
        <div >
            <img src={card} alt={card} className={"h-28 w-20"}/>
        </div>
    );
};

export default Card;