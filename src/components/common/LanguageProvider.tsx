"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AppLanguage = "English" | "हिन्दी";
type Dictionary = Record<string, string>;

const hindi: Dictionary = {
  Home: "होम", People: "लोग", Activity: "गतिविधि", Profile: "प्रोफ़ाइल", All: "सभी", Given: "दिए", Received: "मिले", "To receive": "मिलने हैं", optional: "वैकल्पिक", English: "English", "हिन्दी": "हिन्दी",
  "Edit profile": "प्रोफ़ाइल संपादित करें", Notifications: "नोटिफिकेशन", "No notifications yet": "अभी कोई नोटिफिकेशन नहीं", "Reminders and account updates will appear here.": "रिमाइंडर और अकाउंट अपडेट यहाँ दिखाई देंगे।", "Back to profile": "प्रोफ़ाइल पर वापस जाएँ", Language: "भाषा", "App lock": "ऐप लॉक", "Export records": "रिकॉर्ड एक्सपोर्ट करें", "Help & support": "मदद और सहायता", "Privacy policy": "प्राइवेसी पॉलिसी", "Log out": "लॉग आउट", "Your people": "आपके लोग", "View all": "सभी देखें", "Net balance": "कुल बैलेंस", "You will receive": "आपको मिलेंगे", "You will pay": "आपको देने हैं", "Give money": "पैसे दिए", "To pay": "देने हैं", "Coming up": "आने वाले", "No people yet": "अभी कोई व्यक्ति नहीं", "No activity yet": "अभी कोई गतिविधि नहीं", "No matching activity found.": "कोई मिलती-जुलती गतिविधि नहीं मिली।", "No people match this search.": "इस खोज से कोई व्यक्ति नहीं मिला।", "Clear filters": "फ़िल्टर हटाएँ", "Add person": "व्यक्ति जोड़ें", "Add someone to start tracking money you give or receive.": "पैसे देने या लेने का हिसाब रखने के लिए किसी व्यक्ति को जोड़ें।", "Your money, in balance": "आपके पैसों का पूरा हिसाब", "Money given": "दिए गए पैसे", "Repayment received": "वापस मिले पैसे", "Money taken": "लिए गए पैसे", "Your money entries and repayments will appear here.": "आपकी पैसों की एंट्री और वापसी यहाँ दिखाई देंगी।", "Person details": "व्यक्ति की जानकारी", "Edit person": "व्यक्ति संपादित करें", "Delete person": "व्यक्ति हटाएँ", Edit: "संपादित करें", Delete: "हटाएँ", Cancel: "रद्द करें", "Delete this person?": "क्या यह व्यक्ति हटाना है?", "This action cannot be undone.": "यह कार्रवाई वापस नहीं की जा सकती।", "Add entry": "एंट्री जोड़ें", "I gave": "मैंने दिए", "Repaid me": "मुझे वापस मिले", Person: "व्यक्ति", Amount: "राशि", Date: "तारीख", Note: "नोट", "Due date": "अंतिम तारीख", "Save entry": "एंट्री सेव करें", "Save changes": "बदलाव सेव करें", "No outstanding transactions.": "कोई बकाया लेन-देन नहीं है।", "No transactions yet": "अभी कोई लेन-देन नहीं है।"
};

const accountHindi: Dictionary = {
  "Delete account": "अकाउंट डिलीट करें",
  "Delete account?": "अकाउंट डिलीट करें?",
  "Deleting your account will permanently remove your profile, people, transactions, and account data. You will be logged out and this action cannot be undone.": "अकाउंट डिलीट करने पर आपकी प्रोफ़ाइल, लोग, लेन-देन और अकाउंट का डेटा हमेशा के लिए हट जाएगा। आपको लॉग आउट कर दिया जाएगा और यह कार्रवाई वापस नहीं की जा सकती।",
  "Type Delete to confirm": "पुष्टि के लिए Delete टाइप करें",
};

type LanguageContextValue = { language: AppLanguage; setLanguage: (language: AppLanguage) => void; t: (text: string) => string };
const LanguageContext = createContext<LanguageContextValue>({ language: "English", setLanguage: () => undefined, t: (text) => text });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("English");
  useEffect(() => { const saved = localStorage.getItem("lenden_language"); if (saved === "हिन्दी" || saved === "English") setLanguageState(saved); }, []);
  const setLanguage = useCallback((next: AppLanguage) => { setLanguageState(next); localStorage.setItem("lenden_language", next); }, []);
  const value = useMemo(() => ({ language, setLanguage, t: (text: string) => language === "हिन्दी" ? accountHindi[text] || hindi[text] || text : text }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
