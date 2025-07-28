import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getParkingDataWithCache, cacheParkingData } from '../utils/parkingCache';

export async function saveParkingData(uid: string, parking: any) {
  await setDoc(doc(db, 'parking', uid), parking, { merge: true });
}

export async function getParkingData(uid: string) {
  return getParkingDataWithCache(async () => {
    const docSnap = await getDoc(doc(db, 'parking', uid));
    const data = docSnap.exists() ? docSnap.data() : null;
    if (data) await cacheParkingData([data]);
    return data ? [data] : [];
  });
}

export async function addParkingHistory(uid: string, event: any) {
  await updateDoc(doc(db, 'parking', uid), {
    history: arrayUnion(event)
  });
}
