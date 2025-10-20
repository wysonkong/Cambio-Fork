package pak.cambio.engine;

import pak.cambio.model.*;

import java.util.*;

public class GameEngine {
    private final Deque<Card> deck = new ArrayDeque<Card>();
    private final Deque<Card> discard = new ArrayDeque<Card>();
    private final List<Player> players = new ArrayList<Player>();
    private boolean cambioCalled = false;
    private int cambioCountDown;
    private boolean end = false;
    private int currentTurn = 0;
    private boolean didStickWork;
    private Player winner;
    private int specialMove = 0;
    private boolean tempTurn = false;
    private int lastTurn;
    private Player cambioPlayer;

    public GameEngine(List<Player> initialPlayers) {
        this.players.addAll(initialPlayers);
    }

    public void startNewGame() {
        shuffleAndDeal();
    }

    private void shuffleAndDeal() {
        List<Card> fullDeck = new LinkedList<Card>();
        fullDeck = Card.standard();

        Collections.shuffle(fullDeck);
        deck.clear();
        fullDeck.forEach(deck::addLast);
        for(Player p : players) {
            List<Card> hand = new ArrayList<Card>();
            List<Boolean> visible = new ArrayList<Boolean>();
            for(int i =0; i < 4; i++) {
                Card dealt = deck.removeFirst();
                if(i == 1 || i == 3) {
                    dealt.makeVisibleTo(p.getId());
                }
                hand.add(dealt);
            }
            p.setHand(hand);
        }
        discard.clear();
        discard.add(deck.removeLast());
        cambioCalled = false;
        cambioCountDown = players.size();
    }

    private void reshuffle() {
        List<Card> deckList = new ArrayList<Card>(discard);
        deckList.removeFirst();
        discard.removeAll(deckList);
        Collections.shuffle(deckList);
        deck.clear();
        deckList.forEach(deck::addLast);
    }

