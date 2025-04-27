class EventService {
  constructor() {
    this._subject = null;
    this.socket = null;
    this.roomId = null;
  }

  setSubject(subject) {
    this._subject = subject;
  }

  setRoomId(roomId) {
    this._roomId = roomId;
    if (this._roomId) {
      this._socket.emit("join-room", {
        roomId: this._roomId,
      });
    }
  }

  setSocket(socket) {
    this._socket = socket;
    this._socket.on("receive-event", (event) => {
      if (this._subject) {
        this._subject.next(event);
      }
    });
  }

  get subject() {
    return this._subject.asObservable();
  }

  getSocket() {
    return this._socket;
  }

  send(event) {
    if (this._roomId) {
      this._socket.emit("send-event", {
        event,
        roomId: this._roomId,
      });
    } else {
      this._subject.next(event);
    }
  }

  changeVideo(videoData) {
    this._socket.emit("change-video", {
      videoData,
      roomId: this._roomId,
    });
  }
}

export const eventService = new EventService();
