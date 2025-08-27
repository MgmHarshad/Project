let logoutUser = async (req, res) => {
  res.clearCookie("uid", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
export { logoutUser };
