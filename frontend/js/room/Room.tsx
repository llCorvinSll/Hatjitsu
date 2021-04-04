import * as React from "react";


export function Room() {
    return (
        <div ng-init="configureRoom()">
            <p className="roomNumber">Room: roomId</p>

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
                    <div ng-switch className="span2 pullright">
                        <div ng-switch-when="true">
                            <div id="dd" className="dropdown-wrapper btn">
                                <span>Mountain Goat pack</span>
                                <ul className="dropdown">
                                    <li className="dropdown__item"><a href="#" ng-model="cardPack" id="deckGoat"
                                                                      ng-click="setCardPack('goat')">Mountain Goat</a>
                                    </li>
                                    <li className="dropdown__item"><a href="#" ng-model="cardPack" id="deckFib"
                                                                      ng-click="setCardPack('fib')">Fibonacci</a></li>
                                    <li className="dropdown__item"><a href="#" ng-model="cardPack" id="deckSeq"
                                                                      ng-click="setCardPack('seq')">Sequential</a></li>
                                    <li className="dropdown__item"><a href="#" ng-model="cardPack" id="deckPlay"
                                                                      ng-click="setCardPack('play')">Playing Cards</a>
                                    </li>
                                    <li className="dropdown__item"><a href="#" ng-model="cardPack" id="deckShirt"
                                                                      ng-click="setCardPack('tshirt')">T-Shirt</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="cards{{cardsState}}">
                    <div ng-show="cards" ng-repeat="card in cards" ng-click="vote(card)" className="card"
                         ng-class="{'card--selected' : card==myVote}" >
                        card
                    </div>
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
