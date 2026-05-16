function getCommentListByPostId(req, res) {
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        content: "좋은 질문입니다.",
        author: {
          id: 2,
          name: "민수"
        },
        createdAt: "2026-05-16T10:20:00.000Z"
      }
    ],
    error: null
  });
}

function createCommentByPostId(req, res) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "content는 필수입니다."
      }
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      commentId: 1
    },
    error: null
  });
}

function deleteComment(req, res) {
  const { commentId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      commentId: Number(commentId)
    },
    error: null
  });
}

module.exports = {
  getCommentListByPostId,
  createCommentByPostId,
  deleteComment
};
