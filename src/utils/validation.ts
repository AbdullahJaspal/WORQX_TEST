import { EventFormData } from "../screens/homeStack/scheduleEvent/types";
import { isEndTimeAfterStartTime } from "./utils";

interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
  emailVerification?: string;
  numberVerification?: string;
}

const validateRequired = (value: string | undefined, fieldName: string): string | null => {
  return !value ? `${fieldName} is required` : null;
};

const validateEmail = (email: string): string | null => {
  return !/\S+@\S+\.\S+/.test(email) ? 'Invalid email address' : null;
};

const validateEmailOrPhone = (value: string): string | null => {
  if (/\S+@\S+\.\S+/.test(value) || /^\+?\d{10,15}$/.test(value)) {
    return null;
  }
  return 'Enter a valid email or phone number';
};

const validateVerificationCode = (code: string | undefined): string | null => {
  if (!code) {
    return 'Verification code is required';
  }
  if (code.length < 6) {
    return 'Wrong Code, Try Again';
  }
  return null;
};

const validatePassword = (password: string | undefined, confirmPassword?: string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!password) {
    errors.password = 'Password is required';
    return errors;
  }

  if (confirmPassword === undefined && password.length < 10) {
    errors.password = 'Password must be at least 10 characters';
    return errors;
  }

  if (confirmPassword !== undefined) {
    const hasErrors =
      password.length < 10 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[@#$%]/.test(password);

    if (hasErrors) {
      errors.password = '';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
};

export const signupFormValidate = (formData: FormData, currentStep: number) => {
  const errors: Record<string, string> = {};

  switch (currentStep) {
    case 0:
      const firstNameError = validateRequired(formData.firstName, 'First name');
      if (firstNameError) errors.firstName = firstNameError;

      const lastNameError = validateRequired(formData.lastName, 'Last name');
      if (lastNameError) errors.lastName = lastNameError;
      break;

    case 1:
      const emailRequiredError = validateRequired(formData.email, 'Email');
      if (emailRequiredError) {
        errors.email = emailRequiredError;
      } else {
        const emailFormatError = validateEmail(formData.email);
        if (emailFormatError) errors.email = emailFormatError;
      }
      break;

    case 2:
      const emailVerificationError = validateVerificationCode(formData.emailVerification);
      if (emailVerificationError) errors.emailVerification = emailVerificationError;
      break;

    case 3:
      const phoneError = validateRequired(formData.phone, 'Phone number');
      if (phoneError) errors.phone = phoneError;
      break;

    case 4:
      const numberVerificationError = validateVerificationCode(formData.numberVerification);
      if (numberVerificationError) errors.numberVerification = numberVerificationError;
      break;

    case 5:
      const passwordErrors = validatePassword(formData.password, formData.confirmPassword);
      Object.assign(errors, passwordErrors);
      break;

    default:
      break;
  }

  return errors;
};

export const forgetFormValidate = (formData: FormData, step: string) => {
  const errors: Record<string, string> = {};

  if (step === 'initial') {
    const emailRequiredError = validateRequired(formData.email, 'Email or phone number');
    if (emailRequiredError) {
      errors.email = emailRequiredError;
    } else {
      const emailOrPhoneError = validateEmailOrPhone(formData.email);
      if (emailOrPhoneError) errors.email = emailOrPhoneError;
    }
  } else if (step === 'verification') {
    const verificationError = validateVerificationCode(formData.emailVerification);
    if (verificationError) errors.emailVerification = verificationError;
  } else if (step === 'createPassword') {
    const passwordErrors = validatePassword(formData.password, formData.confirmPassword);
    Object.assign(errors, passwordErrors);
  }

  return errors;
};

export const signinFormVaildate = (formData: FormData, step: string) => {
  const errors: Record<string, string> = {};

  if (step === 'initial') {
    const emailRequiredError = validateRequired(formData.email, 'Email or phone number');
    if (emailRequiredError) {
      errors.email = emailRequiredError;
    } else {
      const emailOrPhoneError = validateEmailOrPhone(formData.email);
      if (emailOrPhoneError) errors.email = emailOrPhoneError;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      errors.password = 'Password must be at least 10 characters';
    }
  } else if (step === 'verification') {
    const verificationError = validateVerificationCode(formData.emailVerification);
    if (verificationError) errors.emailVerification = verificationError;
  } else if (step === 'createPassword') {
    const passwordErrors = validatePassword(formData.password, formData.confirmPassword);
    Object.assign(errors, passwordErrors);
  }

  return errors;
};

export const validateEventForm = (formData: EventFormData) => {
  if (!formData.subject.trim()) return 'Subject is required';
  if (!formData.selectedDate) return 'Date is required';

  const selectedDate = new Date(formData.selectedDate);
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6)
    return 'Events cannot be scheduled on weekends';

  if (!formData.isAllDay) {
    if (!formData.startTime) return 'Start time is required';
    if (!formData.endTime) return 'End time is required';

    if (!isEndTimeAfterStartTime(formData.startTime, formData.endTime)) {
      return 'End time must be after start time';
    }
  }
  return null;
};