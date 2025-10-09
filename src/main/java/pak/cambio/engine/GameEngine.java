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
                hand.add(deck.removeFirst());
                if(i == 1 || i == 3) {
                    p.makeCardVisible(p.getId(), i);
                }
            }
            p.setHand(hand);
        }
        discard.clear();
        discard.add(deck.removeLast());
        cambioCalled = false;
        cambioCountDown = players.size();
    }

    public GameState applyAction(GameAction action) {
        Player player = findPlayer(action.getUserId());
        boolean pending = false;
        specialMove = 0;

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
                player.makeCardVisible(id, idx);
            }
            case PEEK_PLUS -> {
                int idx = action.getInt("index");
                long id = action.getLong("id");
                player.makeCardVisible(id, idx);
                pending = true;
            }
            case SWAP_PENDING -> {
                Card newCard = player.getPending();
                int idx = action.getInt("destination");
                System.out.println("SWAP_PENDING userId " + player.getId() + "with index" + idx);
                Card old = player.getHand().get(idx);
                player.getHand().set(idx, newCard);
                player.makeCardVisible(player.getId(), idx);
                discard.addFirst(old);
                player.setPending(null);
                System.out.println("After SWAP_PENDING visibleToMe=" + player.getVisibleToMe());
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
                else if(card.getRank().equals("K") && (card.getSuit().equals("Spade") || card.getSuit().equals("Club"))) {
                    specialMove = 4;
                    pending = true;
                }
                discard.addFirst(card);
                player.setPending(null);
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
                originPlayer.swapVisible(originUserId, origin, destinationUserId, destination);
                destinationPlayer.swapVisible(destinationUserId, destination, originUserId, origin);
            }
            case DISCARD -> {

            }
            case CALL_CAMBIO -> {
                cambioCalled = true;
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
                if(card.getRank() == prev.getRank()) {
                    originPlayer.getHand().remove(origin);
                    discard.addFirst(card);
                    didStickWork = true;
                }
                else {
                    long actionUserId = action.getUserId();
                    Player actionPlayer = findPlayer(actionUserId);
                    Card drawn = deck.removeFirst();
                    actionPlayer.getHand().add(drawn);
                    didStickWork = false;
                }
            }
        }
        if(!pending) {
            advanceTurn();
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
            System.out.println(p.getVisibleToMe().toString());
            views.add(new GameState.PlayerView(
                    p.getId(),
                    p.getUser(),
                    p.getIndex(),
                    handView,
                    score,
                    p.getPending(),
                    p.getVisibleToMe()
            ));
        }

        return new GameState(views, discard.peekFirst(), currentTurn, cambioCalled, didStickWork, specialMove, winner);
    }

}
