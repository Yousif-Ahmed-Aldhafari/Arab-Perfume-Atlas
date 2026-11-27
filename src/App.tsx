import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  ImageOff,
  Languages,
  Menu,
  Search,
  Share2,
  Upload,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { brands, fragrances } from "./data/catalog";
import { genderAr, imagePath, priceLabel, searchText } from "./lib";
import type { Fragrance } from "./types";
import { useStoredList } from "./useStoredList";

const AppContext = ({
  children,
}: {
  children: (v: {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    compare: string[];
    toggleCompare: (id: string) => void;
    setFavorites: (v: string[]) => void;
  }) => React.ReactNode;
}) => {
  const [favorites, setFavorites, toggleFavorite] =
    useStoredList("apa-favorites-v1");
  const [compare, , toggleCompare] = useStoredList("apa-compare-v1");
  return children({
    favorites,
    toggleFavorite,
    compare,
    toggleCompare: (id) => {
      if (!compare.includes(id) && compare.length >= 4) return;
      toggleCompare(id);
    },
    setFavorites,
  });
};
export default function App() {
  const [menu, setMenu] = useState(false);
  return (
    <AppContext>
      {(ctx) => (
        <div className="app">
          <a className="skip" href="#content">
            انتقل للمحتوى
          </a>
          <header>
            <Link className="brand" to="/">
              <span className="mark">أ</span>
              <span>
                أطلس العطور<small>ARAB PERFUME ATLAS</small>
              </span>
            </Link>
            <button
              className="icon mobile"
              onClick={() => setMenu(!menu)}
              aria-label="القائمة"
            >
              <Menu />
            </button>
            <nav className={menu ? "open" : ""} onClick={() => setMenu(false)}>
              <NavLink to="/catalog">العطور</NavLink>
              <NavLink to="/brands">العلامات</NavLink>
              <NavLink to="/alternatives">البدائل</NavLink>
              <NavLink to="/compare">
                المقارنة {ctx.compare.length > 0 && <b>{ctx.compare.length}</b>}
              </NavLink>
              <NavLink to="/favorites">
                المفضلة{" "}
                {ctx.favorites.length > 0 && <b>{ctx.favorites.length}</b>}
              </NavLink>
            </nav>
            <button
              className="lang"
              disabled
              title="الواجهة الإنجليزية قيد الإعداد"
            >
              <Languages size={18} /> AR
            </button>
          </header>
          <main id="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog {...ctx} />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brand/:brand" element={<Catalog {...ctx} />} />
              <Route path="/fragrance/:id" element={<Detail {...ctx} />} />
              <Route path="/alternatives" element={<Alternatives {...ctx} />} />
              <Route path="/compare" element={<Compare {...ctx} />} />
              <Route path="/favorites" element={<Favorites {...ctx} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer>
            <div>
              <strong>أطلس العطور العربية</strong>
              <p>مشروع مستقل للتوثيق والاكتشاف. لا نتبع أي علامة تجارية.</p>
            </div>
            <div>
              <Link to="/catalog">الكتالوج</Link>
              <Link to="/brands">العلامات</Link>
              <Link to="/compare">المقارنة</Link>
            </div>
            <small>
              البيانات غير الموثقة موسومة بوضوح. لا تُعد الأسعار عروض بيع.
            </small>
          </footer>
        </div>
      )}
    </AppContext>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">اكتشف عطرك القادم</span>
          <h1>
            العطر ليس مجرد رائحة.
            <br />
            <em>إنه ذاكرة تُروى.</em>
          </h1>
          <p>
            استكشف مجموعة منتقاة من العطور العربية، قارن المكونات والأسعار،
            واعثر على الروائح الأقرب إلى ذوقك.
          </p>
          <div className="actions">
            <Link className="primary" to="/catalog">
              استكشف العطور <ChevronLeft />
            </Link>
            <Link className="secondary" to="/alternatives">
              اكتشف البدائل
            </Link>
          </div>
          <div className="stats">
            <span>
              <b>{fragrances.length}</b> عطر
            </span>
            <span>
              <b>{brands.length}</b> علامة عربية
            </span>
            <span>
              <b>{fragrances.filter((x) => x.similar.length).length}</b> مقارنة
              أولية
            </span>
          </div>
        </div>
        <div className="hero-art">
          <span>نفحات عربية</span>
          <div className="bottle">عطر</div>
        </div>
      </section>
      <section className="section">
        <header className="section-title">
          <div>
            <span className="eyebrow">مختارات الأطلس</span>
            <h2>عطور تستحق الاكتشاف</h2>
          </div>
          <Link to="/catalog">
            عرض الكل <ChevronLeft size={18} />
          </Link>
        </header>
        <div className="cards">
          {fragrances.slice(0, 4).map((f) => (
            <StaticCard key={f.id} fragrance={f} />
          ))}
        </div>
      </section>
      <section className="trust">
        <span>
          <Check /> بيانات صريحة المصدر
        </span>
        <span>
          <ImageOff /> لا صور مصطنعة
        </span>
        <span>
          <Share2 /> مقارنة قابلة للتتبع
        </span>
      </section>
    </>
  );
}

type Ctx = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  setFavorites: (v: string[]) => void;
};
function Catalog(ctx: Ctx) {
  const { brand } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const gender = params.get("gender") || "";
  const accord = params.get("accord") || "";
  const sort = params.get("sort") || "name";
  const [viewer, setViewer] = useState<Fragrance | null>(null);
  const list = useMemo(
    () =>
      fragrances
        .filter(
          (f) =>
            (!brand || f.brand === brand) &&
            (!q || searchText(f).includes(q.toLocaleLowerCase("ar"))) &&
            (!gender || f.gender === gender) &&
            (!accord || f.mainAccords.some((x) => x.includes(accord))),
        )
        .sort((a, b) =>
          sort === "price"
            ? a.prices[0].min - b.prices[0].min
            : sort === "brand"
              ? a.brand.localeCompare(b.brand)
              : a.nameEn.localeCompare(b.nameEn),
        ),
    [brand, q, gender, accord, sort],
  );
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v);
    else n.delete(k);
    setParams(n);
  };
  return (
    <section className="page">
      <PageHead
        eyebrow={brand ? "العلامة التجارية" : "كتالوج الأطلس"}
        title={brand || "كل العطور"}
        text={`${list.length} عطر — المعلومات الناقصة معروضة بصراحة دون تخمين.`}
      />
      <div className="toolbar">
        <label className="search">
          <Search />
          <input
            value={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="ابحث بالعربية أو الإنجليزية…"
          />
        </label>
        <select
          aria-label="الجنس"
          value={gender}
          onChange={(e) => set("gender", e.target.value)}
        >
          <option value="">كل التصنيفات</option>
          <option value="Men">رجالي</option>
          <option value="Women">نسائي</option>
          <option value="Unisex">للجنسين</option>
        </select>
        <select
          aria-label="النغمة"
          value={accord}
          onChange={(e) => set("accord", e.target.value)}
        >
          <option value="">كل النغمات</option>
          {[
            "عود",
            "فانيليا",
            "عنبر",
            "جلد",
            "بخور",
            "مسك",
            "ورد",
            "حمضيات",
            "قهوة",
            "قرفة",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="الترتيب"
          value={sort}
          onChange={(e) => set("sort", e.target.value)}
        >
          <option value="name">الاسم</option>
          <option value="price">السعر</option>
          <option value="brand">العلامة</option>
        </select>
      </div>
      {list.length ? (
        <div className="cards">
          {list.map((f) => (
            <Card key={f.id} fragrance={f} {...ctx} open={() => setViewer(f)} />
          ))}
        </div>
      ) : (
        <Empty text="لا توجد نتائج مطابقة. جرّب إزالة بعض المرشحات." />
      )}
      {viewer && (
        <Viewer
          fragrance={viewer}
          list={list}
          onChange={setViewer}
          close={() => setViewer(null)}
          {...ctx}
        />
      )}
    </section>
  );
}

function Card({
  fragrance: f,
  favorites,
  toggleFavorite,
  compare,
  toggleCompare,
  open,
}: Ctx & { fragrance: Fragrance; open: () => void }) {
  const p = f.prices[0];
  return (
    <article className="card">
      <div className="photo">
        <button onClick={open} aria-label={`تكبير صورة ${f.nameEn}`}>
          <img
            loading="lazy"
            src={imagePath(f)}
            alt={
              f.image.verified
                ? `عبوة ${f.nameEn}`
                : `الصورة الأصلية غير متوفرة لـ ${f.nameEn}`
            }
          />
        </button>
        <button
          className={`heart ${favorites.includes(f.id) ? "on" : ""}`}
          onClick={() => toggleFavorite(f.id)}
          aria-label="إضافة للمفضلة"
        >
          <Heart fill={favorites.includes(f.id) ? "currentColor" : "none"} />
        </button>
        {!f.image.verified && (
          <span className="unavailable">صورة غير متوفرة</span>
        )}
      </div>
      <div className="card-body">
        <Link to={`/brand/${encodeURIComponent(f.brand)}`} className="overline">
          {f.brand}
        </Link>
        <Link className="card-name" to={`/fragrance/${f.id}`}>
          {f.nameAr || f.nameEn}
        </Link>
        <small>
          {genderAr[f.gender]}
          {f.concentration ? ` · ${f.concentration}` : ""}
        </small>
        <div className="chips">
          {f.mainAccords.slice(0, 3).map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <div className="price-row">
          <strong>{priceLabel(p)}</strong>
          <button
            className={compare.includes(f.id) ? "selected" : ""}
            onClick={() => toggleCompare(f.id)}
          >
            <ArrowLeftRight /> {compare.includes(f.id) ? "مضاف" : "قارن"}
          </button>
        </div>
        {f.similar[0] && (
          <p className="similar">
            يشابه تداولًا: <b>{f.similar[0].name}</b> <i>غير موثق</i>
          </p>
        )}
      </div>
    </article>
  );
}
function StaticCard({ fragrance: f }: { fragrance: Fragrance }) {
  return (
    <article className="card">
      <div className="photo">
        <Link to={`/fragrance/${f.id}`}>
          <img src={imagePath(f)} alt="الصورة الأصلية غير متوفرة" />
        </Link>
        <span className="unavailable">صورة غير متوفرة</span>
      </div>
      <div className="card-body">
        <span className="overline">{f.brand}</span>
        <Link className="card-name" to={`/fragrance/${f.id}`}>
          {f.nameEn}
        </Link>
        <small>{genderAr[f.gender]}</small>
        <div className="price-row">
          <strong>{priceLabel(f.prices[0])}</strong>
        </div>
      </div>
    </article>
  );
}

function Detail(ctx: Ctx) {
  const { id } = useParams();
  const f = fragrances.find((x) => x.id === id);
  const [viewer, setViewer] = useState(false);
  if (!f) return <NotFound />;
  const p = f.prices[0];
  return (
    <article className="detail">
      <div className="detail-photo">
        <button onClick={() => setViewer(true)}>
          <img
            src={imagePath(f)}
            alt={
              f.image.verified
                ? `عبوة ${f.nameEn}`
                : "الصورة الأصلية غير متوفرة"
            }
          />
        </button>
        <span>الصورة الأصلية غير متوفرة قانونيًا أو تقنيًا</span>
      </div>
      <div>
        <Link className="overline" to={`/brand/${encodeURIComponent(f.brand)}`}>
          {f.brand}
        </Link>
        <h1>{f.nameAr || f.nameEn}</h1>
        {f.nameAr && <p dir="ltr">{f.nameEn}</p>}
        <div className="detail-actions">
          <button className="primary" onClick={() => ctx.toggleFavorite(f.id)}>
            <Heart
              fill={ctx.favorites.includes(f.id) ? "currentColor" : "none"}
            />{" "}
            {ctx.favorites.includes(f.id) ? "محفوظ" : "أضف للمفضلة"}
          </button>
          <button className="secondary" onClick={() => ctx.toggleCompare(f.id)}>
            <ArrowLeftRight /> أضف للمقارنة
          </button>
        </div>
        <dl>
          <div>
            <dt>التصنيف</dt>
            <dd>{genderAr[f.gender]}</dd>
          </div>
          <div>
            <dt>التركيز</dt>
            <dd>{f.concentration || "غير معروف"}</dd>
          </div>
          <div>
            <dt>سنة الإصدار</dt>
            <dd>{f.releaseYear || "غير معروفة"}</dd>
          </div>
          <div>
            <dt>السعر</dt>
            <dd>
              {priceLabel(p)}{" "}
              <small>({p.type === "estimated" ? "تقديري" : "موثق"})</small>
            </dd>
          </div>
        </dl>
        <h2>النغمات الرئيسية</h2>
        <div className="chips">
          {f.mainAccords.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <h2>المقارنات العطرية</h2>
        {f.similar.length ? (
          f.similar.map((x) => (
            <div className="notice" key={x.name}>
              <b>{x.name}</b>
              <p>
                مقارنة متداولة غير موثقة بمصدر مستقل؛ لا تعني تطابق الرائحة.
              </p>
            </div>
          ))
        ) : (
          <p className="muted">لا توجد مقارنة موثقة.</p>
        )}
        <h2>المصادر</h2>
        {f.sources.length ? (
          <ul>
            {f.sources.map((x) => (
              <li key={x}>
                <a href={x} target="_blank" rel="noreferrer">
                  فتح المصدر
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">لم يُربط مصدر موثوق بهذا السجل بعد.</p>
        )}
      </div>
      {viewer && (
        <Viewer
          fragrance={f}
          list={[f]}
          onChange={() => {}}
          close={() => setViewer(false)}
          {...ctx}
        />
      )}
    </article>
  );
}

function Viewer({
  fragrance: f,
  list,
  onChange,
  close,
  favorites,
  toggleFavorite,
}: Ctx & {
  fragrance: Fragrance;
  list: Fragrance[];
  onChange: (f: Fragrance) => void;
  close: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const index = list.findIndex((x) => x.id === f.id);
  const move = (n: number) =>
    onChange(list[(index + n + list.length) % list.length]);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") move(1);
      if (e.key === "ArrowRight") move(-1);
    };
    addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      removeEventListener("keydown", key);
    };
    // Rebind when the active image changes so keyboard navigation uses its index.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.id]);
  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`صورة ${f.nameEn}`}
      tabIndex={-1}
      ref={ref}
    >
      <button className="viewer-close" onClick={close} aria-label="إغلاق">
        <X />
      </button>
      {list.length > 1 && (
        <>
          <button
            className="viewer-prev"
            onClick={() => move(-1)}
            aria-label="السابق"
          >
            <ChevronRight />
          </button>
          <button
            className="viewer-next"
            onClick={() => move(1)}
            aria-label="التالي"
          >
            <ChevronLeft />
          </button>
        </>
      )}
      <img
        src={imagePath(f)}
        alt={
          f.image.verified ? `عبوة ${f.nameEn}` : "الصورة الأصلية غير متوفرة"
        }
      />
      <div className="viewer-bar">
        <div>
          <span>{f.brand}</span>
          <h2>{f.nameAr || f.nameEn}</h2>
          <strong>{priceLabel(f.prices[0])}</strong>
        </div>
        <button onClick={() => toggleFavorite(f.id)} aria-label="المفضلة">
          <Heart fill={favorites.includes(f.id) ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}

function Brands() {
  return (
    <section className="page">
      <PageHead
        eyebrow="دليل العلامات"
        title="البيوت العربية"
        text={`${brands.length} علامة محفوظة من الكتالوج الأصلي.`}
      />
      <div className="brand-grid">
        {brands.map((b) => {
          const n = fragrances.filter((x) => x.brand === b).length;
          return (
            <Link to={`/brand/${encodeURIComponent(b)}`} key={b}>
              <span>{b.slice(0, 2)}</span>
              <h2>{b}</h2>
              <p>{n} عطر</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
function Alternatives(ctx: Ctx) {
  const list = fragrances.filter((x) => x.similar.length);
  return (
    <section className="page">
      <PageHead
        eyebrow="دليل التشابه"
        title="بدائل ومقارنات عطرية"
        text="العلاقات أدناه آراء متداولة من الكتالوج الموروث، وليست ادعاءات تطابق أو إلهام رسمي. ستبقى غير موثقة حتى إضافة مصادر موثوقة."
      />
      <div className="alternative-list">
        {list.map((f) => (
          <article key={f.id}>
            <Link to={`/fragrance/${f.id}`}>
              <b>{f.brand}</b>
              <h2>{f.nameEn}</h2>
            </Link>
            <ArrowLeftRight />
            <div>
              <span>مقارنة متداولة</span>
              <h3>{f.similar[0].name}</h3>
              <small>غير موثقة</small>
            </div>
            <button onClick={() => ctx.toggleCompare(f.id)}>
              أضف للمقارنة
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
function Compare(ctx: Ctx) {
  const list = ctx.compare
    .map((id) => fragrances.find((x) => x.id === id))
    .filter(Boolean) as Fragrance[];
  return (
    <section className="page">
      <PageHead
        eyebrow="حتى أربعة عطور"
        title="المقارنة"
        text="قارن البيانات المتاحة جنبًا إلى جنب. الخانات غير المعروفة لا تُستنتج."
      />
      {list.length ? (
        <div
          className="compare-table"
          style={{ "--count": list.length } as React.CSSProperties}
        >
          {list.map((f) => (
            <article key={f.id}>
              <button
                className="remove"
                onClick={() => ctx.toggleCompare(f.id)}
                aria-label="إزالة"
              >
                <X />
              </button>
              <img src={imagePath(f)} alt="الصورة غير متوفرة" />
              <Link to={`/fragrance/${f.id}`}>
                <b>{f.brand}</b>
                <h2>{f.nameEn}</h2>
              </Link>
              <CompareRow label="السعر" value={priceLabel(f.prices[0])} />
              <CompareRow
                label="السعر/مل"
                value={
                  f.prices[0].sizeMl
                    ? `${(f.prices[0].min / f.prices[0].sizeMl).toFixed(2)} ${f.prices[0].currency}`
                    : "غير معروف"
                }
              />
              <CompareRow label="التصنيف" value={genderAr[f.gender]} />
              <CompareRow
                label="التركيز"
                value={f.concentration || "غير معروف"}
              />
              <CompareRow
                label="الأحجام"
                value={
                  f.bottleSizesMl.length
                    ? f.bottleSizesMl.join("، ")
                    : "غير معروفة"
                }
              />
              <CompareRow
                label="النغمات"
                value={f.mainAccords.join("، ") || "غير معروفة"}
              />
              <CompareRow
                label="المشابه"
                value={f.similar[0]?.name || "غير موثق"}
              />
            </article>
          ))}
        </div>
      ) : (
        <Empty text="لم تضف عطورًا للمقارنة بعد." action="تصفح العطور" />
      )}
    </section>
  );
}
function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="compare-row">
      <small>{label}</small>
      <p>{value}</p>
    </div>
  );
}
function Favorites(ctx: Ctx) {
  const list = fragrances.filter((x) => ctx.favorites.includes(x.id));
  const input = useRef<HTMLInputElement>(null);
  const download = () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, favorites: ctx.favorites }, null, 2)],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "arab-perfume-atlas-favorites.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.favorites)) throw Error();
      ctx.setFavorites(
        data.favorites.filter(
          (id: unknown) =>
            typeof id === "string" && fragrances.some((x) => x.id === id),
        ),
      );
    } catch {
      alert("ملف المفضلة غير صالح");
    }
  };
  return (
    <section className="page">
      <PageHead
        eyebrow="محفوظ محليًا"
        title="المفضلة"
        text="تُحفظ اختياراتك في هذا المتصفح ولا تحتاج إلى حساب."
      />
      <div className="favorite-tools">
        <button onClick={download}>
          <Download /> تصدير
        </button>
        <button onClick={() => input.current?.click()}>
          <Upload /> استيراد
        </button>
        <input
          ref={input}
          hidden
          type="file"
          accept="application/json"
          onChange={upload}
        />
      </div>
      {list.length ? (
        <div className="cards">
          {list.map((f) => (
            <Card key={f.id} fragrance={f} open={() => {}} {...ctx} />
          ))}
        </div>
      ) : (
        <Empty text="لا توجد عطور محفوظة بعد." action="استكشف الكتالوج" />
      )}
    </section>
  );
}
function PageHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function Empty({ text, action }: { text: string; action?: string }) {
  return (
    <div className="empty">
      <Search />
      <h2>{text}</h2>
      {action && (
        <Link className="primary" to="/catalog">
          {action}
        </Link>
      )}
    </div>
  );
}
function NotFound() {
  const nav = useNavigate();
  return (
    <div className="empty">
      <h1>404</h1>
      <p>الصفحة غير موجودة.</p>
      <button className="primary" onClick={() => nav("/")}>
        العودة للرئيسية
      </button>
    </div>
  );
}
