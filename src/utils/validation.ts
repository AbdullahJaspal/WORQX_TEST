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

export const signupFormValidate = (formData: FormData, currentStep: number) => {
  const errors: Record<string, string> = {};

  switch (currentStep) {
    case 0:
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      break;
    case 1:
      if (!formData.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = 'Invalid email address';
      break;
    case 2:
      if (!formData.emailVerification) {
        errors.emailVerification = 'Verification code is required';
      } else if (
        formData.emailVerification &&
        formData.emailVerification?.length < 6
      ) {
        errors.emailVerification = 'Wrong Code, Try Again';
      }
      break;
    case 3:
      if (!formData.phone) errors.phone = 'Phone number is required';
      break;
    case 4:
      if (!formData.numberVerification) {
        errors.numberVerification = 'Verification code is required';
      } else if (
        formData.numberVerification &&
        formData.numberVerification?.length < 6
      ) {
        errors.numberVerification = 'Wrong Code, Try Again';
      }
      break;
    case 5:
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';
      break;
    default:
      break;
  }
  return errors;
};

export const forgetFormValidate = (formData: FormData, step: string) => {
  const errors: Record<string, string> = {};

  if (step === 'initial') {
    if (!formData.email) {
      errors.email = 'Email or phone number is required';
    } else {
      if (/\S+@\S+\.\S+/.test(formData.email)) {
        // Valid email
      } else if (/^\+?\d{10,15}$/.test(formData.email)) {
        // Valid phone number
      } else {
        errors.email = 'Enter a valid email or phone number';
      }
    }
  } else if (step === 'verification') {
    if (!formData.emailVerification) {
      errors.emailVerification = 'Verification code is required';
    } else if (
      formData.emailVerification &&
      formData.emailVerification?.length < 6
    ) {
      errors.emailVerification = 'Wrong Code, Try Again';
    }
  } else if (step === 'createPassword') {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      if (formData.password.length < 10) {
        errors.password = '';
      }
      if (!/[A-Z]/.test(formData.password)) {
        errors.password = '';
      }
      if (!/[0-9]/.test(formData.password)) {
        errors.password = '';
      }
      if (!/[@#$%]/.test(formData.password)) {
        errors.password = '';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
};

export const signinFormVaildate = (formData: FormData, step: string) => {
  const errors: Record<string, string> = {};

  if (step === 'initial') {
    if (!formData.email) {
      errors.email = 'Email or phone number is required';
    } else {
      if (/\S+@\S+\.\S+/.test(formData.email)) {
      } else if (/^\+?\d{10,15}$/.test(formData.email)) {
      } else {
        errors.email = 'Enter a valid email or phone number';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      errors.password = 'Password must be at least 10 characters';
    }
  } else if (step === 'verification') {
    if (!formData.emailVerification) {
      errors.emailVerification = 'Verification code is required';
    } else if (
      formData.emailVerification &&
      formData.emailVerification?.length < 6
    ) {
      errors.emailVerification = 'Wrong Code, Try Again';
    }
  } else if (step === 'createPassword') {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      if (formData.password.length < 10) {
        errors.password = '';
      }
      if (!/[A-Z]/.test(formData.password)) {
        errors.password = '';
      }
      if (!/[0-9]/.test(formData.password)) {
        errors.password = '';
      }
      if (!/[@#$%]/.test(formData.password)) {
        errors.password = '';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
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
