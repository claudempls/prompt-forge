type LangCode = 'en' | 'cs' | 'zh' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'pl' | 'ja'

const LANG_MAP: Record<string, LangCode> = {
  'English':    'en',
  'Čeština':    'cs',
  '中文':        'zh',
  'Español':    'es',
  'Deutsch':    'de',
  'Français':   'fr',
  'Italiano':   'it',
  'Português':  'pt',
  'Polski':     'pl',
  '日本語':      'ja',
}

export interface T {
  // HomePage
  homeTitle: string
  homeSubtitle: string
  homePlaceholder: string
  homeShortcut: string
  homeAnalyzing: string
  homeImprove: string
  homeTryExample: string
  homeWriteFirst: string
  // Modes
  modeLite: string
  modeLiteDesc: string
  modeStandard: string
  modeStandardDesc: string
  modeExpert: string
  modeExpertDesc: string
  modeCompact: string
  modeCompactDesc: string
  modeLabel: string
  // Category labels
  catAuto: string
  catCode: string
  catMail: string
  catContent: string
  catData: string
  catImage: string
  catSeo: string
  catChat: string
  // QuestionsPage
  qBack: string
  qQuestion: string
  qChooseOne: string
  qChooseMany: string
  qTypeAnswer: string
  qSkip: string
  qNext: string
  qForge: string
  qForging: string
  // ResultPage
  rTitle: string
  rSubtitle: string
  rCopy: string
  rCopied: string
  rBefore: string
  rAfter: string
  rWhatImproved: string
  rOriginal: string
  rImproveAnother: string
  rEditAnswers: string
  rNewPrompt: string
  // SettingsPage
  sSettings: string
  sProPlan: string
  sFreePlan: string
  sUnlimited: string
  sUpgrade: string
  sManage: string
  sTodaysUsage: string
  sResetsAt: string
  sLanguage: string
  sQuickMode: string
  sQuickModeDesc: string
  sSave: string
  sSaved: string
  sResetApp: string
  sResetAppDesc: string
  sReset: string
  sLogout: string
  sLogoutDesc: string
  // ProModal
  pmPerMonth: string
  pmSubscribe: string
  pmFeatApi: string
  pmFeatApiDesc: string
  pmFeatSync: string
  pmFeatSyncDesc: string
  pmFeatModels: string
  pmFeatModelsDesc: string
  pmFeatUnlimited: string
  pmFeatUnlimitedDesc: string
  // CancelModal
  cmTitle: string
  cmDesc: string
  cmYouLose: string
  cmLose1: string
  cmLose2: string
  cmLose3: string
  cmCancel: string
  cmAlreadyCancelled: string
  cmKeepPro: string
}

