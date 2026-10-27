/**
 * What the dashboard lets the team edit, section by section.
 * Field names map 1:1 onto the keys in `defaults.ts`.
 */
import { galleryFilters, qualityIcons, type SectionKey } from "./defaults";

type Option = { readonly value: string; readonly label: string };

export type Field =
  | { kind: "text" | "textarea" | "rich" | "image" | "number" | "boolean" | "url"; name: string; label: string; hint?: string; wide?: boolean; recommended?: number }
  | { kind: "sharePreview"; name: string; label: string; hint?: string }
  | { kind: "select"; name: string; label: string; options: readonly Option[]; hint?: string }
  | { kind: "strings"; name: string; label: string; itemLabel: string; hint?: string }
  | { kind: "list"; name: string; label: string; itemLabel: string; titleKey?: string; fields: Field[]; hint?: string };

export type SectionSchema = {
  key: SectionKey;
  title: string;
  description: string;
  icon: string;
  anchor?: string;
  groups: { title: string; fields: Field[] }[];
};

const RICH_HINT = "لتمييز كلمة باللون البرتقالي ضعها بين نجمتين *هكذا*، وللخط العريض **هكذا**.";
const IMAGE_ALT = "وصف الصورة (يظهر لمحركات البحث وقارئات الشاشة)";

const eyebrowTitle = (titleHint?: string): Field[] => [
  { kind: "text", name: "eyebrow", label: "العنوان الصغير" },
  { kind: "rich", name: "title", label: "العنوان الرئيسي", hint: titleHint ?? RICH_HINT },
];

const logoList = (name: string, label: string): Field => ({
  kind: "list",
  name,
  label,
  itemLabel: "شعار",
  titleKey: "name",
  fields: [
    { kind: "image", name: "image", label: "الشعار" },
    { kind: "text", name: "name", label: "اسم الجهة" },
  ],
});

