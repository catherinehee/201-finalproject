import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'



function UserData() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const uid = Cookies.get('uid');

    if (uid) {
        navigate(`/${uid}/files`)
//      const firestore = getFirestore();
//      const userDocRef = doc(firestore, 'users', uid);
//
//      getDoc(userDocRef)
//        .then((docSnapshot) => {
//          if (docSnapshot.exists()) {
//            setUserData(docSnapshot.data());
//          } else {
//            console.log('User data not found.');
//          }
//        })
//        .catch((error) => {
//          console.error('Error fetching user data:', error);
//        })
//        .finally(() => {
//          setLoading(false);
//        });
    } else {
      console.log('UID not found in the cookie.');
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>User Data</h1>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UserData;
