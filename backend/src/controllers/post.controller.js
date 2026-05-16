function createPost(req, res) {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "title, content, category는 필수입니다."
      }
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      postId: 1
    },
    error: null
  });
}

function getPostList(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      items: [
        {
          id: 1,
          title: "코드 리뷰 부탁드립니다",
          category: "CODE_REVIEW",
          author: {
            id: 1,
            name: "윤재"
          },
          likeCount: 3,
          commentCount: 2,
          views: 10,
          githubUrl: "https://github.com/user/repo",
          createdAt: "2026-05-16T10:00:00.000Z"
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 1
      }
    },
    error: null
  });
}

function getPostDetail(req, res) {
  const { postId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      id: Number(postId),
      title: "코드 리뷰 부탁드립니다",
      content: "이 부분에서 에러가 납니다.",
      category: "CODE_REVIEW",
      githubUrl: "https://github.com/user/repo",
      fileUrl: "https://example.com/file.zip",
      views: 11,
      likeCount: 3,
      commentCount: 2,
      author: {
        id: 1,
        name: "윤재",
        profileImage: "https://example.com/profile.png"
      },
      createdAt: "2026-05-16T10:00:00.000Z",
      updatedAt: "2026-05-16T10:00:00.000Z"
    },
    error: null
  });
}

function updatePost(req, res) {
  const { postId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      postId: Number(postId)
    },
    error: null
  });
}

function deletePost(req, res) {
  const { postId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      postId: Number(postId)
    },
    error: null
  });
}

function togglePostLike(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      liked: true,
      likeCount: 4
    },
    error: null
  });
}

module.exports = {
  createPost,
  getPostList,
  getPostDetail,
  updatePost,
  deletePost,
  togglePostLike
};
