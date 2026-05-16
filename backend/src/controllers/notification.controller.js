function getNotificationList(req, res) {
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        type: "COMMENT",
        message: "내 게시글에 댓글이 달렸습니다.",
        postId: 1,
        isRead: false,
        createdAt: "2026-05-16T11:00:00.000Z"
      }
    ],
    error: null
  });
}

function readNotification(req, res) {
  const { notificationId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      notificationId: Number(notificationId),
      isRead: true
    },
    error: null
  });
}

module.exports = {
  getNotificationList,
  readNotification
};
