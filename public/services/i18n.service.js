class I18nService {
  constructor() {
    this.language = "es";
  }

  async getLanguage() {
    try {
      const response = await fetch("../i18n/" + this.language + ".json");
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.translations = await response.json();
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  }

  translate(key) {
    return this.translations[key] || key;
  }
}

export const i18nService = new I18nService();
