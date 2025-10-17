package pak.cambio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import pak.cambio.model.User;
import pak.cambio.model.github.GitHubAuthUtils;
import pak.cambio.model.github.IssueRequest;
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

    @Value("${spring.github.app.id}")
    private String appId;

    @Value("${spring.github.app.installationId}")
    private String installationId;

    @Value("${spring.github.app.privateKeyPath}")
    private String privateKeyPem;

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

    @GetMapping("/getUser{userId}")
    public User getUser(@PathVariable("userId") Long userId) {
        return userService.getUserById(userId);
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

        return ResponseEntity.ok(Map.of("sessionId", sessionId, "username", user.getUsername(), "userId", Long.toString(user.getId()), "avatar", user.getAvatar()));
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

    @PostMapping("/create-issue")
    public ResponseEntity<?> createIssue(@RequestBody IssueRequest issueRequest) throws Exception {
        String jwt = GitHubAuthUtils.generateJWT(appId, privateKeyPem);
        String installationToken = GitHubAuthUtils.getInstallationToken(jwt, installationId);

        // Now call GitHub REST API using installation token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(installationToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        issueRequest.setTitle(issueRequest.getPage() + " - " + issueRequest.getUsername());
        issueRequest.setBody(issueRequest.getIssue());

        String[] labels = {issueRequest.getType()};

        Map<String, Object> body = Map.of(
                "title", issueRequest.getTitle(),
                "body", issueRequest.getBody(),
                "labels", labels
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.github.com/repos/" + issueRequest.getOwner() + "/" + issueRequest.getRepo() + "/issues",
                request,
                String.class
        );

        System.out.println(ResponseEntity.status(response.getStatusCode()).body(response.getBody()));

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
