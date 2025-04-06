# مشروع البوابة الطلابية

هذا المشروع هو بوابة إلكترونية للطلاب، تم إنشاؤه باستخدام تقنيات الويب الحديثة مثل ExpreessJs و TypeScript و Prisma و SQLITE.

## كيفية التثبيت

1. قم بتثبيت Node.js و npm على جهازك.
2. قم بتشغيل الأمر التالي في Terminal أو Command Prompt:
```
git clone https://github.com/Abdo-Shaibany/student-protal-backend.git
```
3. انتقل إلى المجلد الذي تم تثبيت المشروع فيه:
```
cd student-protal-backend
```
4. قم بتثبيت الحزم المطلوبة:
```
npm install
```
5. قم بمزامنة قاعدة البيانات:
```
npx prisma migrate dev
```
6. قم بتوليد اسم المستخدم الافتراضي:
```
npm run seed
```
7. قم بتشغيل المشروع:
```
npm run dev
```
