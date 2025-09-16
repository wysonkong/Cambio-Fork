package pak.cambio.controller;

import org.springframework.web.bind.annotation.*;
import pak.cambio.model.User;
import pak.cambio.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MainRestController {
    private final UserService userService;

    public MainRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/standings")
    public List<User> findAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping("/new_user")
    public void saveNewUser(@RequestBody User user) {
        userService.saveNewUser(user);
    }
}
