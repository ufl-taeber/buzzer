if (false) {
    // This is just a trick to get Intellisense working in VS Code.
    let React = require("react"),
        ReactDOM = require("react-dom")
}

class BuzzerWebView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false,
            loginFormDisabled: false,
            username: "",
            password: "",
            messages: [],
        }

        this.getMessages = this.getMessages.bind(this)
        this.search = this.search.bind(this)

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handlePost = this.handlePost.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    render() {
        const { handleLogin, handleLogout, handlePost, handleSearch } = this
        const { loggedIn, loginFormDisabled, username, messages } = this.state

        if (!loggedIn) {
            return <LoginForm disabled={loginFormDisabled} onSubmit={handleLogin} />
        }

        const hero = (
            <div key="hero" className="hero">
                <span className="big">@{username}</span>
                <a href="#" className="small" onClick={handleLogout}>Log out</a>
            </div>
        )

        const post = (
            <form key="post" className="PostForm" onSubmit={handlePost}>
                <input name="status" placeholder="What do you wanna say?" />
                <button type="submit" name="post">Post</button>
            </form>
        )

        const search = (
            <form key="search" className="SearchForm" onSubmit={handleSearch}>
                <input name="query" placeholder="#tag or @username" />
                <button type="submit" name="post">Search</button>
            </form>
        )

        const messageList = (
            <ul key="messages" className="messages">
                {messages.map(msg => (
                    <li className="message" key={msg.id}>
                        <p className="poster">@{msg.poster}</p>
                        <p className="text">{msg.text}</p>
                    </li>
                ))}
            </ul>
        )

        return [hero, post, search, messageList]
    }

    async getMessages() {
        const response = await fetch("/").then(r => r.text())
        this.setState({
            messages: [
                {
                    id: 1,
                    poster: "therealbobross",
                    text: "Happy Trees Happy Trees!",
                },
                {
                    id: 2,
                    poster: "therealbobross",
                    text: "This would be a good home for my little squirrels :)",
                }
            ]
        })
    }

    /**
     * @param {Event} event
     */
    async handleLogin(event) {
        event.preventDefault()
        this.setState({ loginFormDisabled: true })

        const creds = {
            username: document.getElementsByName("username")[0].value,
            password: document.getElementsByName("password")[0].value,
        }

        const response = await fetch("/").then(r => r.text())
        this.setState({
            username: creds.username,
            password: creds.password,
            loginFormDisabled: false,
            loggedIn: true,
        }, this.getMessages)
    }

    /**
     * @param {Event} event
     */
    handleLogout(event) {
        event.preventDefault()
        this.setState({
            loggedIn: false,
            password: "",
        })
    }

    /**
     * @param {Event} event
     */
    handlePost(event) {
        event.preventDefault()
    }

    /**
     * @param {Event} event
     */
    handleSearch(event) {
        event.preventDefault()
        const query = document.getElementsByName("query")[0].value

        this.search(query)
    }

    search(query) {
        if (!query)
            return

        if (query[0] !== '#' || query[0] !== '@') {
            setTimeout(() => alert("Error! Query must start with # or @."), 1)
            return
        }
    }
}

const LoginForm = (props) => (
    <form className="LoginForm" onSubmit={props.onSubmit}>
        <input name="username" autoComplete="username" placeholder="Username" />
        <input name="password" type="password" autoComplete="current-password" placeholder="Password" />
        <button type="submit" disabled={props.disabled}>{!props.disabled ? "Log In" : "..."}</button>
        <p className="center">New to Buzzer?</p>
        <p>
            Fill in your desired username and password to sign up.
        </p>
    </form>
)

ReactDOM.render(<BuzzerWebView />, document.getElementById("app"))