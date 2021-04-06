import * as React from "react";
import {useEffect, useState} from "react";
import {chooseCardPack, Decks, IConnectionDescription, IRoomState} from "../../../shared/protocol";
import {Api} from "../api/Api";


interface IRoomProps {
    api: Api;
}

function getMyConnection(api: Api, state: IRoomState): IConnectionDescription {
    let conn = state.connections.filter((c) => c.sessionId == api.sessionId)

    if (conn.length) {
        return conn[0]
    }

    return {
        voter: true,
        vote: null,
        sessionId: "",
        socketId: "z"
    };
}

function CardsPane(props:{ state:IRoomState, currentConn: IConnectionDescription, selectDeck:(d:Decks) => void, vote:(c:string) => void}) {
    return (
        <section className="cardPanel">
            <div className="row cardPanel-meta">
                <div className="span2 subheading">
                    {props.currentConn.voter && <div>
                        <span>Choose your estimate...</span>
                    </div>}
                    {!props.currentConn.voter && <div>
                        <span>You have chosen not to vote.</span>
                    </div>}
                </div>
                <CardPackSelector selectedDeck={props.state.cardPack} selectDeck={props.selectDeck}/>
            </div>

            {/*<div className="cards{{cardsState}}">*/}

            <div className="cards">
                {props.state.cardPack && chooseCardPack(props.state.cardPack).map((card) => {
                    return (
                        <div
                            className={`card ${props.currentConn.voter && props.currentConn.vote == card ? "card--selected" : ""}`}
                            onClick={() => props.vote(card)}
                        >
                            {card}
                        </div>
                    )
                })}

                {!props.state.cardPack && <div ng-hide="cards" className="waiting">
                    No cards found
                </div>}
            </div>
        </section>
    );
}

export function Room(props: IRoomProps) {
    const [state, setState] = useState(props.api.currentRoom.value)

    useEffect(() => {
        const subscription = props.api.currentRoom.subscribe((room) => {
            console.log(room);
            setState(room)
        })
        return () => {
            subscription.unsubscribe();
        };
    }, [state.roomUrl]);

    const currentConn = getMyConnection(props.api, state);

    return (
        <div>
            <p className="roomNumber">Room: {state.roomUrl}</p>

            <CardsPane
                state={state}
                currentConn={currentConn}
                selectDeck={(d:Decks) => {
                    props.api.setCardPack(d)
                }}
                vote={(card: string) => {
                    props.api.vote(card)
                }}
            />

            <section className="votePanel">

                <div className="switch">
                    <input type="checkbox" ng-model="voter" ng-disabled="forceRevealDisable" ng-change="toggleVoter()"/>
                    <label className="btn" data-on="You are a voter" data-off="You are not a voter">I am voting </label>
                </div>

                <div>
                    {!currentConn.voter && <div ng-switch-when="false">
                        <p>&nbsp;</p>
                    </div>}

                    {currentConn.voter && <div>
                        <div>
                            {currentConn.vote == null && <p>You haven't estimated yet</p>}
                            {currentConn.vote != null &&<p>Your current estimate: <b>{currentConn.vote}</b></p>}
                        </div>
                    </div>}

                </div>

                <ResultsPane
                    api={props.api}
                    room={state}
                    currentConn={currentConn}
                />

                <div ng-switch>
                    <div ng-switch-when="true">
                        <div className="row">
                            <button ng-click="resetVote()" className="span2 btn" title="Start a new vote">
                                <i className="icon icon-refresh"></i> Reset
                            </button>
                            <button ng-click="forceReveal()" className="span2 btn" ng-disabled="forceRevealDisable"
                                    title="Force a reveal of all cards if there are some stragglers">
                                <i className="icon icon-exclamation-sign"></i> Reveal
                            </button>
                            <button ng-click="sortVotes()" className="span2 btn" ng-disabled="sortVotesDisable"
                                    title="Sort votes in order of cards in deck">
                                <i className="icon"><span className="icon-sort"></span></i> Sort votes
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}



export interface IResultsPaneProps {
    api: Api;
    room: IRoomState;
    currentConn: IConnectionDescription;
}

function ResultsPane(props: IResultsPaneProps) {
    const cards = props.room.connections.filter((c) => c.voter)

    return (
        <div className="cards" id="chosenCards">
            {/*<div ng-repeat="vote in votes" ng-click="unvote(vote.sessionId)" className="card card--2-sided vote">*/}
            {/*    <div className="card--side-1">x</div>*/}
            {/*    <div className="card--side-2" >vote.visibleVote</div>*/}

            {/*<div ng-repeat="i in placeholderVotes" className="card card--placeholder">*/}
            {/*    &nbsp;*/}
            {/*</div>*/}

            {cards.map((card) => {
                if(card.vote) {
                    return (
                        <div className="card card--2-sided vote" onClick={() => {
                            if(card.sessionId === props.currentConn.sessionId) {
                                props.api.unvote()
                            }
                        }}>
                            <div className="card--side-1">x</div>
                        </div>
                    )
                }

                return (
                    <div className="card card--placeholder">
                        &nbsp;
                    </div>
                )
            })}

            <div ng-show="showAverage" className="voting-average">Average: <b>votingAverage (StdDev = votingStandardDeviation)</b></div>
        </div>
    );
}


interface ICardPackSelectorProps {
    selectedDeck: Decks | null;

    selectDeck: (d: Decks) => void;
}

const DeckNames = {
    [Decks.GOAT]: "Mountain Goat",
    [Decks.FIB]: "Fibonacci",
    [Decks.SEQ]: "Sequential",
    [Decks.PLAY]: "Playing Cards",
    [Decks.TSHIRT]: "T-Shirt"
}

const DeckOrder = [
    Decks.GOAT,
    Decks.FIB,
    Decks.SEQ,
    Decks.PLAY,
    Decks.TSHIRT
]

function CardPackSelector(props: ICardPackSelectorProps) {
    const [opened, setOpened]  = useState(false)

    const loggedSetOpened = (val: Decks) => {
        return (e: React.MouseEvent) => {
            setOpened(!opened)

            e.stopPropagation()

            props.selectDeck(val)
        }
    }

    const deckName = props.selectedDeck ? DeckNames[props.selectedDeck] : "No decks";
    return (
        <div ng-switch className="span2 pullright">
            <div ng-switch-when="true">
                <div id="dd" onClick={() => setOpened(!opened)} className={`dropdown-wrapper btn ${opened ? "active" : ""}`}>
                    <span>{deckName}</span>
                    <ul className="dropdown">
                        {DeckOrder.map((deck) => {
                            return (<li className="dropdown__item" onClick={loggedSetOpened(deck)}><a href={"#"} id="deckGoat">{DeckNames[deck]}</a></li>)
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
