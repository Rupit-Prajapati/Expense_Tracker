import { firestore } from "@/utils/firebase";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server"
import { useCollectionData } from 'react-firebase-hooks/firestore';

export async function GET(req, res) {
  let collectionName = res.params.collectionName
  let data;
  try {
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);
    data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching documents: ', error);
  }
  return NextResponse.json({ data })
}

export async function POST(req, res) {

  let collectionName = res.params.collectionName;
  let data = await req.json();
  try {
    const collectionRef = collection(firestore, collectionName);
    const docRef = await addDoc(collectionRef, { ...data });
    console.log(`Document written with ID from route: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
  return NextResponse.json('data added successfully')
}

