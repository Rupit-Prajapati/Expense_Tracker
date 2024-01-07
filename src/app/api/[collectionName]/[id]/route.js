import { firestore } from "@/utils/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(req, res) {
  let documentId = res.params.id
  let collectionName = res.params.collectionName
  try {
    const documentRef = doc(firestore, collectionName, documentId);
    await deleteDoc(documentRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
  return NextResponse.json('deleted')
}

export async function GET(req, res) {
  let documentId = res.params.id
  let collectionName = res.params.collectionName
  const documentRef = doc(firestore, collectionName, documentId,)
  const getdocument = await getDoc(documentRef)
  let data = { id: getdocument.id, ...getdocument.data() }
  return NextResponse.json(data)
}
export async function PUT(req, res) {
  const documentId = res.params.id;
  const collectionName = res.params.collectionName;

  let data = await req.json();
  const documentRef = doc(firestore, collectionName, documentId)
  await updateDoc(documentRef, data)
  return NextResponse.json('data updated successfully');
}