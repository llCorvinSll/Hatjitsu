import * as React from "react";
import {Route} from "react-router";
import { BrowserRouter } from "react-router-dom";
import {Lobby} from "./lobby/Lobby";
import {Api} from "./api/Api";
import {Room} from "./room/Room";

const api = new Api()

export function App() {
    return (
        <div className="container">
            <BrowserRouter>
                <Route exact path="/" component={LobbyPage} />
                <Route path="/:id" component={RoomPage} />
            </BrowserRouter>
            <footer className="footer">
                <p>&copy; <a href="http://www.ubxd.com"
                             title="Ruby on Rails, node, and iOS development in Cape Town">UBXD</a> 2012 - 2013; Built
                    by <a href="http://brea.kfa.st" title="nodejs developer in Cape Town">@Jörg</a> &amp; <a
                        href="mailto:richard.archer@ubxd.com"
                        title="Software developer in Cape Town">@Rïch</a>. <strong><a
                        href="https://twitter.com/hatjitsu" title="Feedback to us via Twitter">Feedback?</a></strong>
                </p>
            </footer>
        </div>
    );
}


export function LobbyPage() {
    return [
        <Header />,
        <div className="content">
            <Lobby api={api} />
        </div>
    ]
}

export function RoomPage() {
    return [
        <Header />,
        <div className="alert">
            <div className="activity" >Activity&hellip;</div>
            <div className="socketMessage"></div>
            <div className="appError"></div>
            <div className="message"></div>
        </div>,
        <div className="content">
            <Room />
        </div>
    ]
}


export function Header() {
    return (
        <header className="header">
            <a href="/" title="Back to the Lobby">
                <span className="header__logo"></span>
                <h1 className="header__text">Hatjitsu</h1>
            </a>
            <div className="bg-mount"></div>
        </header>
    );
}
