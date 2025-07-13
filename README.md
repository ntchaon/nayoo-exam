## 1.วิธี Setup และ Run Project

```bash
# ใช้ Node.js เวอร์ชัน 20 และ NPM เวอร์ชัน 10
# 1. สร้างไฟล์ .env สำหรับเชื่อมต่อ Firebase
# 2. ติดตั้ง dependencies
npm install

npm run dev
```

---

## 2.Features ที่ Implement

### Loan Calculator

- ฟอร์มคำนวณสินเชื่อแบบลดต้นลดดอก
- แสดงยอดผ่อนรายเดือน, ดอกเบี้ยรวม, ยอดชำระทั้งหมด
- ตารางแสดงรายละเอียดรายเดือน (Amortization Schedule)
- กราฟแสดง:
  - สัดส่วนเงินต้นและดอกเบี้ย (Pie Chart)
  - หนี้คงเหลือรายเดือน (Line Chart)
  - ดอกเบี้ยสะสมรายปี (Bar Chart)
- เปรียบเทียบสินเชื่อหลายรายการ (Comparison Tool)
- ดาวน์โหลดตารางเป็น Excel

---

### 📰 Article Management System

#### 👨‍💼 Admin

- สร้าง / แก้ไขบทความด้วย Rich Text Editor (TinyMCE)
- อัปโหลดภาพประกอบ
- จัดการหมวดหมู่ / แท็ก
- ค้นหา / กรองบทความตามชื่อหรือหมวด
- ลบบทความ (soft delete)

#### User

- อ่านบทความพร้อมรูปหน้าปก
- Comment ได้ในบทความ
- แชร์บทความผ่านโซเชียล
- ระบบนับยอดวิว

---

> ❌ ที่ยังไม่ได้ทำ:
>
> - Auto-save draft
> - SEO metadata fields
> - Filter by category, tags, date range
> - Sort by date, popularity, reading time
> - Search suggestions
> - Search results highlighting
> - Featured articles section
> - Article series/collections
> - Author profiles
> - Content scheduling (publish date/time)
> - Article statistics dashboard
> - Version history
> - Preview before publish
> - Responsive check

## 3. Architecture Decisions

- **Nuxt 3**: Full-stack framework รองรับ SSR/SPA (Required)
- **Pinia**: จัดการสถานะ (Required)
- **Tailwind CSS**: สำหรับ UI ที่ปรับแต่งง่ายและ responsive รองรับ Dark Mode
- **Firebase**:
  - Auth (ระบบล็อกอิน)
  - Firestore (เก็บบทความ)
  - Storage (เก็บรูปภาพ)
- **Vercel**: ใช้งานง่าย เหมาะสำหรับ Nuxt SSR และฟรีสำหรับ demo [Link Website](https://nayoo-exam.vercel.app)

---

## 4. Demo Credentials

- [Live Demo](https://nayoo-exam.vercel.app/login)
- Email: `admin@nayoo.test`
- Password: `admin1234`
