import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {findUserById, getUserSocketID} from '../function';
import Chatting from '../components/Chatting';

function FriendsIndex({
  loginState,
  currentUserState,
  topLevelState,
  setTopLevelState,
  socket,
}) {
  const [isChattingOn, setIsChattingOn] = useState(false);
  const [userSocketID, setUserSocketID] = useState('');
  const [friendID, setFriendID] = useState('');
  const { users } = loginState;
  const { id, friends } = currentUserState;
  const SHOWING_FRIENDS_COUNT = 3;
  let recommandedFriedns = [];

  if (friends.length > 0 && users.length > 0) {
    const f = friends.reduce((acc, friendID) => {
      const user = findUserById(users, friendID);
      if (!user) {
        return acc;
      }

      return [...acc, ...user.friends];
    }, []);

    recommandedFriedns = _.uniq(f)
      .filter((it) => id !== it)
      .filter((it) => !friends.includes(it))
      .slice(0, SHOWING_FRIENDS_COUNT);
  }

  const moveToOthersPage = (userID) => {
    const user = findUserById(users, userID);
    setTopLevelState({ ...topLevelState, id: user.id, userName: user.userName });
  };

  const chattingButtonClicked = async (friendID) => {
    const socketID = await getUserSocketID(friendID);
    console.log('You clicked this socket : ', socketID);
    if (socketID === 400) {
      alert(`${findUserById(users, friendID).userName}님은 접속중이 아닙니다`);
      return;
    }

    const { userSocketID } = socketID;

    setUserSocketID(userSocketID);
    setFriendID(friendID);
    setIsChattingOn(true);
  };

  function x() {
    const y = getUserSocketID();
    return y;
  }

  return (
    <div className="friends-index">
      <div className="frineds-index-line-knowing">
        <Link className="frineds-index-maybe-knowing" to="friendsreco">알 수도 있는 사람</Link>
        <div className="frineds-index-maybe-knowing-3man">
          {recommandedFriedns.map((id, index) => (
            <div key={index}>
              <img className="friends-index-line-profile" src={findUserById(users, id).profile} alt="" />
              <Link
                to="/otherspage"
                className="friends-index-line-name"
                type="button"
                onClick={() => moveToOthersPage(id)}
              >
                {findUserById(users, id).userName}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="timeline-about-friends">
        <div className="friends-index-line-utter">
          친구
          {friends.length}
          명
        </div>
        <br />
        <div>
          {friends.map((v, index) => {
            const user = findUserById(users, v)
            return (<div key={index}>
              <img className="friends-index-line-profile" src={findUserById(users, v).profile} />
              <Link
                to="/otherspage"
                className="friends-index-line-name"
                type="button"
                onClick={() => moveToOthersPage(v)}
              >
                {user.userName}
              </Link>
              <span>
                {user.online
                  ? <button className="online" onClick={() => chattingButtonClicked(v)}>●</button>
                  : <></>}
              </span>
            </div>)
          })}
        </div>
        {isChattingOn
          ? (
            <Chatting
              setIsChattingOn={setIsChattingOn}
              currentUserState={currentUserState}
              socket={socket}
              userSocketID={userSocketID}
              setUserSocketID={setUserSocketID}
              loginState={loginState}
              friendID={friendID}
              setFriendID={setFriendID}
            />
          )
          : <></>}
      </div>
    </div>
  );
}

export default FriendsIndex;