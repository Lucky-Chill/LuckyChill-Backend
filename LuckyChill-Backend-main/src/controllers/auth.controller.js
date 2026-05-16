function googleLogin(req, res) {
  const { email, name, profileImage } = req.body;

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "email, name은 필수입니다."
      }
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      accessToken: "mock-jwt-token",
      user: {
        id: 1,
        email,
        name,
        profileImage: profileImage || null
      }
    },
    error: null
  });
}

function getMe(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      id: 1,
      email: "test@gmail.com",
      name: "윤재",
      profileImage: "https://example.com/profile.png"
    },
    error: null
  });
}

function logout(req, res) {
  return res.status(200).json({
    success: true,
    data: { message: "로그아웃 되었습니다." },
    error: null
  });
}

module.exports = {
  googleLogin,
  getMe,
  logout
};