const TRANSLATIONS: Record<LangCode, T> = {
  en: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Improve your prompt',
    homeSubtitle: 'Paste any rough idea — PromptForge asks a few smart questions and transforms it into something precise.',
    homePlaceholder: 'Describe what you want to build, write, or create…',
    homeShortcut: '⌘+Enter to improve',
    homeAnalyzing: 'Analyzing…',
    homeImprove: 'Improve',
    homeTryExample: 'Try an example',
    homeWriteFirst: 'Write something first.',
    catAuto: 'Auto', catCode: 'Code', catMail: 'Mail', catContent: 'Content',
    catData: 'Data', catImage: 'Image', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Back', qQuestion: 'Question',
    qChooseOne: 'Choose one · press 1–', qChooseMany: 'Choose all that apply · press 1–',
    qTypeAnswer: 'Type your answer', qSkip: 'Skip', qNext: 'Next',
    qForge: 'Forge my prompt', qForging: 'Forging…',
    rTitle: 'Your enhanced prompt', rSubtitle: 'Ready to use — copy and paste anywhere',
    rCopy: 'Copy prompt', rCopied: 'Copied!',
    rBefore: 'before', rAfter: 'after',
    rWhatImproved: 'What was improved', rOriginal: 'Original',
    rImproveAnother: 'Improve another prompt', rEditAnswers: 'Edit answers', rNewPrompt: 'New prompt',
    sSettings: 'Settings', sProPlan: 'Pro plan', sFreePlan: 'Free plan',
    sUnlimited: 'Unlimited · no rate limits', sUpgrade: 'Upgrade to Pro', sManage: 'Manage',
    sTodaysUsage: "Today's usage", sResetsAt: 'Resets at midnight',
    sLanguage: 'Language', sQuickMode: 'Quick Mode',
    sQuickModeDesc: 'Option+Space opens the floating overlay anywhere — type a prompt, answer questions, and the enhanced result auto-pastes back.',
    sSave: 'Save changes', sSaved: '✓ Saved',
    sResetApp: 'Reset app', sResetAppDesc: 'Returns to welcome screen', sReset: 'Reset',
    sLogout: 'Log out', sLogoutDesc: 'Sign out of your account',
    pmPerMonth: '/ month · cancel anytime', pmSubscribe: 'Subscribe — $3/month',
    pmFeatApi: 'API included', pmFeatApiDesc: 'No key needed',
    pmFeatSync: 'Sync', pmFeatSyncDesc: 'Preferences everywhere',
    pmFeatModels: 'Priority models', pmFeatModelsDesc: 'Fastest tiers',
    pmFeatUnlimited: 'Unlimited', pmFeatUnlimitedDesc: 'No rate limits',
    cmTitle: 'Cancel Pro?', cmDesc: "You'll lose access at the end of your billing period.",
    cmYouLose: "You'll lose:", cmLose1: 'Unlimited daily prompts → 5/day',
    cmLose2: 'Priority model access', cmLose3: 'API key included',
    cmCancel: 'Cancel subscription →', cmAlreadyCancelled: 'Already cancelled — switch to Free', cmKeepPro: 'Keep Pro',
  },
  cs: {
    modeLite: 'Lehký',
    modeLiteDesc: 'Okamžité vylepšení bez otázek',
    modeStandard: 'Standardní',
    modeStandardDesc: '3–5 cílených otázek',
    modeExpert: 'Expertní',
    modeExpertDesc: '6–10 podrobných otázek',
    modeCompact: 'Kompaktní',
    modeCompactDesc: 'Úsporný prompt v čínštině bez otázek; odpovědi ve tvém jazyce',
    modeLabel: 'Režim',

    homeTitle: 'Vylepši svůj prompt',
    homeSubtitle: 'Vlož libovolný nápad — PromptForge položí pár chytrých otázek a převede ho na přesný prompt.',
    homePlaceholder: 'Popiš, co chceš vytvořit, napsat nebo sestavit…',
    homeShortcut: '⌘+Enter pro vylepšení',
    homeAnalyzing: 'Analyzuji…',
    homeImprove: 'Vylepšit',
    homeTryExample: 'Vyzkoušej příklad',
    homeWriteFirst: 'Nejdřív něco napiš.',
    catAuto: 'Auto', catCode: 'Kód', catMail: 'Email', catContent: 'Obsah',
    catData: 'Data', catImage: 'Obrázek', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Zpět', qQuestion: 'Otázka',
    qChooseOne: 'Vyber jednu · stiskni 1–', qChooseMany: 'Vyber vše, co platí · stiskni 1–',
    qTypeAnswer: 'Napiš svou odpověď', qSkip: 'Přeskočit', qNext: 'Další',
    qForge: 'Vykovat prompt', qForging: 'Kování…',
    rTitle: 'Tvůj vylepšený prompt', rSubtitle: 'Připraveno k použití — zkopíruj a vlož kamkoli',
    rCopy: 'Kopírovat prompt', rCopied: 'Zkopírováno!',
    rBefore: 'před', rAfter: 'po',
    rWhatImproved: 'Co bylo vylepšeno', rOriginal: 'Originál',
    rImproveAnother: 'Vylepšit další prompt', rEditAnswers: 'Upravit odpovědi', rNewPrompt: 'Nový prompt',
    sSettings: 'Nastavení', sProPlan: 'Pro plán', sFreePlan: 'Bezplatný plán',
    sUnlimited: 'Neomezený · bez limitů', sUpgrade: 'Upgradovat na Pro', sManage: 'Spravovat',
    sTodaysUsage: 'Dnešní využití', sResetsAt: 'Obnovuje se o půlnoci',
    sLanguage: 'Jazyk', sQuickMode: 'Rychlý režim',
    sQuickModeDesc: 'Option+Space otevře plovoucí overlay kdekoli — napiš prompt, odpověz na otázky a výsledek se automaticky vloží zpět.',
    sSave: 'Uložit změny', sSaved: '✓ Uloženo',
    sResetApp: 'Resetovat aplikaci', sResetAppDesc: 'Vrátí na uvítací obrazovku', sReset: 'Resetovat',
    sLogout: 'Odhlásit se', sLogoutDesc: 'Odhlásit se z účtu',
    pmPerMonth: '/ měsíc · zrušit kdykoliv', pmSubscribe: 'Předplatit — 3 $/měs.',
    pmFeatApi: 'API v ceně', pmFeatApiDesc: 'Bez nutnosti klíče',
    pmFeatSync: 'Synchronizace', pmFeatSyncDesc: 'Preference všude',
    pmFeatModels: 'Prioritní modely', pmFeatModelsDesc: 'Nejrychlejší úrovně',
    pmFeatUnlimited: 'Neomezené', pmFeatUnlimitedDesc: 'Bez omezení počtu',
    cmTitle: 'Zrušit Pro?', cmDesc: 'Přístup ztratíš na konci fakturačního období.',
    cmYouLose: 'Ztratíš:', cmLose1: 'Neomezené prompty → 5/den',
    cmLose2: 'Prioritní přístup k modelům', cmLose3: 'Zahrnutý API klíč',
    cmCancel: 'Zrušit předplatné →', cmAlreadyCancelled: 'Již zrušeno — přejít na Free', cmKeepPro: 'Zachovat Pro',
  },
  zh: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: '优化你的提示词',
    homeSubtitle: '粘贴任何粗糙的想法——PromptForge 会提几个智能问题，将其转化为精准的提示词。',
    homePlaceholder: '描述你想构建、撰写或创作的内容…',
    homeShortcut: '⌘+Enter 优化',
    homeAnalyzing: '分析中…',
    homeImprove: '优化',
    homeTryExample: '试试示例',
    homeWriteFirst: '请先输入内容。',
    catAuto: '自动', catCode: '代码', catMail: '邮件', catContent: '内容',
    catData: '数据', catImage: '图像', catSeo: 'SEO', catChat: '对话',
    qBack: '返回', qQuestion: '问题',
    qChooseOne: '选择一项 · 按 1–', qChooseMany: '选择所有适用项 · 按 1–',
    qTypeAnswer: '输入你的回答', qSkip: '跳过', qNext: '下一步',
    qForge: '锻造我的提示词', qForging: '锻造中…',
    rTitle: '你的优化提示词', rSubtitle: '可立即使用——复制并粘贴到任何地方',
    rCopy: '复制提示词', rCopied: '已复制！',
    rBefore: '之前', rAfter: '之后',
    rWhatImproved: '改进内容', rOriginal: '原始',
    rImproveAnother: '优化另一个提示词', rEditAnswers: '编辑答案', rNewPrompt: '新提示词',
    sSettings: '设置', sProPlan: 'Pro 计划', sFreePlan: '免费计划',
    sUnlimited: '无限制 · 无速率限制', sUpgrade: '升级到 Pro', sManage: '管理',
    sTodaysUsage: '今日使用量', sResetsAt: '每天午夜重置',
    sLanguage: '语言', sQuickMode: '快速模式',
    sQuickModeDesc: 'Option+Space 在任何地方打开浮动窗口——输入提示词，回答问题，优化结果自动粘贴回去。',
    sSave: '保存更改', sSaved: '✓ 已保存',
    sResetApp: '重置应用', sResetAppDesc: '返回欢迎界面', sReset: '重置',
    sLogout: '退出登录', sLogoutDesc: '退出你的账户',
    pmPerMonth: '/ 月 · 随时取消', pmSubscribe: '订阅 — $3/月',
    pmFeatApi: '包含 API', pmFeatApiDesc: '无需密钥',
    pmFeatSync: '同步', pmFeatSyncDesc: '偏好随处可用',
    pmFeatModels: '优先模型', pmFeatModelsDesc: '最快速度',
    pmFeatUnlimited: '无限制', pmFeatUnlimitedDesc: '无速率限制',
    cmTitle: '取消 Pro？', cmDesc: '你的访问权限将在账单周期结束时停止。',
    cmYouLose: '你将失去：', cmLose1: '无限次提示 → 每天5次',
    cmLose2: '优先模型访问', cmLose3: '包含 API 密钥',
    cmCancel: '取消订阅 →', cmAlreadyCancelled: '已取消 — 切换到免费版', cmKeepPro: '保留 Pro',
  },
  es: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Mejora tu prompt',
    homeSubtitle: 'Pega cualquier idea — PromptForge hace algunas preguntas inteligentes y la transforma en algo preciso.',
    homePlaceholder: 'Describe lo que quieres construir, escribir o crear…',
    homeShortcut: '⌘+Enter para mejorar',
    homeAnalyzing: 'Analizando…',
    homeImprove: 'Mejorar',
    homeTryExample: 'Prueba un ejemplo',
    homeWriteFirst: 'Escribe algo primero.',
    catAuto: 'Auto', catCode: 'Código', catMail: 'Correo', catContent: 'Contenido',
    catData: 'Datos', catImage: 'Imagen', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Volver', qQuestion: 'Pregunta',
    qChooseOne: 'Elige una · presiona 1–', qChooseMany: 'Elige todas las que apliquen · presiona 1–',
    qTypeAnswer: 'Escribe tu respuesta', qSkip: 'Omitir', qNext: 'Siguiente',
    qForge: 'Forjar mi prompt', qForging: 'Forjando…',
    rTitle: 'Tu prompt mejorado', rSubtitle: 'Listo para usar — copia y pega en cualquier lugar',
    rCopy: 'Copiar prompt', rCopied: '¡Copiado!',
    rBefore: 'antes', rAfter: 'después',
    rWhatImproved: 'Qué se mejoró', rOriginal: 'Original',
    rImproveAnother: 'Mejorar otro prompt', rEditAnswers: 'Editar respuestas', rNewPrompt: 'Nuevo prompt',
    sSettings: 'Ajustes', sProPlan: 'Plan Pro', sFreePlan: 'Plan gratuito',
    sUnlimited: 'Ilimitado · sin límites', sUpgrade: 'Actualizar a Pro', sManage: 'Gestionar',
    sTodaysUsage: 'Uso de hoy', sResetsAt: 'Se reinicia a medianoche',
    sLanguage: 'Idioma', sQuickMode: 'Modo rápido',
    sQuickModeDesc: 'Option+Space abre el panel flotante en cualquier lugar — escribe un prompt, responde preguntas y el resultado mejorado se pega automáticamente.',
    sSave: 'Guardar cambios', sSaved: '✓ Guardado',
    sResetApp: 'Restablecer app', sResetAppDesc: 'Vuelve a la pantalla de bienvenida', sReset: 'Restablecer',
    sLogout: 'Cerrar sesión', sLogoutDesc: 'Salir de tu cuenta',
    pmPerMonth: '/ mes · cancela cuando quieras', pmSubscribe: 'Suscribirse — $3/mes',
    pmFeatApi: 'API incluida', pmFeatApiDesc: 'Sin clave necesaria',
    pmFeatSync: 'Sincronización', pmFeatSyncDesc: 'Preferencias en todas partes',
    pmFeatModels: 'Modelos prioritarios', pmFeatModelsDesc: 'Niveles más rápidos',
    pmFeatUnlimited: 'Ilimitado', pmFeatUnlimitedDesc: 'Sin límites de velocidad',
    cmTitle: '¿Cancelar Pro?', cmDesc: 'Perderás el acceso al final de tu período de facturación.',
    cmYouLose: 'Perderás:', cmLose1: 'Prompts ilimitados → 5/día',
    cmLose2: 'Acceso a modelos prioritarios', cmLose3: 'Clave API incluida',
    cmCancel: 'Cancelar suscripción →', cmAlreadyCancelled: 'Ya cancelé — cambiar a gratuito', cmKeepPro: 'Mantener Pro',
  },
  de: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Verbessere deinen Prompt',
    homeSubtitle: 'Füge eine grobe Idee ein — PromptForge stellt smarte Fragen und verwandelt sie in etwas Präzises.',
    homePlaceholder: 'Beschreibe, was du bauen, schreiben oder erstellen möchtest…',
    homeShortcut: '⌘+Enter zum Verbessern',
    homeAnalyzing: 'Analysiere…',
    homeImprove: 'Verbessern',
    homeTryExample: 'Beispiel ausprobieren',
    homeWriteFirst: 'Schreib zuerst etwas.',
    catAuto: 'Auto', catCode: 'Code', catMail: 'E-Mail', catContent: 'Inhalt',
    catData: 'Daten', catImage: 'Bild', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Zurück', qQuestion: 'Frage',
    qChooseOne: 'Wähle eine · drücke 1–', qChooseMany: 'Wähle alle zutreffenden · drücke 1–',
    qTypeAnswer: 'Schreibe deine Antwort', qSkip: 'Überspringen', qNext: 'Weiter',
    qForge: 'Meinen Prompt schmieden', qForging: 'Schmieden…',
    rTitle: 'Dein verbesserter Prompt', rSubtitle: 'Bereit zur Verwendung — kopiere und füge ihn überall ein',
    rCopy: 'Prompt kopieren', rCopied: 'Kopiert!',
    rBefore: 'vorher', rAfter: 'nachher',
    rWhatImproved: 'Was verbessert wurde', rOriginal: 'Original',
    rImproveAnother: 'Weiteren Prompt verbessern', rEditAnswers: 'Antworten bearbeiten', rNewPrompt: 'Neuer Prompt',
    sSettings: 'Einstellungen', sProPlan: 'Pro-Plan', sFreePlan: 'Kostenloser Plan',
    sUnlimited: 'Unbegrenzt · keine Limits', sUpgrade: 'Auf Pro upgraden', sManage: 'Verwalten',
    sTodaysUsage: 'Heutige Nutzung', sResetsAt: 'Setzt um Mitternacht zurück',
    sLanguage: 'Sprache', sQuickMode: 'Schnellmodus',
    sQuickModeDesc: 'Option+Space öffnet das schwebende Overlay überall — tippe einen Prompt, beantworte Fragen und das Ergebnis wird automatisch eingefügt.',
    sSave: 'Änderungen speichern', sSaved: '✓ Gespeichert',
    sResetApp: 'App zurücksetzen', sResetAppDesc: 'Kehrt zum Willkommensbildschirm zurück', sReset: 'Zurücksetzen',
    sLogout: 'Abmelden', sLogoutDesc: 'Vom Konto abmelden',
    pmPerMonth: '/ Monat · jederzeit kündbar', pmSubscribe: 'Abonnieren — 3 $/Monat',
    pmFeatApi: 'API inklusive', pmFeatApiDesc: 'Kein Schlüssel nötig',
    pmFeatSync: 'Synchronisation', pmFeatSyncDesc: 'Einstellungen überall',
    pmFeatModels: 'Prioritätsmodelle', pmFeatModelsDesc: 'Schnellste Stufen',
    pmFeatUnlimited: 'Unbegrenzt', pmFeatUnlimitedDesc: 'Keine Ratenlimits',
    cmTitle: 'Pro kündigen?', cmDesc: 'Du verlierst den Zugriff am Ende deines Abrechnungszeitraums.',
    cmYouLose: 'Du verlierst:', cmLose1: 'Unbegrenzte Prompts → 5/Tag',
    cmLose2: 'Prioritätszugang zu Modellen', cmLose3: 'API-Schlüssel inklusive',
    cmCancel: 'Abonnement kündigen →', cmAlreadyCancelled: 'Bereits gekündigt — zu Free wechseln', cmKeepPro: 'Pro behalten',
  },
  fr: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Améliorez votre prompt',
    homeSubtitle: "Collez n'importe quelle idée — PromptForge pose quelques questions intelligentes et la transforme en quelque chose de précis.",
    homePlaceholder: 'Décrivez ce que vous voulez créer, écrire ou construire…',
    homeShortcut: '⌘+Entrée pour améliorer',
    homeAnalyzing: 'Analyse…',
    homeImprove: 'Améliorer',
    homeTryExample: 'Essayer un exemple',
    homeWriteFirst: "Écrivez quelque chose d'abord.",
    catAuto: 'Auto', catCode: 'Code', catMail: 'E-mail', catContent: 'Contenu',
    catData: 'Données', catImage: 'Image', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Retour', qQuestion: 'Question',
    qChooseOne: 'Choisissez une · appuyez sur 1–', qChooseMany: "Choisissez tout ce qui s'applique · appuyez sur 1–",
    qTypeAnswer: 'Tapez votre réponse', qSkip: 'Passer', qNext: 'Suivant',
    qForge: 'Forger mon prompt', qForging: 'Forge en cours…',
    rTitle: 'Votre prompt amélioré', rSubtitle: "Prêt à l'emploi — copiez et collez n'importe où",
    rCopy: 'Copier le prompt', rCopied: 'Copié !',
    rBefore: 'avant', rAfter: 'après',
    rWhatImproved: 'Ce qui a été amélioré', rOriginal: 'Original',
    rImproveAnother: 'Améliorer un autre prompt', rEditAnswers: 'Modifier les réponses', rNewPrompt: 'Nouveau prompt',
    sSettings: 'Paramètres', sProPlan: 'Plan Pro', sFreePlan: 'Plan gratuit',
    sUnlimited: 'Illimité · sans limites', sUpgrade: 'Passer à Pro', sManage: 'Gérer',
    sTodaysUsage: "Utilisation du jour", sResetsAt: 'Réinitialise à minuit',
    sLanguage: 'Langue', sQuickMode: 'Mode rapide',
    sQuickModeDesc: "Option+Espace ouvre le panneau flottant n'importe où — tapez un prompt, répondez aux questions et le résultat amélioré est automatiquement collé.",
    sSave: 'Enregistrer les modifications', sSaved: '✓ Enregistré',
    sResetApp: "Réinitialiser l'app", sResetAppDesc: "Retour à l'écran d'accueil", sReset: 'Réinitialiser',
    sLogout: 'Se déconnecter', sLogoutDesc: 'Quitter votre compte',
    pmPerMonth: '/ mois · annulable à tout moment', pmSubscribe: "S'abonner — 3 $/mois",
    pmFeatApi: 'API incluse', pmFeatApiDesc: 'Aucune clé requise',
    pmFeatSync: 'Synchronisation', pmFeatSyncDesc: 'Préférences partout',
    pmFeatModels: 'Modèles prioritaires', pmFeatModelsDesc: 'Niveaux les plus rapides',
    pmFeatUnlimited: 'Illimité', pmFeatUnlimitedDesc: 'Sans limites de débit',
    cmTitle: 'Annuler Pro ?', cmDesc: 'Vous perdrez accès à la fin de votre période de facturation.',
    cmYouLose: 'Vous perdrez :', cmLose1: 'Prompts illimités → 5/jour',
    cmLose2: 'Accès aux modèles prioritaires', cmLose3: 'Clé API incluse',
    cmCancel: "Annuler l'abonnement →", cmAlreadyCancelled: 'Déjà annulé — passer à gratuit', cmKeepPro: 'Garder Pro',
  },
  it: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Migliora il tuo prompt',
    homeSubtitle: 'Incolla qualsiasi idea — PromptForge farà alcune domande intelligenti e la trasformerà in qualcosa di preciso.',
    homePlaceholder: 'Descrivi cosa vuoi creare, scrivere o costruire…',
    homeShortcut: '⌘+Invio per migliorare',
    homeAnalyzing: 'Analizzando…',
    homeImprove: 'Migliora',
    homeTryExample: 'Prova un esempio',
    homeWriteFirst: 'Scrivi qualcosa prima.',
    catAuto: 'Auto', catCode: 'Codice', catMail: 'Email', catContent: 'Contenuto',
    catData: 'Dati', catImage: 'Immagine', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Indietro', qQuestion: 'Domanda',
    qChooseOne: 'Scegli una · premi 1–', qChooseMany: 'Scegli tutte le applicabili · premi 1–',
    qTypeAnswer: 'Scrivi la tua risposta', qSkip: 'Salta', qNext: 'Avanti',
    qForge: 'Forgia il mio prompt', qForging: 'Forgiando…',
    rTitle: 'Il tuo prompt migliorato', rSubtitle: 'Pronto — copia e incolla ovunque',
    rCopy: 'Copia prompt', rCopied: 'Copiato!',
    rBefore: 'prima', rAfter: 'dopo',
    rWhatImproved: 'Cosa è stato migliorato', rOriginal: 'Originale',
    rImproveAnother: 'Migliora un altro prompt', rEditAnswers: 'Modifica le risposte', rNewPrompt: 'Nuovo prompt',
    sSettings: 'Impostazioni', sProPlan: 'Piano Pro', sFreePlan: 'Piano gratuito',
    sUnlimited: 'Illimitato · nessun limite', sUpgrade: 'Aggiorna a Pro', sManage: 'Gestisci',
    sTodaysUsage: 'Utilizzo di oggi', sResetsAt: 'Si azzera a mezzanotte',
    sLanguage: 'Lingua', sQuickMode: 'Modalità rapida',
    sQuickModeDesc: 'Option+Spazio apre il pannello flottante ovunque — scrivi un prompt, rispondi alle domande e il risultato viene incollato automaticamente.',
    sSave: 'Salva modifiche', sSaved: '✓ Salvato',
    sResetApp: 'Reimposta app', sResetAppDesc: 'Torna alla schermata di benvenuto', sReset: 'Reimposta',
    sLogout: 'Disconnettiti', sLogoutDesc: 'Esci dal tuo account',
    pmPerMonth: '/ mese · annulla quando vuoi', pmSubscribe: 'Abbonati — $3/mese',
    pmFeatApi: 'API inclusa', pmFeatApiDesc: 'Nessuna chiave necessaria',
    pmFeatSync: 'Sincronizzazione', pmFeatSyncDesc: 'Preferenze ovunque',
    pmFeatModels: 'Modelli prioritari', pmFeatModelsDesc: 'Livelli più veloci',
    pmFeatUnlimited: 'Illimitato', pmFeatUnlimitedDesc: 'Nessun limite di velocità',
    cmTitle: 'Annullare Pro?', cmDesc: 'Perderai accesso al termine del periodo di fatturazione.',
    cmYouLose: 'Perderai:', cmLose1: 'Prompt illimitati → 5/giorno',
    cmLose2: 'Accesso ai modelli prioritari', cmLose3: 'Chiave API inclusa',
    cmCancel: 'Annulla abbonamento →', cmAlreadyCancelled: 'Già annullato — passa a gratuito', cmKeepPro: 'Mantieni Pro',
  },
  pt: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Melhore seu prompt',
    homeSubtitle: 'Cole qualquer ideia — PromptForge faz algumas perguntas inteligentes e a transforma em algo preciso.',
    homePlaceholder: 'Descreva o que você quer construir, escrever ou criar…',
    homeShortcut: '⌘+Enter para melhorar',
    homeAnalyzing: 'Analisando…',
    homeImprove: 'Melhorar',
    homeTryExample: 'Tente um exemplo',
    homeWriteFirst: 'Escreva algo primeiro.',
    catAuto: 'Auto', catCode: 'Código', catMail: 'E-mail', catContent: 'Conteúdo',
    catData: 'Dados', catImage: 'Imagem', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Voltar', qQuestion: 'Pergunta',
    qChooseOne: 'Escolha uma · pressione 1–', qChooseMany: 'Escolha todas que se aplicam · pressione 1–',
    qTypeAnswer: 'Digite sua resposta', qSkip: 'Pular', qNext: 'Próximo',
    qForge: 'Forjar meu prompt', qForging: 'Forjando…',
    rTitle: 'Seu prompt melhorado', rSubtitle: 'Pronto para usar — copie e cole em qualquer lugar',
    rCopy: 'Copiar prompt', rCopied: 'Copiado!',
    rBefore: 'antes', rAfter: 'depois',
    rWhatImproved: 'O que foi melhorado', rOriginal: 'Original',
    rImproveAnother: 'Melhorar outro prompt', rEditAnswers: 'Editar respostas', rNewPrompt: 'Novo prompt',
    sSettings: 'Configurações', sProPlan: 'Plano Pro', sFreePlan: 'Plano gratuito',
    sUnlimited: 'Ilimitado · sem limites', sUpgrade: 'Atualizar para Pro', sManage: 'Gerenciar',
    sTodaysUsage: 'Uso de hoje', sResetsAt: 'Reinicia à meia-noite',
    sLanguage: 'Idioma', sQuickMode: 'Modo rápido',
    sQuickModeDesc: 'Option+Espaço abre o painel flutuante em qualquer lugar — digite um prompt, responda perguntas e o resultado é colado automaticamente.',
    sSave: 'Salvar alterações', sSaved: '✓ Salvo',
    sResetApp: 'Redefinir app', sResetAppDesc: 'Retorna à tela de boas-vindas', sReset: 'Redefinir',
    sLogout: 'Sair', sLogoutDesc: 'Sair da sua conta',
    pmPerMonth: '/ mês · cancele quando quiser', pmSubscribe: 'Assinar — $3/mês',
    pmFeatApi: 'API incluída', pmFeatApiDesc: 'Sem necessidade de chave',
    pmFeatSync: 'Sincronização', pmFeatSyncDesc: 'Preferências em todo lugar',
    pmFeatModels: 'Modelos prioritários', pmFeatModelsDesc: 'Níveis mais rápidos',
    pmFeatUnlimited: 'Ilimitado', pmFeatUnlimitedDesc: 'Sem limites de taxa',
    cmTitle: 'Cancelar Pro?', cmDesc: 'Você perderá acesso no final do período de cobrança.',
    cmYouLose: 'Você perderá:', cmLose1: 'Prompts ilimitados → 5/dia',
    cmLose2: 'Acesso a modelos prioritários', cmLose3: 'Chave API incluída',
    cmCancel: 'Cancelar assinatura →', cmAlreadyCancelled: 'Já cancelado — mudar para gratuito', cmKeepPro: 'Manter Pro',
  },
  pl: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'Ulepsz swój prompt',
    homeSubtitle: 'Wklej dowolny pomysł — PromptForge zadaje kilka sprytnych pytań i przekształca go w coś precyzyjnego.',
    homePlaceholder: 'Opisz, co chcesz zbudować, napisać lub stworzyć…',
    homeShortcut: '⌘+Enter, aby ulepszyć',
    homeAnalyzing: 'Analizowanie…',
    homeImprove: 'Ulepsz',
    homeTryExample: 'Wypróbuj przykład',
    homeWriteFirst: 'Najpierw coś napisz.',
    catAuto: 'Auto', catCode: 'Kod', catMail: 'E-mail', catContent: 'Treść',
    catData: 'Dane', catImage: 'Obraz', catSeo: 'SEO', catChat: 'Chat',
    qBack: 'Wstecz', qQuestion: 'Pytanie',
    qChooseOne: 'Wybierz jedną · naciśnij 1–', qChooseMany: 'Wybierz wszystkie pasujące · naciśnij 1–',
    qTypeAnswer: 'Wpisz swoją odpowiedź', qSkip: 'Pomiń', qNext: 'Dalej',
    qForge: 'Wykuj mój prompt', qForging: 'Kucie…',
    rTitle: 'Twój ulepszony prompt', rSubtitle: 'Gotowy do użycia — skopiuj i wklej wszędzie',
    rCopy: 'Kopiuj prompt', rCopied: 'Skopiowano!',
    rBefore: 'przed', rAfter: 'po',
    rWhatImproved: 'Co zostało ulepszone', rOriginal: 'Oryginalny',
    rImproveAnother: 'Ulepsz kolejny prompt', rEditAnswers: 'Edytuj odpowiedzi', rNewPrompt: 'Nowy prompt',
    sSettings: 'Ustawienia', sProPlan: 'Plan Pro', sFreePlan: 'Plan darmowy',
    sUnlimited: 'Nieograniczony · bez limitów', sUpgrade: 'Przejdź na Pro', sManage: 'Zarządzaj',
    sTodaysUsage: 'Dzisiejsze użycie', sResetsAt: 'Resetuje się o północy',
    sLanguage: 'Język', sQuickMode: 'Tryb szybki',
    sQuickModeDesc: 'Option+Spacja otwiera nakładkę w dowolnym miejscu — wpisz prompt, odpowiedz na pytania, a ulepszony wynik zostanie automatycznie wklejony.',
    sSave: 'Zapisz zmiany', sSaved: '✓ Zapisano',
    sResetApp: 'Resetuj aplikację', sResetAppDesc: 'Powraca do ekranu powitalnego', sReset: 'Resetuj',
    sLogout: 'Wyloguj się', sLogoutDesc: 'Wyloguj z konta',
    pmPerMonth: '/ mies. · anuluj kiedy chcesz', pmSubscribe: 'Subskrybuj — $3/mies.',
    pmFeatApi: 'API w zestawie', pmFeatApiDesc: 'Bez potrzeby klucza',
    pmFeatSync: 'Synchronizacja', pmFeatSyncDesc: 'Preferencje wszędzie',
    pmFeatModels: 'Modele priorytetowe', pmFeatModelsDesc: 'Najszybsze poziomy',
    pmFeatUnlimited: 'Nieograniczone', pmFeatUnlimitedDesc: 'Bez limitów szybkości',
    cmTitle: 'Anulować Pro?', cmDesc: 'Utracisz dostęp po zakończeniu okresu rozliczeniowego.',
    cmYouLose: 'Stracisz:', cmLose1: 'Nieograniczone prompty → 5/dzień',
    cmLose2: 'Dostęp do modeli priorytetowych', cmLose3: 'Klucz API w zestawie',
    cmCancel: 'Anuluj subskrypcję →', cmAlreadyCancelled: 'Już anulowano — przejdź na Free', cmKeepPro: 'Zachowaj Pro',
  },
  ja: {
    modeLite: 'Lite',
    modeLiteDesc: 'Instant polish, no questions',
    modeStandard: 'Standard',
    modeStandardDesc: '3–5 targeted questions',
    modeExpert: 'Expert',
    modeExpertDesc: '6–10 deep questions',
    modeCompact: 'Compact',
    modeCompactDesc: 'Dense Chinese prompt, no questions; replies in your language',
    modeLabel: 'Mode',

    homeTitle: 'プロンプトを改善する',
    homeSubtitle: 'アイデアを貼り付けると、PromptForgeがいくつかの質問をして正確なプロンプトに変換します。',
    homePlaceholder: '作りたい、書きたい、または作成したいことを説明してください…',
    homeShortcut: '⌘+Enterで改善',
    homeAnalyzing: '分析中…',
    homeImprove: '改善する',
    homeTryExample: '例を試す',
    homeWriteFirst: 'まず何か入力してください。',
    catAuto: '自動', catCode: 'コード', catMail: 'メール', catContent: 'コンテンツ',
    catData: 'データ', catImage: '画像', catSeo: 'SEO', catChat: 'チャット',
    qBack: '戻る', qQuestion: '質問',
    qChooseOne: '1つを選択 · 1–を押す', qChooseMany: '当てはまるものをすべて選択 · 1–を押す',
    qTypeAnswer: '回答を入力', qSkip: 'スキップ', qNext: '次へ',
    qForge: 'プロンプトを鍛造する', qForging: '鍛造中…',
    rTitle: '改善されたプロンプト', rSubtitle: 'すぐに使えます — コピーしてどこでも貼り付けてください',
    rCopy: 'プロンプトをコピー', rCopied: 'コピーしました！',
    rBefore: '改善前', rAfter: '改善後',
    rWhatImproved: '改善点', rOriginal: 'オリジナル',
    rImproveAnother: '別のプロンプトを改善', rEditAnswers: '回答を編集', rNewPrompt: '新しいプロンプト',
    sSettings: '設定', sProPlan: 'Proプラン', sFreePlan: '無料プラン',
    sUnlimited: '無制限 · レート制限なし', sUpgrade: 'Proにアップグレード', sManage: '管理',
    sTodaysUsage: '本日の使用量', sResetsAt: '深夜にリセット',
    sLanguage: '言語', sQuickMode: 'クイックモード',
    sQuickModeDesc: 'Option+Spaceでどこでもフローティングオーバーレイを開く — プロンプトを入力し、質問に答えると改善された結果が自動的に貼り付けられます。',
    sSave: '変更を保存', sSaved: '✓ 保存しました',
    sResetApp: 'アプリをリセット', sResetAppDesc: 'ウェルカム画面に戻ります', sReset: 'リセット',
    sLogout: 'ログアウト', sLogoutDesc: 'アカウントからサインアウト',
    pmPerMonth: '/ 月 · いつでもキャンセル可能', pmSubscribe: '購読する — $3/月',
    pmFeatApi: 'API込み', pmFeatApiDesc: 'キー不要',
    pmFeatSync: '同期', pmFeatSyncDesc: 'どこでも設定を共有',
    pmFeatModels: '優先モデル', pmFeatModelsDesc: '最速の利用枠',
    pmFeatUnlimited: '無制限', pmFeatUnlimitedDesc: 'レート制限なし',
    cmTitle: 'Proをキャンセルしますか？', cmDesc: '請求期間の終わりにアクセスが失われます。',
    cmYouLose: '失うもの：', cmLose1: '無制限のプロンプト → 1日5回',
    cmLose2: '優先モデルへのアクセス', cmLose3: 'APIキー込み',
    cmCancel: 'サブスクリプションをキャンセル →', cmAlreadyCancelled: '既にキャンセル済み — 無料版に切り替え', cmKeepPro: 'Proを維持する',
  },
}

