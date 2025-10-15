package pak.cambio.model.github;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

public class GitHubAuthUtils {

    public static String generateJWT(String appId, String privateKeyPem) throws Exception {
        PrivateKey privateKey = loadPrivateKey(privateKeyPem);

        Instant now = Instant.now();
        return Jwts.builder()
                .setIssuer(appId)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(540))) // valid for 9 minutes
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    private static PrivateKey loadPrivateKey(String pem) throws Exception {
        // Remove PEM header/footer
        String privateKeyContent = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(privateKeyContent);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(keySpec);
    }

    public static String getInstallationToken(String jwt, String installationId) {
        String url = "https://api.github.com/app/installations/" + installationId + "/access_tokens";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(jwt);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.set("User-Agent", "Spring-GitHubApp-Client");

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Extract token from JSON (basic parsing)
        String body = response.getBody();
        if (body != null && body.contains("\"token\"")) {
            int start = body.indexOf("\"token\":\"") + 9;
            int end = body.indexOf("\"", start);
            return body.substring(start, end);
        } else {
            throw new RuntimeException("Failed to retrieve installation token: " + body);
        }
    }
}
