function getDataUrl(): string {
  const hostName: string = window.location.hostname;

  switch (hostName) {
    case "puregymshop.alistairmillard.me":
      return "/api";
    default:
      return "https://localhost:5001/api";
  }
}

export default getDataUrl;