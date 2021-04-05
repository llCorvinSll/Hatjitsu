import * as React from "react";
import {useEffect, useState} from "react";
import {chooseCardPack, Decks} from "../../../shared/protocol";
import {Api} from "../api/Api";


interface IRoomProps {
    api: Api;
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

    return (
        <div>
            <p className="roomNumber">Room: {state.roomUrl}</p>

            <section className="cardPanel">
                <div className="row cardPanel-meta">
                    <div className="span2 subheading">
                        <div ng-show="voter">
                            <span>Choose your estimate...</span>
                        </div>
                        <div ng-hide="voter">
                            <span>You have chosen not to vote.</span>
                        </div>
                    </div>
                    <CardPackSelector selectedDeck={state.cardPack} selectDeck={(d: Decks) => { props.api.setCardPack(d) }} />
                </div>

                {/*<div className="cards{{cardsState}}">*/}
                <div className="cards">
                    {chooseCardPack(state.cardPack).map((card) => {
                        return (
                            <div className="card"  ng-class="{'card--selected' : card==myVote}" >
                                {card}
                            </div>
                        )

                    })}

                    <div ng-hide="cards" className="waiting">
                        No cards found
                    </div>
                </div>

            </section>

            <section className="votePanel">

                <div className="switch">
                    <input type="checkbox" ng-model="voter" ng-disabled="forceRevealDisable" ng-change="toggleVoter()" />
                        <label className="btn" data-on="You are a voter" data-off="You are not a voter">I am voting </label>
                </div>

                <div ng-switch>

                    <div ng-switch-when="false">
                        <p>&nbsp;</p>
                    </div>

                    <div ng-switch-when="true">
                        <div ng-switch>
                            <p ng-switch-when="false">You haven't estimated yet</p>
                            <p ng-switch-when="true">Your current estimate: <b>myVote</b></p>
                        </div>
                    </div>

                </div>

                <div className="cards{{votingState}}" id="chosenCards">

                    <div ng-repeat="vote in votes" ng-click="unvote(vote.sessionId)" className="card card--2-sided vote"
                         >
                        <div className="card--side-1">x</div>
                        <div className="card--side-2" >vote.visibleVote</div>
                    </div>
                    <div ng-repeat="i in placeholderVotes" className="card card--placeholder">
                        &nbsp;
                    </div>

                    <div ng-show="showAverage" className="voting-average">Average: <b>votingAverage (StdDev
                        = votingStandardDeviation)</b></div>
                </div>

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


interface ICardPackSelectorProps {
    selectedDeck: Decks;

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

    return (
        <div ng-switch className="span2 pullright">
            <div ng-switch-when="true">
                <div id="dd" onClick={() => setOpened(!opened)} className={`dropdown-wrapper btn ${opened ? "active" : ""}`}>
                    <span>{DeckNames[props.selectedDeck]}</span>
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