export function useT(language: string): T {
  const code = LANG_MAP[language] ?? 'en'
  return TRANSLATIONS[code]
}

/**
 * Detect the likely language of a text snippet.
 * Returns a language name matching the LANGUAGES array, or null if unsure.
 */
export function detectLanguage(text: string): string | null {
  if (text.trim().length < 4) return null

  const t = text.toLowerCase()

  // Japanese: hiragana or katakana present
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(t)) return '日本語'

  // Chinese: CJK ideographs (without Japanese kana)
  if (/[\u4e00-\u9fff]/.test(t) && !/[\u3040-\u30ff]/.test(t)) return '中文'

  // Czech: ř and ů are almost exclusively Czech
  if (/[řů]/.test(t)) return 'Čeština'

  // Polish: ł, ą, ę are the most distinctive
  if (/[łąę]/.test(t)) return 'Polski'

  // German: ä, ö, ü, ß
  if (/[äöüß]/.test(t)) return 'Deutsch'

  // Portuguese: ã, õ are unique
  if (/[ãõ]/.test(t)) return 'Português'

  // Spanish: ñ is unique
  if (/ñ/.test(t)) return 'Español'

  // French: œ, æ, à, â, ç, è, ê, î, ô, ù, û — need multiple hits to avoid false positives
  const frScore = (t.match(/[àâçèêîôùûœæ]/g) ?? []).length
  if (frScore >= 2) return 'Français'

  // Italian: common words as heuristic
  if (/\b(che|non|del|per|con|una|come|sono|questo)\b/.test(t)) return 'Italiano'

  // Czech without diacritics: common words
  if (/\b(udelej|napiš|napiš|vytvor|prosim|dekuji|ahoj|jak|nebo|takze|kdyz|protoze)\b/.test(t)) return 'Čeština'

  // Default: not detected (keep current)
  return null
}
