import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Anonymous {
  id: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnonymousService { //? to keep track how many anonymous were in website as well have them unique integer
  public readonly CollectionPath: string = "/anonymous";

  constructor(private afs: AngularFirestore) { }

  public addAnonymous(chat: Anonymous) {
    return this.afs.collection(this.CollectionPath).add(chat).then(res => {
      chat.id = res.id;
      this.updateAnonymous(chat);
    }, err => {
      console.log(err);
    })
  }

  public getAnonymousByID(id: string) {
    return this.afs.doc(`${this.CollectionPath}/${id}`).get();
  }

  public getAnonymousValues() {
    return this.afs.collection(this.CollectionPath).snapshotChanges();
  }

  public updateAnonymous(chat: Anonymous) {
    return this.afs.doc(`${this.CollectionPath}/${chat.id}`).update(chat);
  }

  public deleteAnonymous(chat: Anonymous) {
    return this.afs.doc(`${this.CollectionPath}/${chat.id}`).delete();
  }
}
