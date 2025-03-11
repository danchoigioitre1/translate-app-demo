export default function state() {
    return {
      username: '',
      supportedLanguages: [
        { displayName: "中文", type: "zh-CN", languageCode: "zh-CN" },     // Mandarin (普通话)
        { displayName: "Tiếng Việt", type: "vi-VN", languageCode: "vi" }, // Vietnamese (越南)
        { displayName: "한국어", type: "ko-KR", languageCode: "ko" },    // Korean (韩国)
        { displayName: "日本語", type: "ja-JP", languageCode: "jp" },     // Japanese (日本)
        { displayName: "English", type: "en-US", languageCode: "en" },
      ],
      oneSidedTranslationHistory: [],
      communicationHistory: [],
      websocketHistory: []
    };
  }
  