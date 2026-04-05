import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_SESSION: '@medicapp_user_session',
  REGISTERED_USERS: '@medicapp_registered_users',
  APPOINTMENTS: '@medicapp_appointments',
  BOOKED_SLOTS: '@medicapp_booked_slots',
  THEME_PREFERENCE: '@medicapp_theme',
  USER_PROFILE: '@medicapp_user_profile',
};

// ── User Registration ─────────────────────────────────────

export const registerUser = async (name, email, password) => {
  try {
    const existing = await getRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (existing.find((u) => u.email === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const encoded = btoa(password); // base64 for demo
    existing.push({ name: name.trim(), email: normalizedEmail, password: encoded });
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(existing));
    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};

export const getRegisteredUsers = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

export const validateLogin = async (email, password) => {
  try {
    const users = await getRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }
    const decoded = atob(user.password);
    if (decoded !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    return { success: true, user: { name: user.name, email: user.email } };
  } catch (error) {
    console.error('Error validating login:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
};

// ── User Session ──────────────────────────────────────────

export const saveUserSession = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user session:', error);
    return false;
  }
};

export const getUserSession = async () => {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    return true;
  } catch (error) {
    console.error('Error clearing user session:', error);
    return false;
  }
};

// ── User Profile ──────────────────────────────────────────

export const saveUserProfile = async (email, profile) => {
  try {
    const key = `${STORAGE_KEYS.USER_PROFILE}_${email.toLowerCase()}`;
    await AsyncStorage.setItem(key, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async (email) => {
  try {
    const key = `${STORAGE_KEYS.USER_PROFILE}_${email.toLowerCase()}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// ── Theme Preference ──────────────────────────────────────

export const saveThemePreference = async (isDark) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, JSON.stringify(isDark));
    return true;
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return false;
  }
};

export const getThemePreference = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return false;
  }
};

// ── Appointments ──────────────────────────────────────────

export const getAppointments = async (email) => {
  try {
    const key = `${STORAGE_KEYS.APPOINTMENTS}_${email.toLowerCase()}`;
    const appointments = await AsyncStorage.getItem(key);
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

export const saveAppointment = async (appointment, email) => {
  try {
    const existing = await getAppointments(email);
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
      bookedAt: new Date().toISOString(),
    };
    existing.push(newAppointment);
    const key = `${STORAGE_KEYS.APPOINTMENTS}_${email.toLowerCase()}`;
    await AsyncStorage.setItem(key, JSON.stringify(existing));
    // Also mark the slot as booked for that date
    await addBookedSlot(appointment.doctorId, appointment.date, appointment.timeSlot);
    return newAppointment;
  } catch (error) {
    console.error('Error saving appointment:', error);
    return null;
  }
};

export const cancelAppointment = async (appointmentId, email) => {
  try {
    const existing = await getAppointments(email);
    const appointment = existing.find((apt) => apt.id === appointmentId);
    const updated = existing.filter((apt) => apt.id !== appointmentId);
    const key = `${STORAGE_KEYS.APPOINTMENTS}_${email.toLowerCase()}`;
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    // Release the booked slot for that date
    if (appointment) {
      await removeBookedSlot(appointment.doctorId, appointment.date, appointment.timeSlot);
    }
    return true;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return false;
  }
};

// ── Booked Slots ──────────────────────────────────────────

export const getBookedSlots = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKED_SLOTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return {};
  }
};

export const addBookedSlot = async (doctorId, date, slot) => {
  try {
    const booked = await getBookedSlots();
    if (!booked[doctorId]) {
      booked[doctorId] = {};
    } else if (Array.isArray(booked[doctorId])) {
      // Migrate legacy array to object under current date
      const legacySlots = booked[doctorId];
      booked[doctorId] = { [date]: legacySlots };
    }
    if (!booked[doctorId][date]) {
      booked[doctorId][date] = [];
    }
    if (!booked[doctorId][date].includes(slot)) {
      booked[doctorId][date].push(slot);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKED_SLOTS, JSON.stringify(booked));
    return true;
  } catch (error) {
    console.error('Error adding booked slot:', error);
    return false;
  }
};

export const removeBookedSlot = async (doctorId, date, slot) => {
  try {
    const booked = await getBookedSlots();
    if (booked[doctorId]) {
      if (Array.isArray(booked[doctorId])) {
         // Legacy fallback
         booked[doctorId] = booked[doctorId].filter((s) => s !== slot);
         if (booked[doctorId].length === 0) {
           delete booked[doctorId];
         }
      } else if (booked[doctorId][date]) {
        booked[doctorId][date] = booked[doctorId][date].filter((s) => s !== slot);
        if (booked[doctorId][date].length === 0) {
          delete booked[doctorId][date];
        }
        if (Object.keys(booked[doctorId]).length === 0) {
          delete booked[doctorId];
        }
      }
    }
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKED_SLOTS, JSON.stringify(booked));
    return true;
  } catch (error) {
    console.error('Error removing booked slot:', error);
    return false;
  }
};
