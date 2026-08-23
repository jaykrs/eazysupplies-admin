"use client";

import request from "@/utils/axiosUtils";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Form, Input, Label, Row, Spinner } from "reactstrap";

const DEFAULTS = {
  hero: { slides: [{ image: "/assets/images/earthling-home/hero-1.jpg", alt: "Royal Grove canned foods" }, { image: "/assets/images/earthling-home/hero-2.jpeg", alt: "Earthling food collection" }, { image: "/assets/images/earthling-home/hero-3.webp", alt: "Earthling pantry essentials" }] },
  story: { eyebrow: "Earthling Consumer Products", title: "Why choose us", body: "At Earthling, we believe everyday meals should feel effortless, dependable and full of flavour.", body_secondary: "Every product reflects our focus on integrity, quality and passion.", image: "/assets/images/earthling-home/story.jpg", button_text: "Explore all products", button_url: "/collections" },
  stats: [{ value: "100+", label: "SKUs" }, { value: "25+", label: "Lakh cans sold" }, { value: "40+", label: "Cities" }, { value: "10k+", label: "Happy customers" }],
  media: { title: "Experience delicious flavours", subtitle: "Stories from chefs, partners and the Earthling community.", cards: [] },
  expert: { title: "Expert corner", image: "/assets/images/earthling-home/expert.jpg", quote: "Quality ingredients make good cooking simpler.", name: "Chef Izzat Hussain", role: "Culinary expert" },
  featured: { title: "Popular products", product_ids: [] },
  categories: { title: "Shop by category", category_ids: [] },
};

const merge = (stored = {}) => ({ ...DEFAULTS, ...stored, hero: { ...DEFAULTS.hero, ...stored.hero }, story: { ...DEFAULTS.story, ...stored.story }, media: { ...DEFAULTS.media, ...stored.media }, expert: { ...DEFAULTS.expert, ...stored.expert }, featured: { ...DEFAULTS.featured, ...stored.featured }, categories: { ...DEFAULTS.categories, ...stored.categories } });
const parseIds = (value) => value.split(",").map((item) => Number(item.trim())).filter(Boolean);
const parseStats = (value) => value.split("\n").map((line) => { const [statValue, ...label] = line.split("|"); return { value: statValue?.trim(), label: label.join("|").trim() }; }).filter((item) => item.value && item.label);
const parseCards = (value) => value.split("\n").map((line) => { const [title, url, poster] = line.split("|"); return { title: title?.trim(), url: url?.trim(), poster: poster?.trim() }; }).filter((item) => item.title);

const Field = ({ label, value, onChange, textarea = false, help }) => <Col md={textarea ? 12 : 6}><div className="mb-3"><Label className="form-label-title">{label}</Label><Input type={textarea ? "textarea" : "text"} rows={textarea ? 4 : undefined} value={value || ""} onChange={(event) => onChange(event.target.value)} />{help && <small className="text-muted d-block mt-1">{help}</small>}</div></Col>;

