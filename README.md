# CSE3WA — Moodle HTML Generator & Mini App
> **Student:** Jessica Bull • **ID:** 20963232  
> **Stack:** Next.js (App Router, TypeScript), Tailwind CSS, next-themes

A calm, tech-forward Next.js site that **generates copy-paste HTML + JS** (with **inline CSS only**, **no classes**) ready for **Moodle**.  
Includes themes (Light/Dark/**CRT Pixel**), accessible navigation with **Hamburger** and **Kebab** menus, a **Tabs generator**, and small feature pages (Game, Todo, Blog).

---

## ✨ Features

- **UI shell**: Header (student # in top-left), Nav, Footer (copyright • name • student # • date)
- **Themes**: Light • Dark • **CRT Pixel** (green “terminal vibe”)
- **Navigation**
  - **Hamburger** (slides in on small screens, CSS transforms)
  - **Kebab** (⋮ quick menu)
  - Keyboard & screen-reader friendly (`aria-expanded`, `aria-haspopup="menu"`)
- **Homepage**
  - **Quick Export** widget → outputs a **single-file** HTML+JS page (inline styles only)
  - Carousel (image-ready), highlights, About section
- **Tabs Generator (/tabs)**
  - Up to **15 tabs** (+/−), editable headings & content
  - **localStorage** persistence while authoring
  - **Output**: complete **Hello.html** (inline CSS only, no `class=`, vanilla JS)
  - A11y tabs: `role="tablist/tab/tabpanel"`, arrow/Home/End keys, cookies to remember active tab
- **Small pages**
  - **Play**: Tic-Tac-Toe (React state walkthrough)
  - **Todo**: client-side tasks (local persistence)
  - **Blog**: create/search/read posts client-side
  - **Escape Room / Coding Races / Court Room**: placeholders for later parts
- **Accessibility**
  - “Skip to content”, visible focus rings, semantic roles/labels, color tokens with AA contrast
- **Cookies**
  - `last_menu` (last route visited)
  - `builder_tabs_remember` (Tabs page preference)
  - `last_active_tab_index` (in exported Hello.html)

---

## 📁 Structure (key files)

app/
components/
header.tsx
navigation.tsx # hamburger + kebab + links
hamburger.tsx
kebab.tsx
theme-providers.tsx
theme-toggle.tsx
theme-color.tsx
carousel.tsx
tabs.tsx # in-site pretty tabs (not the generator)
quick-export.tsx # homepage mini generator
(pages)
page.tsx # Home
about/page.tsx
tabs/page.tsx # Tabs Generator (exports Hello.html)
play/page.tsx
todo/page.tsx
blog/page.tsx
escape-room/page.tsx
coding-races/page.tsx
court-room/page.tsx
layout.tsx # App shell (Header/Main/Footer)
globals.css # Tailwind + theme tokens + background layers
public/
data/me.jpeg # example image
slides/... # carousel images


---

## 🧪 How to run

```bash
# 1) Install
npm install

# 2) Dev
npm run dev
# open http://localhost:3000

# 3) Build & start
npm run build
npm start


Tabs Generator — Using & Exporting

Visit /tabs.

Use + Add Tab or Remove to set 1, 3, or 5 tabs.

Edit Headings and Content (HTML allowed).

Toggle “Remember active tab (cookie)” as needed.

Click Preview, Copy HTML, or Download Hello.html.

Paste into a blank file named Hello.html and open in any browser.