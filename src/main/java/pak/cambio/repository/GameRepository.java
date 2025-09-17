package pak.cambio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pak.cambio.model.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
}