export default function EarthlingHomeEditor() {
  const [template, setTemplate] = useState(null);
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { request({ url: "/api/template?name=home" }).then(({ data }) => { setTemplate(data); setConfig(merge(data?.jsonData?.data?.content?.earthling_home)); }).catch(() => setMessage("Could not load homepage settings." )).finally(() => setLoading(false)); }, []);
  const setSection = (section, field, value) => setConfig((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const jsonData = template?.jsonData || {};
      const data = jsonData.data || {};
      const content = data.content || {};
      const payload = { ...template, jsonData: { ...jsonData, data: { ...data, content: { ...content, earthling_home: config } } } };
      const { data: updated } = await request({ url: "/api/template", method: "PUT", data: payload });
      setTemplate(updated); setMessage("Earthling homepage settings saved successfully.");
    } catch (error) { setMessage(error?.response?.data?.error || "Could not save homepage settings."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-5 text-center"><Spinner /></div>;
  return <Form onSubmit={save} className="earthling-home-editor">
    <div className="d-flex align-items-center justify-content-between mb-4"><div><h2 className="mb-1">Earthling Homepage</h2><p className="text-muted mb-0">Manage the content shown when the Earthling storefront variant is active.</p></div><Button color="primary" type="submit" disabled={saving}>{saving ? <Spinner size="sm" /> : "Save homepage"}</Button></div>
    {message && <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>{message}</div>}
    <Card className="mb-4"><CardBody><h4 className="mb-3">Hero banners</h4><Row>{config.hero.slides.map((slide, index) => <Field key={index} label={`Banner ${index + 1} image URL`} value={slide.image} onChange={(value) => setSection("hero", "slides", config.hero.slides.map((item, itemIndex) => itemIndex === index ? { ...item, image: value } : item))} />)}</Row></CardBody></Card>
    <Card className="mb-4"><CardBody><h4 className="mb-3">Brand story</h4><Row><Field label="Eyebrow" value={config.story.eyebrow} onChange={(value) => setSection("story", "eyebrow", value)} /><Field label="Title" value={config.story.title} onChange={(value) => setSection("story", "title", value)} /><Field textarea label="Main copy" value={config.story.body} onChange={(value) => setSection("story", "body", value)} /><Field textarea label="Supporting copy" value={config.story.body_secondary} onChange={(value) => setSection("story", "body_secondary", value)} /><Field label="Image URL" value={config.story.image} onChange={(value) => setSection("story", "image", value)} /><Field label="Button label" value={config.story.button_text} onChange={(value) => setSection("story", "button_text", value)} /><Field label="Button URL" value={config.story.button_url} onChange={(value) => setSection("story", "button_url", value)} /></Row></CardBody></Card>
    <Card className="mb-4"><CardBody><h4 className="mb-3">Statistics</h4><Row><Field textarea label="Statistics" help="One per line: value|label" value={config.stats.map((item) => `${item.value}|${item.label}`).join("\n")} onChange={(value) => setConfig((current) => ({ ...current, stats: parseStats(value) }))} /></Row></CardBody></Card>
    <Card className="mb-4"><CardBody><h4 className="mb-3">Media highlights</h4><Row><Field label="Title" value={config.media.title} onChange={(value) => setSection("media", "title", value)} /><Field label="Subtitle" value={config.media.subtitle} onChange={(value) => setSection("media", "subtitle", value)} /><Field textarea label="Media cards" help="One per line: title|destination URL|poster image URL" value={(config.media.cards || []).map((item) => `${item.title}|${item.url || ""}|${item.poster || ""}`).join("\n")} onChange={(value) => setSection("media", "cards", parseCards(value))} /></Row></CardBody></Card>
    <Card className="mb-4"><CardBody><h4 className="mb-3">Expert feature</h4><Row><Field label="Section title" value={config.expert.title} onChange={(value) => setSection("expert", "title", value)} /><Field label="Image URL" value={config.expert.image} onChange={(value) => setSection("expert", "image", value)} /><Field textarea label="Quote" value={config.expert.quote} onChange={(value) => setSection("expert", "quote", value)} /><Field label="Name" value={config.expert.name} onChange={(value) => setSection("expert", "name", value)} /><Field label="Role" value={config.expert.role} onChange={(value) => setSection("expert", "role", value)} /></Row></CardBody></Card>
    <Card><CardBody><h4 className="mb-3">Commerce sections</h4><Row><Field label="Featured-products title" value={config.featured.title} onChange={(value) => setSection("featured", "title", value)} /><Field label="Product IDs" help="Comma-separated. Leave blank to show the latest active products." value={(config.featured.product_ids || []).join(",")} onChange={(value) => setSection("featured", "product_ids", parseIds(value))} /><Field label="Categories title" value={config.categories.title} onChange={(value) => setSection("categories", "title", value)} /><Field label="Category IDs" help="Comma-separated. Leave blank to show the first active categories." value={(config.categories.category_ids || []).join(",")} onChange={(value) => setSection("categories", "category_ids", parseIds(value))} /></Row></CardBody></Card>
  </Form>;
}
