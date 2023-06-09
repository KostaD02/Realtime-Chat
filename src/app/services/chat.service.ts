import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface IChat {
  id: string;
  name: string;
  messages: IChatMessage[];
  createAt: string;
  updatedAt: string;
  allowedUsersID: IChatUsers[];
  imageURL?: string;
}

export interface IChatMessage {
  index: number;
  message: string;
  createAt: string;
  uploaderID: string;
}

export interface IChatUsers {
  uid: string;
  fullName: string;
  isCreator: boolean;
  imageURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public readonly CollectionPath: string = "/chats";

  constructor(private afs: AngularFirestore) { }

  public addChat(chat: IChat) {
    return this.afs.collection(this.CollectionPath).add(chat).then(res => {
      chat.id = res.id;
      this.updateChat(chat);
    }, err => {
      console.log(err);
    })
  }

  public getChatByID(id: string) {
    return this.afs.doc(`${this.CollectionPath}/${id}`).get();
  }

  public getAllChats() {
    return this.afs.collection(this.CollectionPath).snapshotChanges();
  }

  public updateChat(chat: IChat) {
    return this.afs.doc(`${this.CollectionPath}/${chat.id}`).update(chat);
  }

  public deleteChat(chat: IChat) {
    return this.afs.doc(`${this.CollectionPath}/${chat.id}`).delete();
  }
}
