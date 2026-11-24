window.BKParameters = {
  async load() {
    const response = await fetch("../data/parameters.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load official parameter dataset.");
    return response.json();
  }
};
