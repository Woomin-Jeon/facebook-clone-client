import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import func from '../function';
import Swal from "sweetalert2";

const initialTempt = {
  temptJoiningId: '',
  temptJoiningPw: '',
  temptJoiningName: '',
  temptJoiningBirth: '',
  temptJoiningLocation: '',
  temptJoiningEmail: '',
};

const errors = {
  id: '',
  ps: '',
};

const getUserDataFromServer = async (loginState, setLoginState) => {
  const { userStore } = await func.getUsers();

  setLoginState({ ...loginState, users: [...userStore] });
};

function Join({
  loginState,
  setLoginState,
  currentUserState,
  setCurrentUserState,
}) {
  const [temptState, setTemptState] = useState(initialTempt);
  const [errorState, setErrorState] = useState(errors);
  const [joinProfileImage, setJoinProfileImageState] = useState(false);
  const [file, setFile] = useState('');
  const [uploadedFile, setUploadedFile] = useState('');
  const { users } = loginState;
  const {
    temptJoiningId,
    temptJoiningPw,
    temptJoiningName,
    temptJoiningBirth,
    temptJoiningLocation,
    temptJoiningEmail,
  } = temptState;

  useEffect(() => {
    getUserDataFromServer(loginState, setLoginState);
  }, []);

  const setJoinTemptName = (temptJoiningName) => {
    setTemptState({ ...temptState, temptJoiningName });
  };
  const setJoinTemptId = (temptJoiningId) => {
    setTemptState({ ...temptState, temptJoiningId });
  };
  const setJoinTemptPw = (temptJoiningPw) => {
    setTemptState({ ...temptState, temptJoiningPw });
  };
  const setJoinTemptBirth = (temptJoiningBirth) => {
    setTemptState({ ...temptState, temptJoiningBirth });
  };
  const setJoinTemptLocation = (temptJoiningLocation) => {
    setTemptState({ ...temptState, temptJoiningLocation});
  };
  const setJoinTemptEmail = (temptJoiningEmail) => {
    setTemptState({ ...temptState, temptJoiningEmail});
  }

  const checkDuplication = () => {
    if (!temptJoiningId.trim()) {
      setErrorState({ ...errorState, id: '새로운 아이디를 입력해주세요' });
      return;
    }

    for (let i = 0; i < users.length; i++) {
      if (temptJoiningId === users[i].id) {
        setErrorState({ ...errorState, id: '이미 존재하는 아이디입니다' });
        return;
      }
    }

    setErrorState({ ...errorState, id: '사용할 수 있습니다' });
  };

  const passwordCheck = (passwordForCheck) => {
    if (temptJoiningPw === passwordForCheck) {
      setErrorState({ ...errorState, pw: '비밀번호가 일치합니다' });
      return
    }

    setErrorState({ ...errorState, pw: '비밀번호가 서로 일치하지 않습니다'});
  };

  const handleMoveNext = async () => {
    if (errorState.id !== '사용할 수 있습니다') {
      await Swal.fire('', '아이디 중복을 확인해주세요', 'error');
      return;
    }
    if (errorState.pw !== '비밀번호가 일치합니다') {
      await Swal.fire('', '비밀번호를 다시 확인해주세요', 'error');
      return;
    }
    if (!temptJoiningId.trim() || !temptJoiningPw.trim() || !temptJoiningName.trim()) {
      await Swal.fire('', '모든 항복을 입력해주세요', 'error');
      return;
    }
    if (temptJoiningBirth[4] !== '-' || temptJoiningBirth[7] !== '-' || temptJoiningBirth.length !== 10) {
      await Swal.fire('', '생년월일을 형식에 맞게 입력해주세요', 'error');
      return;
    }
    if (!file) {
      await Swal.fire('', '프로필 사진을 등록해주세요', 'error');
      return;
    }

    const { userStore } = await func.getUsers();

    setLoginState({ ...loginState, users: [...userStore] });

    await func.addUser(
      temptJoiningId,
      temptJoiningPw,
      temptJoiningName,
      temptJoiningBirth,
      temptJoiningLocation,
      temptJoiningEmail,
      uploadedFile,
    );

    setCurrentUserState({
      ...currentUserState,
      id: temptJoiningId,
      pw: temptJoiningName,
      userName: temptJoiningName,
      birth: temptJoiningBirth,
      location: temptJoiningLocation,
      email: temptJoiningEmail,
    });
    setJoinProfileImageState(true);
  };

  const fileInput = async (e) => {
    await setFile(e.target.files[0]);
    const send = document.getElementById('send');

    send.click();
  };

  const sendFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('woomin-facebook', file);
    const { filePath } = await func.fileUpload(formData);
    setUploadedFile(filePath.url);
  };

  if (joinProfileImage === true) {
    return <Redirect to="/joinfollow" />;
  }

  return (
    <>
      <div className="login-header">
        <span className="login-header-facebook">facebook 가입하기</span>
      </div>
      <div className="join">
        <div>
          <span className="join-new-id">새로운 아이디</span>
          <input className="join-id-input" type="text" onChange={(e) => setJoinTemptId(e.target.value)} />
          <button className="join-id-check" type="button" onClick={checkDuplication}>중복 확인</button>
          <span className="join-id-check-statement">{errorState.id}</span>
        </div>
        <div>
          <span className="join-new-pw">새로운 비밀번호</span>
          <input className="join-pw-input" type="password" onChange={(e) => setJoinTemptPw(e.target.value)} /><br />
          <span className="join-new-pw-check">비밀번호 확인</span>
          <input className="join-pw-input-check" type="password" onChange={(e) => passwordCheck(e.target.value)} />
          <span className="join-pw-check-statement">{errorState.pw}</span>
        </div>
        <div>
          <span className="join-name">이름</span>
          <input className="join-name-input" type="text" onChange={(e) => setJoinTemptName(e.target.value)} />
        </div>
        <div>
          <span className="join-birth">생년월일</span>
          <input className="join-birth-input" type="text" placeholder="YYYY-MM-DD" onChange={(e) => setJoinTemptBirth(e.target.value)} />
        </div>
        <div>
          <span className="join-location">거주지</span>
          <input type="text" className="join-location-input" onChange={(e) => setJoinTemptLocation(e.target.value)} />
        </div>
        <div>
          <span className="join-email">이메일</span>
          <input type="email" className="join-email-input" onChange={(e) => setJoinTemptEmail(e.target.value)} />
        </div>
        <div>
          <div className="join-upload-profile-image">프로필 사진 추가</div>
          <form onSubmit={sendFile}>
            <div>
              <label>
                <i className="far fa-image" />
                <input className="hidden" type="file" name="woomin-facebook" onChange={fileInput} />
                <input className="hidden" value="" id="send" type="submit" />
              </label>
            </div>
            {uploadedFile ? (
              <div>
                <div>
                  <img style={{ width: '10%' }} src={uploadedFile} alt="" />
                </div>
              </div>
            ) : null}
          </form>
        </div>
        <button className="join-next-button" type="button" onClick={handleMoveNext}>다음</button>
      </div>
    </>
  );
}

export default Join;
