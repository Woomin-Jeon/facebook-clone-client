import React, { useState, useEffect } from 'react';
import AddPost from '../components/posts/AddPost';
import ShowPostOthersPage from '../components/posts/ShowPost';
import Scrap from '../components/posts/Scrap';
import HeaderMyPage from '../components/headers/HeaderMyPage';
import { getPosts } from '../apis/service';

const callAPI = async (postState, setPostState) => {
  const { timeLinePosts } = await getPosts();

  setPostState({ 
    ...postState, 
    scrap: [...timeLinePosts.scrap],
  });
}

function MyPage({
  postState,
  setPostState,
  currentUserState,
  setCurrentUserState,
  loginState,
  setLoginState,
  commentState,
  setCommentState,
  setTopLevelState,
}) {
  const { id } = currentUserState;
  const { post, scrap } = postState;

  useEffect(() => {
    callAPI(postState, setPostState);
  }, []);

  return (
    <>
      <HeaderMyPage
        loginState={loginState}
        setLoginState={setLoginState}
        currentUserState={currentUserState}
        setCurrentUserState={setCurrentUserState}
      />
      <br />
      <AddPost
        currentUserState={currentUserState}
        postState={postState}
        setPostState={setPostState}
      />
      <div>
        {post.filter((v) => v.id === id).map((p, index) => (
          <div key={index}>
            <ShowPostOthersPage
              postState={postState}
              setPostState={setPostState}
              currentUserState={currentUserState}
              commentState={commentState}
              setCommentState={setCommentState}
              p={p}
              index={index}
            />
          </div>
        ))}
      </div>
      <div>
        {scrap.filter((v) => v.id === id).map((p, index) => (
          <div key={index}>
            <Scrap
              postState={postState}
              currentUserState={currentUserState}
              setTopLevelState={setTopLevelState}
              p={p}
              index={index}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default MyPage;
