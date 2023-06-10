import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AlertService, AuthService, ChatService, IChat } from 'src/app/services';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  private readonly GeneralChatID: string = "JTyA2v4yUkjDDvQKBrma";

  public chats: IChat[] = [];

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.authService.authState.pipe(
      tap(user => {
        if (user) {
          this.chatService.getAllChats().pipe(
            tap(docs => {
              docs.forEach(doc => {
                const chat = doc.payload.doc.data() as IChat;
                if (chat.id === this.GeneralChatID) {
                  if (!chat.allowedUsersID.find(chatUser => chatUser.uid === user.uid)) {
                    chat.allowedUsersID.push({
                      uid: user.uid,
                      fullName: user.displayName || `Anonymous`,
                      isCreator: false
                    });
                    this.chatService.updateChat(chat);
                  }
                }
              });
            }),
            takeUntil(this.destroy$)
          ).subscribe();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
