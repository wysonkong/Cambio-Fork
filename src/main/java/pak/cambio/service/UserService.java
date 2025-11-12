package pak.cambio.service;

import org.springframework.stereotype.Service;
import pak.cambio.model.User;
import pak.cambio.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Map<String, Integer> avatarList = new HashMap<String, Integer>() {{
        put("astronaut", 500);
        put("bear", 200);
        put("ghost", 350);
        put("giraffe", 50);
        put("meerkat", 100);
        put("gorilla", 200);
        put("ninja", 1000);
        put("puffer-fish", 500);
        put("sloth", 600);
    }};

    public Map<String, Integer> cardThemeList = new HashMap<String, Integer>() {{
        put("Blue", 500);
        put("BlueGreen", 200);
        put("Green", 50);
        put("Purple", 100);
        put("Yellow", 200);
        put("Ana", 1000);
        put("Sydney", 600);
    }};


    public void saveNewUser(User user) {
        if(user.getAvatar() == null) {
            user.setAvatar("dog");
        }
        if(user.getCard() == null) {
            user.setCard("default");
        }
        userRepository.save(user);
    }

    public Map<String, Integer> getAvatarPrices() {
        return avatarList;
    }

    public Map<String, Integer> getCardThemePrices() {
        return cardThemeList;
    }

    public User findUserByName(String username) {
        return userRepository.findUserByUsername(username).orElse(null);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean purchaseAvatar(String avatar, User user) {
        if(user.getBalance() >= avatarList.get(avatar)) {
            user.setBalance(user.getBalance() - avatarList.get(avatar));
            user.setOwnedAvatars(user.getOwnedAvatars() + "-" + avatar);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public Boolean purchaseCards(String cardTheme, User user) {
        if(user.getBalance() >= cardThemeList.get(cardTheme)) {
            user.setBalance(user.getBalance() - cardThemeList.get(cardTheme));
            user.setOwnedCards(user.getOwnedCards() + "-" + cardTheme);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void updateScores(List<Long> winnerIds, List<Long> loserIds) {
        if(winnerIds != null && !winnerIds.isEmpty()) {
            List<User> winners = new ArrayList<User>();
            for (Long id : winnerIds) {
                User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
                winners.add(user);
            }
            for(User u : winners) {
                u.setWins(u.getWins()+1);
            }
            userRepository.saveAll(winners);
        }

        if(loserIds != null && !loserIds.isEmpty()) {
            List<User> losers = new ArrayList<User>();
            for(Long id : loserIds) {
                User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
                losers.add(user);
            }
            for(User u : losers) {
                u.setLoses(u.getLoses() + 1);
            }
            userRepository.saveAll(losers);
        }
    }
}
