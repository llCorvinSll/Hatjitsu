import * as React from "react";
import {Api} from "../api/Api";
import {useHistory, useLocation} from "react-router";


interface ILobbyProperties {
    api: Api
}

export function Lobby(props: ILobbyProperties) {
    let history = useHistory();


    return (
        <div className="lobby">
            <h3 className="subheading">Distributed scrum <span>planning poker</span> for estimating agile projects.
            </h3>
            <p>First person to <strong>create</strong> the room is the moderator. <strong>Share</strong> the url or
                room number with other team members to <strong>join</strong> the room.</p>
            <form>
                <label className="subheading" htmlFor="roomfield">Enter room number</label>
                <div className="row">
                    <input ng-model="room" placeholder="room no" className="span2 roomUrl ng-pristine ng-valid" autoFocus id="roomfield"/>
                    <button className="span2 btn"
                            title="Join an existing planning poker room">Join room</button>
                </div>
                <label htmlFor="createRoom">or</label>
                <div className="row">
                    <button ng-click="createRoom()" id="createRoom" className="span1 btn"
                            title="Create a new planning poker room"
                            type="button" onClick={() => props.api.createRoom().then((room) => {
                                console.log(room)
                                history.push(`/${room.roomUrl}`);
                    })}>Create new room
                    </button>
                </div>
            </form>
        </div>
    )
}
