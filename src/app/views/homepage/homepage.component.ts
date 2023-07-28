import { Component, OnDestroy, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AlertService, AuthService, ChatService, IChat } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public readonly GeneralChatID: string = "JTyA2v4yUkjDDvQKBrma"; // ? create one general chat by hand

  public userUID: string = "";
  public chats: IChat[] = [];
  public activeChat!: IChat;
  public activeChatIndex: number = -1;
  private activeChatID: string = "";

  public message: string = "";
  public chatID: string = "";
  private allChat: IChat[] = [];

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private chatService: ChatService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    this.authService.authState.pipe(
      tap(user => {
        if (user) {
          this.userUID = user.uid;
          this.chatService.getAllChats().pipe(
            tap(docs => {
              this.chats = [];
              this.allChat = [];
              docs.forEach((doc, index) => {
                this.allChat.push(doc.payload.doc.data() as IChat);
                const chat = doc.payload.doc.data() as IChat;
                if (chat.id === this.GeneralChatID) {
                  if (!chat.allowedUsersID.find(chatUser => chatUser.uid === user.uid)) {
                    chat.allowedUsersID.push({
                      uid: user.uid,
                      fullName: user.displayName || `Anonymous`,
                      imageURL: user.photoURL || "",
                      isCreator: false
                    });
                    this.chatService.updateChat(chat);
                  } else {
                    this.chats.push(chat);
                  }
                }
                if (chat.allowedUsersID.find(chatUser => chatUser.uid === user.uid)) {
                  if (!this.chats.find(chats => chats.id === chat.id)) {
                    this.chats.push(chat);
                  }
                }
                if (this.activeChatID === chat.id) {
                  this.activeChat = chat;
                  setTimeout(() => {
                    this.scrollToLastMessage();
                  }, 500);
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

  onChange(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    this.message = this.message.trim();
    if (this.message === "" || this.message === " ") {
      return;
    }
    this.authService.authState.pipe(
      take(1),
      tap(user => {
        if (user) {
          this.activeChat.messages.push({
            index: this.activeChat.messages.length,
            message: this.message,
            createAt: new Date().toString(),
            uploaderID: user.uid
          })
          this.chatService.updateChat(this.activeChat);
          this.message = "";
          setTimeout(() => {
            this.scrollToLastMessage();
          }, 500);
        }
      }),
    ).subscribe();
  }

  getUserData(uid: string, part: string) {
    const user = this.activeChat.allowedUsersID.find(user => user.uid === uid);
    if (part === "fullName") {
      return user?.fullName || "Anonymous";
    } else if (part === "image") {
      return user?.imageURL || "https://sandstormit.com/wp-content/uploads/2021/06/incognito-2231825_960_720-1.png";
    } else {
      return "";
    }
  }

  setActiveChat(chat: IChat, index: number) {
    this.activeChat = chat;
    this.activeChatIndex = index;
    this.message = "";
    this.activeChatID = chat.id;
    setTimeout(() => {
      this.scrollToLastMessage();
    }, 500);
  }

  scrollToLastMessage() {
    const middlePartContainer = document.querySelector(".chat__messages__active_chat__messages_part") as HTMLElement;
    middlePartContainer.scrollTo({
      top: middlePartContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  async createChat() {
    const { value: formValues } = await Swal.fire({
      title: 'Create chat',
      html:
        '<input type="text" placeholder="Chat name" id="swal-input1" class="swal2-input">' +
        '<input type="file" class="swal2-file" id="swal-input2">',
      focusConfirm: false,
      preConfirm: () => {
        return [(document.getElementById("swal-input1") as HTMLInputElement)?.value, (document.getElementById("swal-input2") as HTMLInputElement) || ""]
      }
    })

    if (formValues) {
      const name = formValues[0] as string;
      if (name === "" || name === " ") {
        return;
      }
      const fileInput = formValues[1] as HTMLInputElement;
      if (fileInput.files) {
        if (fileInput.files[0]) {
          const reader = new FileReader();
          reader.readAsDataURL(fileInput.files[0]);
          reader.onload = () => {
            const imageURL = reader.result as string;
            this.addChatToDatabase(name, imageURL);
          }
        } else {
          this.addChatToDatabase(name);
        }
      } else {
        this.addChatToDatabase(name);
      }
    }
  }

  joinChat() {
    this.chatID = this.chatID.trim();
    if (this.chatID === "" || this.chatID === " ") {
      return;
    }
    const chat = this.allChat.find(chat => chat.id === this.chatID);
    if (chat) {
      if (chat.allowedUsersID.find(user => user.uid === this.userUID)) {
        this.alertService.displayToast("You are already in chat", "info", "blue");
      } else {
        this.authService.authState.pipe(
          take(1),
          tap(user => {
            chat.allowedUsersID.push({
              uid: user?.uid || "",
              fullName: user?.displayName || "",
              isCreator: false,
              imageURL: user?.photoURL || ""
            });
            this.chatService.updateChat(chat);
            this.alertService.displayToast("You added to new chat", 'success', 'green');
            this.chatID = "";
          })
        ).subscribe();
      }
    } else {
      this.alertService.displayModal("error", "Not found", "Chat with this id isn't in database");
    }
  }

  copyID(id: string) {
    this.clipboard.copy(id);
    this.alertService.displayToast("Text copied", "success", "green");
  }

  private addChatToDatabase(name: string, imageURL: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png") {
    this.authService.authState.pipe(
      take(1),
      tap(user => {
        this.chatService.addChat({
          id: "",
          name,
          messages: [],
          createAt: new Date().toString(),
          updatedAt: new Date().toString(),
          allowedUsersID: [{
            uid: user?.uid || "",
            fullName: user?.displayName || "",
            isCreator: true,
            imageURL: user?.photoURL || ""
          }],
          imageURL
        });
        this.alertService.displayToast("Chat created", 'success', 'green');
      })
    ).subscribe();
  }

  clearChat() {
    Swal.fire({
      title: 'Delete all messages ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.activeChat.messages.length === 0) {
          Swal.fire(
            'Hmm',
            'Nothing to delete',
            'info'
          );
        } else {
          Swal.fire(
            'Deleted!',
            'Chat messages has been deleted.',
            'success'
          );
          this.activeChat.messages = [];
          this.activeChat.updatedAt = new Date().toString();
          this.chatService.updateChat(this.activeChat);
        }
      }
    })
  }

  leaveChat() {
    Swal.fire({
      title: 'Leave chat ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, leave it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Left!',
          'Your left chat.',
          'success'
        );
        this.activeChat.allowedUsersID = this.activeChat.allowedUsersID.filter(user => user.uid !== this.userUID);
        this.activeChat.updatedAt = new Date().toString();
        if (this.activeChat.allowedUsersID.length === 0) {
          this.chatService.deleteChat(this.activeChat);
        } else {
          this.chatService.updateChat(this.activeChat);
        }
      }
    })
  }

  deleteChat() {
    Swal.fire({
      title: 'Delete chat ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your chat has been deleted.',
          'success'
        );
        this.chatService.deleteChat(this.activeChat);
      }
    })
  }

  isUserAdmin() {
    return this.activeChat.allowedUsersID.find(user => user.uid === this.userUID)?.isCreator || false;
  }

  getActiveChat() {
    return this.allChat.find(chat => chat.id === this.activeChatID) || { name: "", id: "" };
  }
}
