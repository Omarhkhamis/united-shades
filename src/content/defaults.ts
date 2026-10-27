/**
 * Default website content — extracted verbatim from the original static design.
 * It seeds the database and doubles as the shape used to validate dashboard saves:
 * every array here must keep at least one item (it is the template for new items).
 *
 * Inline markup in "rich" fields: **bold**, *emphasis*, and line breaks.
 */
const img = (name: string) => `/assets/img/${name}`;

export const defaultContent = {
  settings: {
    phone: "+966559889797",
    whatsapp: "966559889797",
    whatsappDisplay: "+966559889797",
    email: "info@uscompany.com.sa",
    address: "طريق الخرج، حي المصانع، الرياض، المملكة العربية السعودية",
    website: "https://uscompany.com.sa",
    instagram: "",
    x: "",
    snapchat: "",
    tiktok: "",
    linkedin: "",
  },

  seo: {
    siteUrl: "https://uscompany.com.sa",
    siteName: "المتحدة للمظلات | United Shades",
    title: "المتحدة للمظلات | مظلات وسواتر وبرجولات في الرياض",
    description:
      "المتحدة للمظلات منذ 2011: تصميم وتصنيع وتركيب مظلات السيارات، الهياكل النسيجية، السواتر، الخيام وبيوت الشعر والبرجولات في الرياض وكل مناطق المملكة. معاينة مجانية.",
    keywords: [
      "مظلات",
      "مظلات سيارات",
      "مظلات مواقف",
      "مظلات الرياض",
      "هياكل نسيجية",
      "سواتر",
      "سواتر حديد",
      "برجولات",
      "خيام",
      "بيوت شعر",
      "تظليل",
      "مظلات مدارس",
      "مظلات مساجد",
      "United Shades",
    ],
    shareTitle: "المتحدة للمظلات — أكثر من مجرد ظل",
    shareDescription: "حلول تظليل إنشائي للمشاريع التجارية والحكومية منذ 2011 — مظلات، سواتر، هياكل نسيجية وبرجولات. اطلب معاينة مجانية وعرض سعر عبر واتساب.",
    shareImage: img("og-image.jpg"),
    shareImageAlt: "المتحدة للمظلات — أكثر من مجرد ظل",
    xHandle: "",
    indexable: true,
  },

  hero: {
    location: "الرياض · المملكة العربية السعودية",
    titleLine: "أكثر من مجرد",
    shadeWord: "ظِلّ",
    lead: "نصمّم ونصنّع ونركّب حلول التظليل الإنشائي — من مواقف السيارات إلى الساحات الكبرى — بهياكل تتحدّى شمس المملكة وتدوم لسنوات.",
    ctaLabel: "اطلب عرض سعر",
    image: img("park-umbrella.webp"),
    imageAlt: "مظلة مخروطية نفّذتها المتحدة للمظلات في حديقة عامة",
    caption: "حديقة عامة — مظلة مخروطية",
  },

  ticker: {
    items: [
      "مظلات مواقف السيارات",
      "الهياكل النسيجية المعمارية",
      "الخيام وبيوت الشعر الملكية",
      "البرجولات والجلسات الخارجية",
      "السواتر والحواجز البصرية",
      "تظليل الساحات والمنشآت الكبرى",
      "الصيانة وإعادة التأهيل",
    ],
  },

  about: {
    eyebrow: "من نحن",
    title: "في قلب الرياض، وتحت شمسٍ تشتدّ كل عام، بدأت *المتحدة للمظلات.*",
    text: "تأسسنا عام 2011م، ونضم اليوم فريقاً من **54 كادراً بشرياً** و**31 معدة**، لنصنع الظل الذي يحمي ويحيي، والهياكل التي تدوم. نحن متخصّصون في تصميم وتصنيع وتركيب المظلات والسواتر وهياكل الحماية — من مواقف السيارات إلى الساحات الكبرى — ونخدم القطاعين التجاري والحكومي في الرياض وكل مناطق المملكة.",
    quote: "«خبرتنا في التفاصيل، وقوّتنا في الإتقان.»",
    imageA: img("kfsh-dammam-1.webp"),
    imageAAlt: "مظلات مواقف مستشفى الملك فهد بالدمام",
    imageB: img("nbu.webp"),
    imageBAlt: "مظلات مواقف جامعة الحدود الشمالية",
    visionTitle: "رؤيتنا",
    visionText: "المرجع الاستراتيجي الأول لحلول التظليل الإنشائي والتغطيات المتقدمة في السوق السعودي.",
    missionTitle: "رسالتنا",
    missionText:
      "تمكين المشاريع والمساحات من مواجهة التحديات المناخية بحلول تظليل متكاملة فائقة التحمّل، وعلاقات عمل قائمة على الأثر لا العقود.",
  },

  stats: {
    eyebrow: "أرقام وصلنا لها",
    title: "أرقامٌ تُروى بالإنجاز.",
    items: [
      { value: 400, plus: true, label: "مشروع تم تنفيذه" },
      { value: 100, plus: true, label: "عميل راضٍ" },
      { value: 15, plus: true, label: "سنوات خبرة" },
      { value: 54, plus: false, label: "كادر بشري متخصص" },
      { value: 31, plus: false, label: "معدة تشغيلية" },
    ],
  },

  services: {
    eyebrow: "خدماتنا",
    title: "حلول ظلٍّ تُلهم المستقبل.",
    items: [
      {
        image: img("kfsh-dammam-2.webp"),
        alt: "مظلات مواقف سيارات",
        title: "أنظمة مظلات مواقف السيارات",
        en: "Carport Solutions",
        text: "حلول تظليل هندسية متكاملة للمشاريع السكنية والتجارية والمجمعات الحكومية، بتصاميم متعددة (كابولي، معلّق، هرمي) بأعلى مواصفات مقاومة الرياح والعزل الحراري.",
      },
      {
        image: img("park-tent.webp"),
        alt: "هياكل نسيجية معمارية",
        title: "الهياكل النسيجية المعمارية",
        en: "Tensile Structures",
        text: "تصاميم حديثة تغطّي المساحات المفتوحة والمداخل الرئيسية، نعتمد فيها على أحدث برامج التحليل الإنشائي وأقمشة PTFE / PVDF.",
      },
      {
        image: img("tents.webp"),
        alt: "خيام وبيوت شعر",
        title: "الخيام وبيوت الشعر الملكية",
        en: "Tents & Traditional Pavilions",
        text: "خيام تراثية وبيوت شعر عصرية بأعلى معايير العزل المائي والحراري، مع تجهيز داخلي فاخر يلبّي متطلبات الاستراحات والقصور والمخيمات.",
      },
      {
        image: img("pergola.webp"),
        alt: "برجولات وجلسات خارجية",
        title: "البرجولات والجلسات الخارجية",
        en: "Pergolas & Outdoor Living",
        text: "مساحات جلوس خارجية تجمع بين الفخامة والظل، بتصاميم حديدية خشبية أو ألمنيوم أو خشب معالج تتكامل مع الحدائق والأسطح والفناءات.",
      },
      {
        image: img("screen-modern.webp"),
        alt: "سواتر حديد مودرن",
        title: "السواتر والحواجز البصرية",
        en: "Privacy Screens & Louvers",
        text: "حلول لتأمين الخصوصية والحماية المحيطية بخيارات متعددة (شرائح لوفر، مجدول، بلاستيك معالج، قص ليزر CNC) مقاومة للصدأ والعوامل الجوية.",
      },
      {
        image: img("mosque.webp"),
        alt: "تظليل ساحات المساجد",
        title: "تظليل الساحات والمنشآت الكبرى",
        en: "Large-Scale Shading",
        text: "تغطية الملاعب والمدارس وساحات المساجد والممشى العام بهياكل هندسية مدروسة تضمن التهوية ونفاذية الضوء والحماية القصوى من الأشعة.",
      },
      {
        image: img("jouf.webp"),
        alt: "صيانة المظلات",
        title: "الصيانة وإعادة التأهيل",
        en: "Maintenance & Refurbishment",
        text: "برنامج شامل لإطالة العمر التشغيلي: شدّ واستبدال الأقمشة، معالجة الهياكل المعدنية ضد التآكل، وعقود صيانة دورية للمشاريع الكبرى.",
      },
    ],
    ctaText: "مشروعك القادم\nيبدأ بمعاينة.",
    ctaButton: "احجز معاينة مجانية",
  },

  products: {
    eyebrow: "الأقسام",
    title: "منتجات بمواصفات *أعلى.*",
    tabs: [
      {
        label: "مظلات السيارات",
        items: [
          {
            image: img("kfsh-dammam-2.webp"),
            title: "مظلات كابولي",
            text: "",
            specs: [
              { label: "الهيكل", value: "حديد مجلفن مدهون حرارياً" },
              { label: "القماش", value: "PVC / HDPE معتمد" },
              { label: "الاستخدام", value: "المواقف التجارية والحكومية" },
            ],
          },
          {
            image: img("metro-2.webp"),
            title: "مظلات معلّقة (T)",
            text: "",
            specs: [
              { label: "الهيكل", value: "عمود مركزي بأذرع مزدوجة" },
              { label: "القماش", value: "PVC عازل للحرارة" },
              { label: "الاستخدام", value: "صفوف المواقف المزدوجة" },
            ],
          },
          {
            image: img("lg.webp"),
            title: "مظلات هرمية",
            text: "",
            specs: [
              { label: "الهيكل", value: "قطاعات معدنية بشدّ كابلات" },
              { label: "القماش", value: "PVC / PTFE" },
              { label: "الاستخدام", value: "الشركات والمعارض" },
            ],
          },
          {
            image: img("jouf.webp"),
            title: "مظلات مقوّسة",
            text: "",
            specs: [
              { label: "الهيكل", value: "أقواس معدنية متكررة" },
              { label: "القماش", value: "PVC عالي الشد" },
              { label: "الاستخدام", value: "الجامعات والممرات الطويلة" },
            ],
          },
        ],
      },
      {
        label: "السواتر",
        items: [
          {
            image: img("screen-horizontal.webp"),
            title: "سواتر شرائح أفقية",
            text: "شرائح أفقية توفر الخصوصية وتخفف أشعة الشمس مع السماح بمرور الهواء.",
            specs: [],
          },
          {
            image: img("screen-modern.webp"),
            title: "سواتر حديد مودرن",
            text: "قطاعات تيوبات حديد مدهونة حرارياً (Powder Coated) باللون البني أو الرمادي.",
            specs: [],
          },
          {
            image: img("screen-louver.webp"),
            title: "سواتر لوفر",
            text: "شرائح مفرغة جزئياً لمرور الهواء وتقليل حمل الرياح مع توفير الخصوصية.",
            specs: [],
          },
          {
            image: img("screen-wood.webp"),
            title: "خشب بلاستيكي معالج",
            text: "شرائح من بديل الخشب مقاومة للشمس والرطوبة بمظهر طبيعي دافئ.",
            specs: [],
          },
          {
            image: img("screen-laser.webp"),
            title: "حديد قص ليزر",
            text: "ألواح حديد مفرغة بالليزر توفر الخصوصية والظل مع تصاميم زخرفية متنوعة.",
            specs: [],
          },
        ],
      },
      {
        label: "الخيام والبرجولات",
        items: [
          {
            image: img("tents.webp"),
            title: "بيوت الشعر الملكية",
            text: "",
            specs: [
              { label: "العزل", value: "مائي وحراري عالي" },
              { label: "التجهيز", value: "داخلي فاخر حسب الطلب" },
              { label: "الاستخدام", value: "الاستراحات والقصور" },
            ],
          },
          {
            image: img("park-tent.webp"),
            title: "الخيام النسيجية",
            text: "",
            specs: [
              { label: "القماش", value: "PVC / PTFE معتمد" },
              { label: "التصميم", value: "قمم متعددة بشدّ إنشائي" },
              { label: "الاستخدام", value: "الفعاليات والمخيمات" },
            ],
          },
          {
            image: img("pergola.webp"),
            title: "البرجولات",
            text: "",
            specs: [
              { label: "الخامة", value: "حديد، ألمنيوم، خشب معالج" },
              { label: "التشطيب", value: "دهان حراري مقاوم" },
              { label: "الاستخدام", value: "الحدائق والأسطح" },
            ],
          },
          {
            image: img("park-umbrella.webp"),
            title: "مظلات الحدائق المخروطية",
            text: "",
            specs: [
              { label: "الهيكل", value: "عمود مركزي بأذرع شعاعية" },
              { label: "القماش", value: "PVC / HDPE" },
              { label: "الاستخدام", value: "الحدائق العامة والمنتزهات" },
            ],
          },
        ],
      },
    ],
    materialsTitle: "خامات تقنية معتمدة",
    materials: [
      { name: "PVC", text: "قماش مرن عالي الشدّ، عازل للماء ومقاوم للأشعة فوق البنفسجية." },
      { name: "PTFE", text: "قماش معماري فائق العمر الافتراضي، ذاتي التنظيف ومقاوم للحريق." },
      { name: "HDPE", text: "شبك مسامي يسمح بمرور الهواء ويخفض الحرارة تحت المظلة." },
    ],
  },

  shop: {
    eyebrow: "اطلب مظلتك",
    title: "اختر نوع المظلة، *واطلب عرض سعرك.*",
    text: "أسعار تقريبية للمتر — يتحدد السعر النهائي بعد المعاينة حسب المقاس والخامة وموقع التركيب.",
    unit: "ريال للمتر",
    fromLabel: "يبدأ من",
    buttonLabel: "أضف إلى السلة",
    waLabel: "أو اطلب عرض سعر عبر واتساب",
    messagePrefix: "أريد عرض سعر لمظلة",
    items: [
      { image: img("kfsh-dammam-2.webp"), alt: "مظلات كابولي لمواقف السيارات", title: "مظلات كابولي", type: "كابولي", priceFrom: 180 },
      { image: img("lg.webp"), alt: "مظلات هرمية لمواقف السيارات", title: "مظلات هرمية", type: "هرمية", priceFrom: 120 },
      { image: img("jouf.webp"), alt: "مظلات مقوّسة لمواقف السيارات", title: "مظلات مقوّسة", type: "مقوّسة", priceFrom: 150 },
      { image: img("metro-2.webp"), alt: "مظلات معلّقة على شكل حرف T", title: "مظلات معلّقة (T)", type: "معلّقة (T)", priceFrom: 180 },
    ],
  },

  clients: {
    eyebrow: "علامات اشتغلنا معها",
    title: "ثقةُ كبرى الجهات في المملكة.",
    row1: [
      { image: img("clients/c1.jpg"), name: "وزارة الداخلية" },
      { image: img("clients/c2.jpg"), name: "وزارة البلديات والإسكان" },
      { image: img("clients/c3.jpg"), name: "القوات الجوية الملكية السعودية" },
      { image: img("clients/c4.jpg"), name: "وزارة الدفاع" },
      { image: img("clients/c5.jpg"), name: "السعودية للطاقة" },
      { image: img("clients/c6.jpg"), name: "حرس الحدود" },
      { image: img("clients/c7.jpg"), name: "وزارة الصحة" },
      { image: img("clients/c8.jpg"), name: "هيئة الهلال الأحمر السعودي" },
    ],
    row2: [
      { image: img("clients/c10.jpg"), name: "أمانة منطقة الجوف" },
      { image: img("clients/c11.jpg"), name: "مستشفى الملك فهد التخصصي بالدمام" },
      { image: img("clients/c12.jpg"), name: "مستشفى الملك خالد التخصصي للعيون" },
      { image: img("clients/c13.jpg"), name: "قطار الرياض" },
      { image: img("clients/c15.jpg"), name: "وزارة الموارد البشرية والتنمية الاجتماعية" },
      { image: img("clients/c16.jpg"), name: "وزارة التعليم" },
    ],
  },

  why: {
    eyebrow: "لماذا المتحدة؟",
    title: "مع المتحدة، أنت لا تختار مظلة فقط — بل تختار *شريكاً* يهتم بكل تفصيل.",
    text: "نبدأ كل مشروع بفهم احتياج العميل وطبيعة الموقع، ثم نقترح الحل الأنسب من حيث الشكل والمتانة والاستخدام. ومن مرحلة القياس وحتى التركيب النهائي، نحرص أن تكون التفاصيل واضحة والتنفيذ دقيقاً.",
    image: img("kkesh.webp"),
    imageAlt: "مظلات مواقف مستشفى الملك خالد للعيون",
    features: [
      { title: "خبرة عملية", text: "حلول مناسبة للمنازل والشركات والمواقف والحدائق والاستراحات منذ 2011." },
      { title: "جودة المواد", text: "خامات مختارة لتحمّل الشمس والظروف المناخية القاسية من موردين عالميين." },
      { title: "تصميم مناسب للموقع", text: "كل مشروع يُصمَّم حسب المساحة والاستخدام بدراسة إنشائية دقيقة." },
      { title: "تنفيذ دقيق", text: "قياسات واضحة، تصنيع منظم، وتركيب باحترافية بأيدي فنيين متخصصين." },
      { title: "التزام بالمواعيد", text: "وضوح في مراحل العمل وتسليم حسب الاتفاق دون مفاجآت." },
      { title: "دعم بعد التنفيذ", text: "متابعة واهتمام لضمان رضا العميل، وعقود صيانة دورية للمشاريع الكبرى." },
    ],
  },

  gallery: {
    eyebrow: "معرض الأعمال",
    title: "أعمال نفّذناها بعناية… لتبقى أثراً يُرى كل يوم.",
    items: [
      { image: img("park-umbrella.webp"), alt: "حديقة عامة", title: "حديقة عامة", subtitle: "مظلة مخروطية", category: "public", tall: true },
      { image: img("lg.webp"), alt: "شركة LG", title: "شركة LG", subtitle: "مظلات مواقف", category: "parking", tall: true },
      { image: img("mosque.webp"), alt: "مسجد حي الرمال", title: "مسجد حي الرمال", subtitle: "تظليل ساحات", category: "public", tall: true },
      { image: img("park-tent.webp"), alt: "حديقة عامة", title: "حديقة عامة", subtitle: "هيكل نسيجي", category: "public", tall: false },
      { image: img("kkesh.webp"), alt: "مستشفى الملك خالد للعيون", title: "مستشفى الملك خالد للعيون", subtitle: "الرياض", category: "health", tall: false },
      { image: img("kfsh-dammam-1.webp"), alt: "مستشفى الملك فهد بالدمام", title: "مستشفى الملك فهد", subtitle: "الدمام · مظلات مواقف", category: "health", tall: true },
      { image: img("metro-2.webp"), alt: "موقف مترو الرياض", title: "موقف مترو الرياض", subtitle: "مظلات معلّقة", category: "parking", tall: true },
      { image: img("metro-1.webp"), alt: "موقف مترو الرياض", title: "موقف مترو الرياض", subtitle: "مشروع قطار الرياض", category: "parking", tall: true },
      { image: img("kfsh-dammam-2.webp"), alt: "مستشفى الملك فهد بالدمام", title: "مستشفى الملك فهد", subtitle: "الدمام", category: "parking", tall: false },
      { image: img("jouf.webp"), alt: "مواقف أمانة منطقة الجوف", title: "مواقف أمانة الجوف", subtitle: "الجوف", category: "parking", tall: false },
    ],
  },

  projects: {
    title: "من مشاريعنا المنجزة",
    items: [
      { name: "مشروع قطار الرياض", type: "مظلات مواقف", location: "الرياض" },
      { name: "وزارة الدفاع — مكتب الوزير", type: "مظلات مواقف", location: "الرياض" },
      { name: "حرس الحدود", type: "صيانة منشآت", location: "جازان · القنفذة · تبوك · القريات" },
      { name: "أمانة الجوف", type: "مظلات ومنتزهات", location: "الجوف" },
      { name: "مستشفى الملك خالد", type: "مظلات مواقف", location: "الرياض" },
      { name: "مدارس التعليم", type: "مظلات مدارس", location: "مواقع متعددة" },
      { name: "مستشفى الملك فهد التخصصي", type: "مظلات مواقف", location: "الدمام" },
      { name: "قاعدة الرياض الجوية", type: "مظلات مواقف", location: "الرياض" },
      { name: "منتزه قارا العالمي", type: "مظلات مواقف", location: "الجوف" },
      { name: "شركة الكهرباء", type: "مظلات مواقف", location: "عنيزة · بريدة · وادي الدواسر" },
    ],
  },

  quality: {
    eyebrow: "سياسة الجودة والسلامة",
    title: "الجودة ليست مرحلة تفتيش، بل نهجٌ يحكم كل التفاصيل.",
    items: [
      { icon: "ruler", title: "معايير قياسية صارمة", text: "خامات مطابقة للمواصفات القياسية السعودية." },
      { icon: "gear", title: "دقة التنفيذ الهندسي", text: "أحدث تقنيات التصنيع والتركيب لسلامة الهياكل." },
      { icon: "shield", title: "السلامة أولاً (HSE)", text: "الصحة والسلامة والبيئة في صميم كل موقع عمل." },
      { icon: "up", title: "التطوير والتحسين", text: "مراجعة دورية لإجراءاتنا ورفع الكفاءة باستمرار." },
      { icon: "hand", title: "الموثوقية والوفاء", text: "التزام تام بالجداول الزمنية والمواصفات المتفق عليها." },
    ],
    partnersLabel: "شركاؤنا الموردون",
    partners: [
      { image: img("partners/obeikan.png"), name: "العبيكان" },
      { image: img("partners/mehler.svg"), name: "Mehler Heytex" },
      { image: img("partners/sioen.svg"), name: "SIOEN" },
      { image: img("partners/jazeera.svg"), name: "دهانات الجزيرة" },
      { image: img("partners/jotun.svg"), name: "Jotun" },
      { image: img("partners/sabic.svg"), name: "سابك" },
    ],
  },

  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات قبل أن تسأل.",
    text: "لم تجد سؤالك؟ فريقنا جاهز للرد عبر واتساب خلال ساعات العمل.",
    buttonLabel: "اسألنا مباشرة",
    items: [
      {
        question: "هل أحتاج ترخيص بلدية لتركيب المظلات؟",
        answer:
          "يعتمد ذلك على نوع العقار وموقع المظلة ومساحتها. المظلات داخل حدود العقار السكني غالباً لا تتطلب إجراءات معقدة، أما المظلات التجارية أو المطلة على الشارع فقد تحتاج تصريحاً من البلدية. نساعدك في توضيح المتطلبات وتجهيز المخططات اللازمة.",
      },
      {
        question: "كم تستغرق مدة التنفيذ؟",
        answer:
          "المشاريع السكنية الصغيرة تُنفَّذ عادةً خلال أيام قليلة بعد اعتماد التصميم، بينما تختلف مدة المشاريع الكبرى حسب الحجم وتُحدد بجدول زمني واضح في العقد.",
      },
      {
        question: "ما الفرق بين قماش PVC و HDPE و PTFE؟",
        answer:
          "PVC قماش مصمت عازل للماء ومثالي لمواقف السيارات، HDPE شبك مسامي يسمح بمرور الهواء ويخفض الحرارة، وPTFE قماش معماري فاخر بعمر افتراضي طويل يُستخدم في الهياكل الكبرى.",
      },
      {
        question: "هل تقدمون ضماناً على الأعمال؟",
        answer: "نعم، نقدم ضماناً على الهيكل والقماش والتركيب، وتختلف مدته حسب نوع الخامة المختارة، ويُوضّح كتابياً ضمن عرض السعر.",
      },
      {
        question: "هل المعاينة ورفع المقاسات مجانية؟",
        answer: "نعم، يزور فريقنا الموقع لرفع المقاسات واقتراح الحل الأنسب داخل الرياض دون أي التزام.",
      },
      {
        question: "هل يمكن التقسيط عبر تابي أو تمارا؟",
        answer: "نعم، يمكنك تقسيط قيمة مشروعك عبر تابي أو تمارا. تواصل معنا على واتساب وسنرسل لك رابط الدفع مباشرة.",
      },
      {
        question: "هل تعملون خارج الرياض؟",
        answer: "بالتأكيد، نفّذنا مشاريع في الدمام، الجوف، عرعر، أبها، بيشة، جازان، تبوك وغيرها — ونخدم جميع مناطق المملكة.",
      },
    ],
  },

  cta: {
    title: "جاهز تبني مساحتك القادمة؟",
    text: "احصل على معاينة مجانية وعرض سعر مفصّل — وقسّط مشروعك بسهولة.",
    buttonLabel: "اطلب عرض سعر",
    quoteMessage: "السلام عليكم، أرغب بعرض سعر",
    bnplTitle: "قسّط مشروعك",
    bnplNote: "الدفع عبر واتساب",
    tabbyMessage: "السلام عليكم، أرغب بالدفع عبر تابي",
    tamaraMessage: "السلام عليكم، أرغب بالدفع عبر تمارا",
  },

  contact: {
    eyebrow: "اتصل بنا",
    title: "نبني مساحات أفضل للحياة.",
    formTitle: "اطلب عرض سعر",
    formHint: "املأ البيانات وسنكمل المحادثة معك على واتساب.",
    serviceOptions: ["مظلات سيارات", "هياكل نسيجية", "خيام وبيوت شعر", "برجولات وجلسات خارجية", "سواتر", "صيانة", "أخرى"],
    submitLabel: "إرسال عبر واتساب",
    whatsappIntro: "السلام عليكم، أرغب بعرض سعر من المتحدة للمظلات",
  },

  footer: {
    brandText: "أكثر من مجرد ظل. حلول تظليل إنشائي منذ 2011 في الرياض وكل مناطق المملكة.",
    services: ["مظلات السيارات", "الهياكل النسيجية", "الخيام وبيوت الشعر", "السواتر", "الصيانة"],
  },
};

export type SiteContent = typeof defaultContent;
export type SectionKey = keyof SiteContent;
export const sectionKeys = Object.keys(defaultContent) as SectionKey[];

export const galleryFilters = [
  { value: "all", label: "الكل" },
  { value: "parking", label: "مواقف" },
  { value: "public", label: "حدائق وساحات" },
  { value: "health", label: "مستشفيات" },
] as const;

export const qualityIcons = [
  { value: "ruler", label: "مسطرة" },
  { value: "gear", label: "ترس" },
  { value: "shield", label: "درع" },
  { value: "up", label: "سهم للأعلى" },
  { value: "hand", label: "مصافحة" },
  { value: "eye", label: "عين" },
  { value: "target", label: "هدف" },
] as const;
