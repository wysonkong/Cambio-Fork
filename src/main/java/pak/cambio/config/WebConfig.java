package pak.cambio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")   // allow all paths
                        .allowedOrigins("http://localhost:5174","http://localhost:5173") // your frontend
                        .allowedMethods("*")   // allow GET, POST, etc.
                        .allowCredentials(true);
            }
        };
    }
}