export const editorSchema: SectionSchema[] = [
  {
    key: "settings",
    title: "الإعدادات العامة",
    description: "بيانات التواصل وروابط التواصل الاجتماعي وعنوان الموقع — تُستخدم في كل أجزاء الموقع.",
    icon: "settings",
    groups: [
      {
        title: "بيانات التواصل",
        fields: [
          { kind: "text", name: "phone", label: "رقم الهاتف" },
          { kind: "text", name: "whatsapp", label: "رقم واتساب (بالصيغة الدولية بدون + )", hint: "مثال: 966559889797 — تُبنى منه كل أزرار واتساب في الموقع." },
          { kind: "text", name: "whatsappDisplay", label: "رقم الجوال كما يظهر للزائر" },
          { kind: "text", name: "email", label: "البريد الإلكتروني" },
          { kind: "text", name: "address", label: "العنوان" },
          { kind: "url", name: "website", label: "رابط الموقع الرسمي" },
        ],
      },
      {
        title: "التواصل الاجتماعي",
        fields: [
          { kind: "url", name: "instagram", label: "إنستغرام", hint: "اترك الرابط فارغاً لإخفاء الأيقونة من الموقع." },
          { kind: "url", name: "x", label: "إكس (تويتر)" },
          { kind: "url", name: "snapchat", label: "سناب شات" },
          { kind: "url", name: "tiktok", label: "تيك توك" },
          { kind: "url", name: "linkedin", label: "لينكدإن" },
        ],
      },
    ],
  },
  {
    key: "seo",
    title: "SEO والمشاركة",
    description: "كيف يظهر الموقع في جوجل، وشكل الرابط عند مشاركته على واتساب وتويتر وفيسبوك.",
    icon: "seo",
    groups: [
      {
        title: "معاينة المشاركة",
        fields: [{ kind: "sharePreview", name: "_preview", label: "هكذا يظهر الرابط عند إرساله على واتساب" }],
      },
      {
        title: "محركات البحث (جوجل)",
        fields: [
          { kind: "text", name: "title", label: "عنوان الصفحة", hint: "يظهر في نتائج جوجل وتبويب المتصفح.", wide: true, recommended: 60 },
          { kind: "textarea", name: "description", label: "وصف الصفحة", hint: "النص الذي يظهر تحت العنوان في نتائج البحث.", wide: true, recommended: 160 },
          { kind: "strings", name: "keywords", label: "الكلمات المفتاحية", itemLabel: "كلمة" },
          { kind: "boolean", name: "indexable", label: "السماح لمحركات البحث بأرشفة الموقع", hint: "أوقفه فقط إذا أردت إخفاء الموقع من جوجل مؤقتاً." },
        ],
      },
      {
        title: "المشاركة على واتساب ووسائل التواصل",
        fields: [
          { kind: "image", name: "shareImage", label: "صورة المشاركة", hint: "المقاس المثالي 1200 × 630 بكسل، وبحجم أقل من 600 كيلوبايت حتى تظهر في واتساب." },
          { kind: "text", name: "shareImageAlt", label: "وصف صورة المشاركة", wide: true },
          { kind: "text", name: "shareTitle", label: "عنوان المشاركة", hint: "اتركه فارغاً لاستخدام عنوان الصفحة.", wide: true, recommended: 60 },
          { kind: "textarea", name: "shareDescription", label: "وصف المشاركة", hint: "اتركه فارغاً لاستخدام وصف الصفحة.", wide: true, recommended: 200 },
        ],
      },
      {
        title: "إعدادات متقدمة",
        fields: [
          { kind: "url", name: "siteUrl", label: "رابط الموقع الأساسي", hint: "النطاق الذي سيُنشر عليه الموقع — ضروري لظهور صورة المشاركة." },
          { kind: "text", name: "siteName", label: "اسم الموقع" },
          { kind: "text", name: "xHandle", label: "حساب إكس (اختياري)", hint: "مثال: @unitedshades" },
        ],
      },
    ],
  },
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "أول ما يراه الزائر: العنوان الكبير والصورة وزر طلب عرض السعر.",
    icon: "home",
    anchor: "home",
    groups: [
      {
        title: "النصوص",
        fields: [
          { kind: "text", name: "titleLine", label: "السطر الأول من العنوان" },
          { kind: "text", name: "shadeWord", label: "الكلمة الكبيرة (مع الظل)" },
          { kind: "textarea", name: "lead", label: "الوصف تحت العنوان", wide: true },
          { kind: "text", name: "ctaLabel", label: "نص الزر" },
          { kind: "text", name: "location", label: "سطر الموقع أعلى الواجهة" },
        ],
      },
      {
        title: "الصورة",
        fields: [
          { kind: "image", name: "image", label: "صورة الواجهة", hint: "الرسم الهندسي فوق الصورة مصمّم على الصورة الحالية؛ يفضّل صورة عمودية لمظلة مشابهة." },
          { kind: "text", name: "imageAlt", label: IMAGE_ALT },
          { kind: "text", name: "caption", label: "التعليق أسفل الصورة" },
        ],
      },
    ],
  },
  {
    key: "ticker",
    title: "الشريط المتحرك",
    description: "الشريط البرتقالي المتحرك أسفل الواجهة.",
    icon: "ticker",
    groups: [{ title: "العبارات", fields: [{ kind: "strings", name: "items", label: "عبارات الشريط", itemLabel: "عبارة" }] }],
  },
  {
    key: "about",
    title: "من نحن",
    description: "نبذة عن الشركة والرؤية والرسالة.",
    icon: "about",
    anchor: "about",
    groups: [
      {
        title: "النبذة",
        fields: [
          ...eyebrowTitle(),
          { kind: "rich", name: "text", label: "النص التعريفي", hint: RICH_HINT, wide: true },
          { kind: "text", name: "quote", label: "الاقتباس", wide: true },
        ],
      },
      {
        title: "الرؤية والرسالة",
        fields: [
          { kind: "text", name: "visionTitle", label: "عنوان الرؤية" },
          { kind: "textarea", name: "visionText", label: "نص الرؤية" },
          { kind: "text", name: "missionTitle", label: "عنوان الرسالة" },
          { kind: "textarea", name: "missionText", label: "نص الرسالة" },
        ],
      },
      {
        title: "الصور",
        fields: [
          { kind: "image", name: "imageA", label: "الصورة الكبيرة" },
          { kind: "text", name: "imageAAlt", label: IMAGE_ALT },
          { kind: "image", name: "imageB", label: "الصورة الصغيرة" },
          { kind: "text", name: "imageBAlt", label: IMAGE_ALT },
        ],
      },
    ],
  },
  {
    key: "stats",
    title: "الأرقام",
    description: "عدادات الإنجازات في الشريط الداكن.",
    icon: "stats",
    groups: [
      {
        title: "المحتوى",
        fields: [
          ...eyebrowTitle(),
          {
            kind: "list",
            name: "items",
            label: "الأرقام",
            itemLabel: "رقم",
            titleKey: "label",
            fields: [
              { kind: "number", name: "value", label: "الرقم" },
              { kind: "text", name: "label", label: "الوصف" },
              { kind: "boolean", name: "plus", label: "إظهار علامة +" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "الخدمات",
    description: "بطاقات الخدمات التي تتحرك أفقياً.",
    icon: "services",
    anchor: "services",
    groups: [
      { title: "العنوان", fields: eyebrowTitle() },
      {
        title: "الخدمات",
        fields: [
          {
            kind: "list",
            name: "items",
            label: "الخدمات",
            itemLabel: "خدمة",
            titleKey: "title",
            fields: [
              { kind: "image", name: "image", label: "الصورة" },
              { kind: "text", name: "title", label: "اسم الخدمة" },
              { kind: "text", name: "en", label: "الاسم بالإنجليزية" },
              { kind: "textarea", name: "text", label: "الوصف", wide: true },
              { kind: "text", name: "alt", label: IMAGE_ALT },
            ],
          },
        ],
      },
      {
        title: "البطاقة الأخيرة",
        fields: [
          { kind: "rich", name: "ctaText", label: "النص", hint: "يمكنك كتابة سطرين بالضغط على Enter." },
          { kind: "text", name: "ctaButton", label: "نص الزر" },
        ],
      },
    ],
  },
  {
    key: "products",
    title: "الأقسام والمنتجات",
    description: "تبويبات المنتجات ومواصفاتها والخامات المعتمدة.",
    icon: "products",
    anchor: "sections",
    groups: [
      { title: "العنوان", fields: eyebrowTitle() },
      {
        title: "التبويبات",
        fields: [
          {
            kind: "list",
            name: "tabs",
            label: "التبويبات",
            itemLabel: "تبويب",
            titleKey: "label",
            fields: [
              { kind: "text", name: "label", label: "اسم التبويب" },
              {
                kind: "list",
                name: "items",
                label: "المنتجات",
                itemLabel: "منتج",
                titleKey: "title",
                fields: [
                  { kind: "image", name: "image", label: "الصورة" },
                  { kind: "text", name: "title", label: "اسم المنتج" },
                  { kind: "textarea", name: "text", label: "وصف قصير", hint: "يظهر فقط إذا لم تُضف مواصفات.", wide: true },
                  {
                    kind: "list",
                    name: "specs",
                    label: "المواصفات",
                    itemLabel: "مواصفة",
                    titleKey: "label",
                    fields: [
                      { kind: "text", name: "label", label: "البند" },
                      { kind: "text", name: "value", label: "القيمة" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "الخامات",
        fields: [
          { kind: "text", name: "materialsTitle", label: "عنوان الخامات" },
          {
            kind: "list",
            name: "materials",
            label: "الخامات",
            itemLabel: "خامة",
            titleKey: "name",
            fields: [
              { kind: "text", name: "name", label: "اسم الخامة" },
              { kind: "textarea", name: "text", label: "الوصف" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "shop",
    title: "الأسعار والطلب",
    description: "بطاقات أنواع المظلات بأسعارها التقريبية وزر الطلب عبر واتساب.",
    icon: "shop",
    anchor: "shop",
    groups: [
      {
        title: "العنوان",
        fields: [...eyebrowTitle(), { kind: "textarea", name: "text", label: "النص تحت العنوان", wide: true }],
      },
      {
        title: "المنتجات",
        fields: [
          {
            kind: "list",
            name: "items",
            label: "أنواع المظلات",
            itemLabel: "منتج",
            titleKey: "title",
            fields: [
              { kind: "image", name: "image", label: "الصورة" },
              { kind: "text", name: "title", label: "اسم المنتج" },
              { kind: "text", name: "type", label: "النوع في رسالة واتساب", hint: "يُكمل جملة «أريد عرض سعر لمظلة …» — مثال: كابولي" },
              { kind: "number", name: "priceFrom", label: "السعر يبدأ من (ريال)" },
              { kind: "text", name: "alt", label: IMAGE_ALT },
            ],
          },
        ],
      },
      {
        title: "النصوص الثابتة",
        fields: [
          { kind: "text", name: "unit", label: "وحدة السعر" },
          { kind: "text", name: "fromLabel", label: "النص فوق السعر" },
          { kind: "text", name: "buttonLabel", label: "نص زر الإضافة إلى السلة" },
          { kind: "text", name: "waLabel", label: "نص رابط واتساب تحت الزر", hint: "اتركه فارغاً لإخفاء الرابط." },
          { kind: "text", name: "messagePrefix", label: "بداية رسالة واتساب", hint: "يُضاف بعدها نوع المظلة تلقائياً.", wide: true },
        ],
      },
    ],
  },
  {
    key: "clients",
    title: "العملاء",
    description: "شعارات الجهات المتحركة في صفّين.",
    icon: "clients",
    anchor: "clients",
    groups: [
      { title: "العنوان", fields: eyebrowTitle() },
      { title: "الصف الأول", fields: [logoList("row1", "شعارات الصف الأول")] },
      { title: "الصف الثاني", fields: [logoList("row2", "شعارات الصف الثاني")] },
    ],
  },
  {
    key: "why",
    title: "لماذا المتحدة؟",
    description: "مميزات الشركة في القسم الداكن.",
    icon: "why",
    anchor: "why",
    groups: [
      {
        title: "المقدمة",
        fields: [
          ...eyebrowTitle(),
          { kind: "textarea", name: "text", label: "النص", wide: true },
          { kind: "image", name: "image", label: "الصورة" },
          { kind: "text", name: "imageAlt", label: IMAGE_ALT },
        ],
      },
      {
        title: "المميزات",
        fields: [
          {
            kind: "list",
            name: "features",
            label: "المميزات",
            itemLabel: "ميزة",
            titleKey: "title",
            fields: [
              { kind: "text", name: "title", label: "العنوان" },
              { kind: "textarea", name: "text", label: "الوصف" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "gallery",
    title: "معرض الأعمال",
    description: "صور المشاريع مع التصنيف.",
    icon: "gallery",
    anchor: "gallery",
    groups: [
      { title: "العنوان", fields: eyebrowTitle() },
      {
        title: "الأعمال",
        fields: [
          {
            kind: "list",
            name: "items",
            label: "صور الأعمال",
            itemLabel: "عمل",
            titleKey: "title",
            fields: [
              { kind: "image", name: "image", label: "الصورة" },
              { kind: "text", name: "title", label: "اسم المشروع" },
              { kind: "text", name: "subtitle", label: "الوصف المختصر" },
              { kind: "select", name: "category", label: "التصنيف", options: galleryFilters.filter((f) => f.value !== "all") },
              { kind: "boolean", name: "tall", label: "بطاقة طويلة" },
              { kind: "text", name: "alt", label: IMAGE_ALT },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "projects",
    title: "المشاريع المنجزة",
    description: "قائمة المشاريع أسفل معرض الأعمال.",
    icon: "projects",
    anchor: "gallery",
    groups: [
      {
        title: "القائمة",
        fields: [
          { kind: "text", name: "title", label: "العنوان" },
          {
            kind: "list",
            name: "items",
            label: "المشاريع",
            itemLabel: "مشروع",
            titleKey: "name",
            fields: [
              { kind: "text", name: "name", label: "اسم المشروع" },
              { kind: "text", name: "type", label: "نوع العمل" },
              { kind: "text", name: "location", label: "الموقع" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "quality",
    title: "الجودة والشركاء",
    description: "سياسة الجودة وشعارات الموردين.",
    icon: "quality",
    groups: [
      {
        title: "سياسة الجودة",
        fields: [
          ...eyebrowTitle(),
          {
            kind: "list",
            name: "items",
            label: "البنود",
            itemLabel: "بند",
            titleKey: "title",
            fields: [
              { kind: "select", name: "icon", label: "الأيقونة", options: qualityIcons },
              { kind: "text", name: "title", label: "العنوان" },
              { kind: "textarea", name: "text", label: "الوصف" },
            ],
          },
        ],
      },
      {
        title: "الموردون",
        fields: [{ kind: "text", name: "partnersLabel", label: "العنوان" }, logoList("partners", "شعارات الموردين")],
      },
    ],
  },
  {
    key: "faq",
    title: "الأسئلة الشائعة",
    description: "الأسئلة وإجاباتها.",
    icon: "faq",
    anchor: "faq",
    groups: [
      {
        title: "المقدمة",
        fields: [...eyebrowTitle(), { kind: "textarea", name: "text", label: "النص" }, { kind: "text", name: "buttonLabel", label: "نص الزر" }],
      },
      {
        title: "الأسئلة",
        fields: [
          {
            kind: "list",
            name: "items",
            label: "الأسئلة",
            itemLabel: "سؤال",
            titleKey: "question",
            fields: [
              { kind: "text", name: "question", label: "السؤال", wide: true },
              { kind: "textarea", name: "answer", label: "الإجابة", wide: true },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "cta",
    title: "قسم طلب عرض السعر",
    description: "الشريط البرتقالي مع أزرار تابي وتمارا.",
    icon: "cta",
    groups: [
      {
        title: "النصوص",
        fields: [
          { kind: "rich", name: "title", label: "العنوان", hint: RICH_HINT },
          { kind: "textarea", name: "text", label: "النص" },
          { kind: "text", name: "buttonLabel", label: "نص الزر" },
          { kind: "text", name: "bnplTitle", label: "عنوان التقسيط" },
          { kind: "text", name: "bnplNote", label: "ملاحظة التقسيط" },
        ],
      },
      {
        title: "رسائل واتساب الجاهزة",
        fields: [
          { kind: "text", name: "quoteMessage", label: "رسالة زر عرض السعر", wide: true },
          { kind: "text", name: "tabbyMessage", label: "رسالة زر تابي", wide: true },
          { kind: "text", name: "tamaraMessage", label: "رسالة زر تمارا", wide: true },
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "اتصل بنا",
    description: "عنوان القسم ونموذج طلب عرض السعر. أرقام التواصل تُعدّل من «الإعدادات العامة».",
    icon: "contact",
    anchor: "contact",
    groups: [
      { title: "العنوان", fields: eyebrowTitle() },
      {
        title: "نموذج الطلب",
        fields: [
          { kind: "text", name: "formTitle", label: "عنوان النموذج" },
          { kind: "text", name: "formHint", label: "النص التوضيحي" },
          { kind: "text", name: "submitLabel", label: "نص زر الإرسال" },
          { kind: "text", name: "whatsappIntro", label: "أول سطر في رسالة واتساب", wide: true },
          { kind: "strings", name: "serviceOptions", label: "خيارات «نوع الخدمة»", itemLabel: "خيار" },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "التذييل",
    description: "أسفل الموقع.",
    icon: "footer",
    groups: [
      {
        title: "المحتوى",
        fields: [
          { kind: "textarea", name: "brandText", label: "النبذة تحت الشعار", wide: true },
          { kind: "strings", name: "services", label: "روابط «خدماتنا»", itemLabel: "خدمة" },
        ],
      },
    ],
  },
];

export const getSectionSchema = (key: string) => editorSchema.find((s) => s.key === key);
