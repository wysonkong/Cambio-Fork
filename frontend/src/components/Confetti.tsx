import {useWindowSize} from 'react-use'
import Confetti from 'react-confetti'

function ConfettiPos() {
    const {width, height} = useWindowSize();

    return (
        <Confetti width={width} height={height}/>
    );
}

export default ConfettiPos;