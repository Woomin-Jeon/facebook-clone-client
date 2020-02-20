import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Post from './pages/Post';
import MyPage from './pages/MyPage';
import OthersPage from './pages/OthersPage';
import Join from './pages/Join';
import FriendsReco from './pages/FriendsReco';

const currentUser = {
  id: '',
  pw: '',
  userName: '',
  friends: [],
};

const initialLogin = {
  isLoggedIn: false,
};

const initialPost = {
  post: [],
  scrap: [],
};

const initialComment = {
  comment: [],
};

function App() {
  const [topLevelState, setTopLevelState] = useState('');
  const [loginState, setLoginState] = useState(initialLogin);
  const [currentUserState, setCurrentUserState] = useState(currentUser);
  const [postState, setPostState] = useState(initialPost);
  const [commentState, setCommentState] = useState(initialComment);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login
            loginState={loginState}
            setLoginState={setLoginState}
            currentUserState={currentUserState}
            setCurrentUserState={setCurrentUserState}
            commentState={commentState}
            setCommentState={setCommentState}
            postState={postState}
            setPostState={setPostState}
          />
        </Route>
        <Route path="/join">
          <Join
            loginState={loginState}
            setLoginState={setLoginState}
          />
        </Route>
        <Route path="/post">
          <Post
            postState={postState}
            setPostState={setPostState}
            currentUserState={currentUserState}
            setCurrentUserState={setCurrentUserState}
            loginState={loginState}
            setLoginState={setLoginState}
            commentState={commentState}
            setCommentState={setCommentState}
            setTopLevelState={setTopLevelState}
          />
        </Route>
        <Route path="/mypage">
          <MyPage
            postState={postState}
            setPostState={setPostState}
            currentUserState={currentUserState}
            setCurrentUserState={setCurrentUserState}
            loginState={loginState}
            setLoginState={setLoginState}
            commentState={commentState}
            setCommentState={setCommentState}
            setTopLevelState={setTopLevelState}
          />
        </Route>
        <Route path="/otherspage">
          <OthersPage
            specificPost={topLevelState}
            loginState={loginState}
            setLoginState={setLoginState}
            currentUserState={currentUserState}
            setCurrentUserState={setCurrentUserState}
            postState={postState}
            setPostState={setPostState}
            commentState={commentState}
            setCommentState={setCommentState}
          />
        </Route>
        <Route path="/friendsreco">
          <FriendsReco
            currentUserState={currentUserState}
            loginState={loginState}
            topLevelState={topLevelState}
            setTopLevelState={setTopLevelState}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
