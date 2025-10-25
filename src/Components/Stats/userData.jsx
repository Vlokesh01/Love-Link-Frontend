const userData = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const User = {
  id: userData ? userData._id : null,
  partnerId: userData ? userData.partnerId : null,
  token: userData ? userData.token : null,
};

export default User;