    public GameState applyAction(GameAction action) {
        Player player = findPlayer(action.getUserId());
        boolean pending = false;
        if (!action.getType().equals(ActionType.STICK)) {
            specialMove = 0;
        }
        didStickWork = false;
        if(tempTurn) {
            currentTurn = lastTurn;
        }
        int nextTurn = 0;
        if(deck.isEmpty() && !action.getType().equals(ActionType.START)) {
            reshuffle();
        }

        switch (action.getType()) {
            case DRAW_DECK -> {
                Card drawn = deck.removeFirst();
                player.setPending(drawn);
                pending = true;
            }
            case DRAW_DISCARD -> {
                player.getHand().add(discard.removeFirst());
            }
            case PEEK -> {
                int idx = action.getInt("idx");
                long id = action.getLong("id");
                Player peeked = findPlayer(id);
                peeked.getHand().get(idx).makeVisibleTo(player.getId());
            }
            case PEEK_PLUS -> {
                int idx = action.getInt("idx");
                long id = action.getLong("id");
                Player peeked = findPlayer(id);
                peeked.getHand().get(idx).makeVisibleTo(player.getId());
                pending = true;
            }
            case SWAP_PENDING -> {
                Card newCard = player.getPending();
                int idx = action.getInt("destination");
                System.out.println("SWAP_PENDING userId " + player.getId() + "with index" + idx);
                Card old = player.getHand().get(idx);
                newCard.makeVisibleTo(player.getId());
                player.getHand().set(idx, newCard);
                discard.addFirst(old);
                player.setPending(null);
            }
            case DISCARD_PENDING -> {
                Card card = player.getPending();
                if(card.getRank().equals("7") || card.getRank().equals("8")) {
                    specialMove = 1;
                    pending = true;
                }
                else if(card.getRank().equals("9") || card.getRank().equals("10")) {
                    specialMove = 2;
                    pending = true;
                }
                else if(card.getRank().equals("J") || card.getRank().equals("Q")) {
                    specialMove = 3;
                    pending = true;
                }
                else if(card.getRank().equals("K")) {
                    specialMove = 4;
                    pending = true;
                }
                discard.addFirst(card);
                player.setPending(null);
                if(player.getHand().isEmpty()) {
                    pending = false;
                }
            }
            case SWAP -> {
                long originUserId = action.getLong("originUserId");
                Player originPlayer = findPlayer(originUserId);
                long destinationUserId = action.getLong("destinationUserId");
                Player destinationPlayer = findPlayer(destinationUserId);
                int origin = action.getInt("origin");
                int destination = action.getInt("destination");
                Card newCard = destinationPlayer.getHand().get(destination);
                Card old = originPlayer.getHand().get(origin);
                originPlayer.getHand().set(origin, newCard);
                destinationPlayer.getHand().set(destination, old);
            }
            case DISCARD -> {

            }
            case CALL_CAMBIO -> {
                cambioPlayer = findPlayer(action.getUserId());
                cambioCalled = true;
            }
            case GIVE -> {
                long originUserId = action.getLong("originUserId");
                Player originPlayer = findPlayer(originUserId);
                int origin = action.getInt("origin");
                long destinationUserId = action.getLong("destinationUserId");
                Card card = originPlayer.getHand().get(origin);
                originPlayer.getHand().remove(origin);
                Player destinationPlayer = findPlayer(destinationUserId);
                destinationPlayer.getHand().add(card);
                tempTurn = false;
                pending = true;
            }
            case START -> {
                startNewGame();
            }
            case STICK -> {
                long originUserId = action.getLong("originUserId");
                Player originPlayer = findPlayer(originUserId);
                int origin = action.getInt("origin");
                Card card = originPlayer.getHand().get(origin);
                Card prev = discard.getFirst();
                if(card.getRank().equals(prev.getRank())) {
                    originPlayer.getHand().remove(origin);
                    discard.addFirst(card);
                    didStickWork = true;
                    if(originUserId != action.getUserId()) {
                        tempTurn = true;
                        nextTurn = players.indexOf(findPlayer(action.getUserId()));
                    }
                }
                else {
                    long actionUserId = action.getUserId();
                    Player actionPlayer = findPlayer(actionUserId);
                    Card drawn = deck.removeFirst();
                    actionPlayer.getHand().add(drawn);
                    didStickWork = false;
                }
                if(!player.getHand().isEmpty()) {
                   pending = true;
                }
            }
        }
        if(player.getHand().isEmpty()) {
            specialMove = 0;
        }
        if(!pending) {
            advanceTurn();
        }
        lastTurn = currentTurn;
        if(tempTurn) {
            currentTurn = nextTurn;
        }
        return snapshotState(action.getUserId());
    }

    //To do
    public Player findPlayer(long id) {
        Player result = null;
        for(Player p : players) {
            if(p.getId() == id) {
                result = p;
            }
        }
        return result;
    }

    public void advanceTurn() {
        currentTurn = (currentTurn + 1) % players.size();
        if(cambioCalled) {
            cambioCountDown--;
        }
        if((cambioCountDown == 0) && cambioCalled) {
            endGame();
        }
    }

    public void endGame() {
        end = true;
        int min = players.get(0).getScore();
        winner = players.get(0);
        for(Player p : players) {
            if(p.getScore() < min) {
                winner = p;
            }
        }
        System.out.println("Game is over, winner is " + winner.getUser());
    }



    //GAME STATE
    public GameState snapshotState(Long requestingUserId) {
        List<GameState.PlayerView> views = new ArrayList<>();
        Player current = findPlayer(requestingUserId);
        for (Player p : players) {
            List<Card> handView = new ArrayList<>();
            System.out.println(p.getHand().toString());
            for (int i = 0; i < p.getHand().size(); i++) {
                handView.add(p.getHand().get(i));
            }
            int score = p.getScore();
            views.add(new GameState.PlayerView(
                    p.getId(),
                    p.getUser(),
                    p.getIndex(),
                    handView,
                    score,
                    p.getPending()
            ));
        }

        return new GameState(views, discard.peekFirst(), currentTurn, cambioCalled, didStickWork, specialMove, winner, tempTurn, true, cambioPlayer, 0);
    }

}
