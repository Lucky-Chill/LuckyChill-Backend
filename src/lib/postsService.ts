import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { formatRelativeTime } from './formatTime';

export interface Post {
  id: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  isHot: boolean;
  authorEmail: string;
  authorName: string;
  githubUrl?: string;
  hasFiles?: boolean;
  files?: { name: string; size: number }[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
}

interface PostDoc {
  category: string;
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
  likes: number;
  commentCount: number;
  githubUrl?: string;
  hasFiles?: boolean;
  files?: { name: string; size: number }[];
  createdAt: Timestamp;
}

function toPost(id: string, data: PostDoc): Post {
  const createdAt = data.createdAt?.toDate?.() ?? new Date();
  return {
    id,
    category: data.category,
    title: data.title,
    content: data.content,
    likes: data.likes ?? 0,
    comments: data.commentCount ?? 0,
    time: formatRelativeTime(createdAt),
    isHot: (data.likes ?? 0) >= 15,
    authorEmail: data.authorEmail,
    authorName: data.authorName,
    githubUrl: data.githubUrl,
    hasFiles: data.hasFiles,
    files: data.files,
  };
}

export function subscribePosts(
  onData: (posts: Post[]) => void,
  onError?: (error: Error) => void,
) {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map((d) => toPost(d.id, d.data() as PostDoc)));
    },
    (error) => {
      console.error(error);
      onError?.(error);
      onData([]);
    },
  );
}

export async function createPost(data: {
  category: string;
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
  githubUrl?: string;
  hasFiles?: boolean;
  files?: { name: string; size: number }[];
}) {
  await addDoc(collection(db, 'posts'), {
    ...data,
    likes: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function likePost(postId: string) {
  await updateDoc(doc(db, 'posts', postId), { likes: increment(1) });
}

export function subscribeComments(postId: string, onData: (comments: Comment[]) => void) {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, (snapshot) => {
    onData(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          author: data.authorName as string,
          content: data.content as string,
          time: formatRelativeTime(data.createdAt?.toDate?.() ?? new Date()),
          likes: (data.likes as number) ?? 0,
        };
      }),
    );
  });
}

export async function addComment(
  postId: string,
  authorEmail: string,
  authorName: string,
  content: string,
) {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    authorEmail,
    authorName,
    content,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) });
}
