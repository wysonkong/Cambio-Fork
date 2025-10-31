

const Rule = () => {
    return (

        <div className={"p-6"}>
            <div className="mx-auto grid max-w-2xl gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-1 lg:gap-y-10">

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">
                        <p className="text-base/7 font-semibold text-primary">Cambio Rules</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">How
                            to play</h1>
                        <p className="mt-6 text-xl/8 font-semibold text-white">The Deal</p>
                        <p className="mt-2 text-xl/6 text-gray-300">Deal four cards to each player face down in a
                            square. Each player can look at the two cards closest to them, but only once. Players should
                            try to memorize the cards. Deal one card face up from the deck to start the pile.</p>
                    </div>
                    <div className="lg:w-1/2">

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">The Play</p>
                        <p className="mt-2 text-xl/6 text-gray-300">Player one takes one card either from the deck and
                            looks at it, e.g. 6. Players have different options depending on if the card is a trump, see
                            Trump Cards. The 6 is not a trump and must be swapped for a player’s own face down card.</p>
                    </div>
                    <div className="lg:w-1/2">

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">Swapping Cards, lemme get that</p>
                        <p className="mt-2 text-xl/6 text-gray-300">Player one takes the 6 and places it face down under
                            one of their four cards. The card above the 6 is then turned face up and placed on the pile
                            e.g. 4. Players must turn it away from them so opponents see it first. The next player(s)
                            then follow the same process.</p>
                    </div>
                    <div className="lg:w-1/4">

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">Trump Cards</p>
                        <p className="mt-2 text-xl/6 text-gray-300">When a trump card is picked up from the deck it can
                            be played straight onto the pile without swapping it. The player then completes the action
                            for that card, see to the right. Cards not picked up from the deck do not have a trump
                            action.</p>
                    </div>
                    <div className="lg:w-1/4">
                        <img className="w-full object-contain" src="/images/rules/trump.jpeg" alt="Trump cards"/>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2 flex justify-center">
                        <img className="lg:w-1/2 w-auto object-contain" src="/images/rules/pairs.jpeg" alt="Pair cards"/>
                    </div>
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">Matching Pairs, oh the same?</p>
                        <p className="mt-2 text-xl/6 text-gray-300">If players have memorized a face down card that
                            matches the top card in the pile e.g. 4 and 4, they can pick up the card and put it onto the
                            pile. The card can be from their cards or an opponents'. If it’s from their cards they play
                            with one less card.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">

                    </div>
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">Penalties, you messed up!</p>
                        <p className="mt-2 text-xl/6 text-gray-300">If two players match a card, the second player to
                            match the card must take theirs back. If a player attempts to match a card, but they are not
                            a match, they get a one card penalty. The card is placed face down to the side of their
                            other cards.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">

                    </div>
                    <div className="lg:w-1/2">
                        <p className="mt-6 text-xl/8 font-semibold text-white">Yell Cambio!</p>
                        <p className="mt-2 text-xl/6 text-gray-300">If a player thinks they have the lowest points score
                            they can call “cambio” on their turn. They do not get to take another card. All other
                            players then get one more turn. The color of the king defines the points, for all other
                            cards both colors have the same value.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Rule