import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      userCard: {
        error: {
          title: 'Error Loading User',
          message: 'Failed to load user information',
          retry: 'Retry'
        },
        notFound: {
          title: 'User Not Found',
          message: 'The requested user could not be found.'
        },
        inactive: 'Inactive',
        hireDate: 'Hired:',
        lastLogin: 'Last login:',
        view: 'View',
        edit: 'Edit'
      },
      roles: {
        owner: 'Owner',
        hradmin: 'HR Admin',
        payrolladmin: 'Payroll Admin',
        manager: 'Manager',
        employee: 'Employee'
      }
    }
  },
  ar: {
    translation: {
      userCard: {
        error: {
          title: 'خطأ في تحميل المستخدم',
          message: 'فشل في تحميل معلومات المستخدم',
          retry: 'إعادة المحاولة'
        },
        notFound: {
          title: 'المستخدم غير موجود',
          message: 'تعذر العثور على المستخدم المطلوب.'
        },
        inactive: 'غير نشط',
        hireDate: 'تاريخ التعيين:',
        lastLogin: 'آخر تسجيل دخول:',
        view: 'عرض',
        edit: 'تعديل'
      },
      roles: {
        owner: 'المالك',
        hradmin: 'مدير الموارد البشرية',
        payrolladmin: 'مدير الرواتب',
        manager: 'مدير',
        employee: 'موظف'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
