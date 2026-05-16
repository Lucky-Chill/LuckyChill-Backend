import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Reservation {
  id: string;
  roomNumber: string;
  date: string;
  time: string;
  userId: string;
  userEmail: string;
}

export type ReservationSlot = Pick<Reservation, 'roomNumber' | 'date' | 'time'>;

export function subscribeReservations(onData: (reservations: Reservation[]) => void) {
  return onSnapshot(collection(db, 'reservations'), (snapshot) => {
    onData(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Reservation, 'id'>),
      })),
    );
  });
}

export async function createReservations(
  userId: string,
  userEmail: string,
  slots: ReservationSlot[],
) {
  const batch = writeBatch(db);
  slots.forEach((slot) => {
    const ref = doc(collection(db, 'reservations'));
    batch.set(ref, {
      ...slot,
      userId,
      userEmail,
      createdAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function cancelReservationGroup(
  userId: string,
  roomNumber: string,
  date: string,
  times: string[],
) {
  const q = query(collection(db, 'reservations'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  await Promise.all(
    snapshot.docs
      .filter((d) => {
        const data = d.data();
        return (
          data.roomNumber === roomNumber &&
          data.date === date &&
          times.includes(data.time as string)
        );
      })
      .map((d) => deleteDoc(doc(db, 'reservations', d.id))),
  );
}
