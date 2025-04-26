class NavigationService {
  constructor() {
  }

  getRoomIdFromUrl() {  
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");
    return roomId;
  }

  redirectToUrl(role, roomId) {
    if (role === "host") {
      window.location.href = "/desktop?roomId=" + roomId;
    } else if (role === "guest") {
      window.location.href = "/mobile?roomId=" + roomId;
    }
  }
}

export const navigationService = new NavigationService();
