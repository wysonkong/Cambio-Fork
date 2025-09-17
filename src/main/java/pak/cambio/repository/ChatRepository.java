package pak.cambio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pak.cambio.model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

}
