package pak.cambio.service;

import org.springframework.stereotype.Service;
import pak.cambio.model.User;
import pak.cambio.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public void saveNewUser(User user) {
        userRepository.save(user);
    }

    public User findUserByName(String username) {
        return userRepository.findUserByUsername(username);
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
