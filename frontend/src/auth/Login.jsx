import { useEffect } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const handleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default Login;
