package pak.cambio.model.github;

public class IssueRequest {

    private String title;
    private String body;
    private String owner = "tylerpak";
    private String repo = "Cambio";

    public IssueRequest() {
    }

    public IssueRequest(String page, String type, String issue, String username) {
        this.title = page + " - " + type + " - " + username;
        this.body = issue;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getRepo() {
        return repo;
    }

    public void setRepo(String repo) {
        this.repo = repo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
