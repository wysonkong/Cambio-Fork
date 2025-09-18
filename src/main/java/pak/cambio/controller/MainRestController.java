package pak.cambio.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pak.cambio.model.User;
import pak.cambio.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    @GetMapping("/user/{username}")
    public User findUserByName(@PathVariable String username) {
        return userService.findUserByName(username);
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
