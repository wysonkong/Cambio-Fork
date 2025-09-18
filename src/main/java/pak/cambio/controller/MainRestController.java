package pak.cambio.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pak.cambio.model.User;
import pak.cambio.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import pak.cambio.dto.LoginDTO;

import static io.micrometer.common.KeyValues.of;

@RestController
@RequestMapping("/api")
public class MainRestController {
    private final UserService userService;

    private final Map<String, User> sessions = new ConcurrentHashMap<>();

    public MainRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/standings")
    public List<User> findAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/findUser")
    public Map<String, Boolean> findUser(@RequestParam String username) {
        Boolean exists = userService.existsByUsername(username);
        return Map.of("exists", exists);
    }

    @PostMapping("/user")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO login) {
        User user =  userService.findUserByName(login.username());

        if (user == null || !login.password().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Create a simple session ID
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, user);

        return ResponseEntity.ok(Map.of("sessionId", sessionId, "username", user.getUsername(), "userId", Long.toString(user.getId())));
    }

    @PostMapping("/new_user")
    public void saveNewUser(@RequestBody User user) {
        userService.saveNewUser(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestHeader("X-Session-Id") String sessionId) {
        User user = sessions.get(sessionId);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(user);
    }
}
