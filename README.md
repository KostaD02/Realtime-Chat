# RealTimeChat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Angular firestore issue "^7.6.1"

Change node_modules/@angular/fire/compat/firestore/interfaces.d.ts [issue fix](https://github.com/angular/angularfire/issues/3290)

export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot
export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot
export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot
export interface DocumentChange<T> extends firebase.firestore.DocumentChange

to:

export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot<T>
export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot<T>
export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot<T>
export interface DocumentChange<T> extends firebase.firestore.DocumentChange<T>
