import { Search, Bell, User, X, Upload, Link2, FileCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import gachonLogo from '../imports/image.png';
import { auth, googleProvider } from '../lib/firebase';
import {
  addComment,
  createPost,
  likePost,
  subscribeComments,
  subscribePosts,
  type Comment,
  type Post,
} from '../lib/postsService';
import {
  cancelReservationGroup,
  createReservations,
  subscribeReservations,
  type Reservation,
} from '../lib/reservationsService';
import ClassroomReservation from './components/ClassroomReservation';
import MyReservations from './components/MyReservations';

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('강의실 예약');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [githubLink, setGithubLink] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  // 카테고리 데이터
  const categories = ['강의실 예약', '스터디 팀 모집', '코드 리뷰'];

  const [posts, setPosts] = useState<Post[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await createPost({
        category: selectedCategory,
        title: title.trim(),
        content: content.trim(),
        authorEmail: userEmail,
        authorName: userEmail.split('@')[0],
        hasFiles: uploadedFiles.length > 0,
        githubUrl: githubLink.trim() || undefined,
        files: uploadedFiles.map(file => ({ name: file.name, size: file.size })),
      });
      setShowWriteModal(false);
      setUploadedFiles([]);
      setGithubLink('');
      setTitle('');
      setContent('');
    } catch {
      alert('글 저장에 실패했습니다. Firestore → 규칙 탭을 확인해주세요.');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await addComment(postId, userEmail, userEmail.split('@')[0], newComment.trim());
      setNewComment('');
    } catch {
      alert('댓글 저장에 실패했습니다.');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
    } catch {
      alert('공감 처리에 실패했습니다.');
    }
  };

  const handleCancelReservation = async (
    reservation: { roomNumber: string; date: string; time: string },
    times: string[],
  ) => {
    if (!userId) return;
    try {
      await cancelReservationGroup(userId, reservation.roomNumber, reservation.date, times);
    } catch {
      alert('예약 취소에 실패했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error(firebaseError.code, firebaseError.message);
      alert(
        `Google 로그인 시작 실패 (${firebaseError.code || 'unknown'})\n\n` +
          'Firebase 콘솔에서 Google 로그인 사용 설정을 확인해주세요.',
      );
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
    setShowUserMenu(false);
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const initAuth = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        const firebaseError = error as FirebaseError;
        console.error(firebaseError.code, firebaseError.message);
        if (firebaseError.code) {
          alert(
            `Google 로그인 오류: ${firebaseError.code}\n${firebaseError.message}\n\n` +
              '아래 Firebase / Google Cloud 설정을 확인해주세요.',
          );
        }
      }

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user?.email) {
          setUserEmail(user.email);
          setUserId(user.uid);
          setIsLoggedIn(true);
        } else {
          setUserEmail('');
          setUserId('');
          setIsLoggedIn(false);
        }
        setAuthReady(true);
        setLoginLoading(false);
      });
    };

    initAuth();
    return () => unsubscribe();
  }, []);

  // 임시 알림 데이터
  const notifications = [
    { id: 1, type: 'like', postTitle: 'React 컴포넌트 구조 리뷰 부탁드립니다', userName: '김철수', time: '5분 전' },
    { id: 2, type: 'comment', postTitle: '알고리즘 스터디 모집합니다', userName: '이영희', content: '저도 참여하고 싶습니다!', time: '10분 전' },
    { id: 3, type: 'like', postTitle: '2층 세미나실 예약', userName: '박민수', time: '1시간 전' },
    { id: 4, type: 'comment', postTitle: 'Java 스프링 부트 API 리뷰 요청', userName: '정지훈', content: 'REST API 설계가 좋아보입니다', time: '2시간 전' },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      setPosts([]);
      setAllReservations([]);
      setPostsLoading(false);
      return;
    }

    setPostsLoading(true);
    const unsubPosts = subscribePosts(
      (nextPosts) => {
        setPosts(nextPosts);
        setPostsLoading(false);
        setSelectedPost((current) =>
          current ? nextPosts.find((p) => p.id === current.id) ?? current : null,
        );
      },
      () => {
        alert(
          '게시글을 불러오지 못했습니다.\nFirestore → 규칙 탭에서 firestore.rules 내용을 붙여넣고 게시해주세요.',
        );
        setPostsLoading(false);
      },
    );

    const unsubReservations = subscribeReservations(setAllReservations);

    return () => {
      unsubPosts();
      unsubReservations();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!selectedPost) {
      setPostComments([]);
      return;
    }

    const unsub = subscribeComments(selectedPost.id, setPostComments);
    return () => unsub();
  }, [selectedPost?.id]);

  const reservationSlots = allReservations.map(({ roomNumber, date, time }) => ({
    roomNumber,
    date,
    time,
  }));

  const myReservations = allReservations
    .filter((r) => r.userId === userId)
    .map(({ roomNumber, date, time }) => ({ roomNumber, date, time }));

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-menu') && !target.closest('.user-menu')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!authReady) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!isLoggedIn) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={gachonLogo} alt="Gachon University Logo" className="w-16 h-16" />
              <h1 className="text-2xl font-bold text-black">컴퓨터공학과 게시판</h1>
            </div>
            <p className="text-gray-600">가천대 컴퓨터공학과 게시판</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-gray-700">
                {loginLoading ? 'Google 페이지로 이동 중...' : 'Google로 계속하기'}
              </span>
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              접속 주소: {window.location.origin}
              <br />
              <strong>http://localhost:5173</strong> 으로 접속해야 합니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-red-500">컴퓨터공학과 게시판</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="전체 게시판의 글을 검색하세요."
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* 알림 버튼 */}
          <div className="relative notification-menu">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">알림</h3>
                </div>
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start gap-2">
                          {notif.type === 'like' ? (
                            <span className="text-red-500 text-sm">❤️</span>
                          ) : (
                            <span className="text-blue-500 text-sm">💬</span>
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{notif.userName}</span>님이{' '}
                              {notif.type === 'like' ? '좋아요를 눌렀습니다' : '댓글을 남겼습니다'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{notif.postTitle}</p>
                            {notif.type === 'comment' && notif.content && (
                              <p className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                                {notif.content}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    알림이 없습니다
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 사용자 메뉴 */}
          <div className="relative user-menu">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    // 내 활동 페이지로 이동 (추후 구현)
                    alert('내 활동 페이지 (준비 중)');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  내 활동
                </button>
                <button
                  onClick={() => {
                    setShowMyReservations(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  나의 예약 현황
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">게시판</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 메인 게시판 영역 */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory}</h2>
              {selectedCategory !== '강의실 예약' && (
                <button
                  onClick={() => setShowWriteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  글쓰기
                </button>
              )}
            </div>

            {/* 강의실 예약 페이지 */}
            {selectedCategory === '강의실 예약' ? (
              <ClassroomReservation
                existingReservations={reservationSlots}
                onConfirmReservation={(slots) =>
                  createReservations(userId, userEmail, slots)
                }
              />
            ) : (
              /* 게시글 목록 */
              <div className="bg-white rounded-lg border border-gray-200">
                {postsLoading && (
                  <p className="p-8 text-center text-gray-500 text-sm">게시글 불러오는 중...</p>
                )}
                {!postsLoading &&
                  posts.filter((post) => post.category === selectedCategory).length === 0 && (
                    <p className="p-8 text-center text-gray-500 text-sm">
                      아직 글이 없습니다. 글쓰기로 첫 글을 남겨보세요!
                    </p>
                  )}
                {posts
                  .filter(post => post.category === selectedCategory)
                  .map((post, index, filteredPosts) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      index !== filteredPosts.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">{post.category}</span>
                          {post.isHot && (
                            <span className="text-xs text-red-500 font-semibold">HOT</span>
                          )}
                          {post.hasFiles && (
                            <FileCode className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                        {post.githubUrl && (
                          <a
                            href={post.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link2 className="w-3 h-3" />
                            {post.githubUrl}
                          </a>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>공감 {post.likes}</span>
                          <span>댓글 {post.comments}</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* 게시물 상세 모달 */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold">{selectedPost.category}</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* 게시물 헤더 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedPost.isHot && (
                      <span className="text-xs text-red-500 font-semibold">HOT</span>
                    )}
                    {selectedPost.hasFiles && (
                      <FileCode className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedPost.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{selectedPost.authorName}</span>
                    <span>{selectedPost.time}</span>
                  </div>
                </div>

                {/* 게시물 본문 */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap mb-4">{selectedPost.content}</p>

                  {selectedPost.githubUrl && (
                    <a
                      href={selectedPost.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline bg-blue-50 px-3 py-2 rounded-md"
                    >
                      <Link2 className="w-4 h-4" />
                      {selectedPost.githubUrl}
                    </a>
                  )}

                  {selectedPost.files && selectedPost.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">첨부 파일</p>
                      {selectedPost.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                        >
                          <FileCode className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 공감 버튼 */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <span>❤️</span>
                    <span>공감 {selectedPost.likes}</span>
                  </button>
                  <span className="text-sm text-gray-500">댓글 {selectedPost.comments}</span>
                </div>

                {/* 댓글 섹션 */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">댓글</h3>

                  {/* 댓글 목록 */}
                  <div className="space-y-4 mb-6">
                    {postComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        <button className="text-xs text-gray-500 hover:text-red-500">
                          공감 {comment.likes}
                        </button>
                      </div>
                    ))}
                    {postComments.length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-8">
                        첫 댓글을 작성해보세요!
                      </p>
                    )}
                  </div>

                  {/* 댓글 작성 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(selectedPost.id);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={() => handleAddComment(selectedPost.id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      작성
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 나의 예약 현황 모달 */}
        {showMyReservations && (
          <MyReservations
            reservations={myReservations}
            userEmail={userEmail}
            onClose={() => setShowMyReservations(false)}
            onCancelReservation={(roomNumber, date, times) =>
              handleCancelReservation({ roomNumber, date, time: times[0] }, times)
            }
          />
        )}

        {/* 글쓰기 모달 */}
        {showWriteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">글쓰기 - {selectedCategory}</h3>
                <button
                  onClick={() => {
                    setShowWriteModal(false);
                    setUploadedFiles([]);
                    setGithubLink('');
                    setTitle('');
                    setContent('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    placeholder="내용을 입력하세요"
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                {selectedCategory === '코드 리뷰' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        파일 첨부
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json,.md"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            클릭하여 파일을 업로드하거나 드래그하여 추가하세요
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            지원 파일: .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .h, .css, .html, .json, .md
                          </p>
                        </label>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <FileCode className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-gray-200 rounded-full"
                              >
                                <X className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub 링크
                      </label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://github.com/username/repository"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    작성 완료
                  </button>
                  <button
                    onClick={() => {
                      setShowWriteModal(false);
                      setUploadedFiles([]);
                      setGithubLink('');
                      setTitle('');
                      setContent('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}