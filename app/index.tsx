import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated } from 'react-native';
import { getUserSession, clearUserSession, getThemePreference, saveThemePreference } from '../src/utils/storage';
import { getTheme } from '../src/utils/theme';
import LoginScreen from '../src/screens/LoginScreen';
import SignupScreen from '../src/screens/SignupScreen';
import HomeScreen from '../src/screens/HomeScreen';
import DoctorDetailsScreen from '../src/screens/DoctorDetailsScreen';
import BookingScreen from '../src/screens/BookingScreen';
import MyAppointmentsScreen from '../src/screens/MyAppointmentsScreen';
import ProfileScreen from '../src/screens/ProfileScreen';

// Simple stack-based navigation using state
type Screen =
  | { name: 'Login' }
  | { name: 'Signup' }
  | { name: 'Home' }
  | { name: 'DoctorDetails'; doctor: any }
  | { name: 'Booking'; doctor: any }
  | { name: 'MyAppointments' }
  | { name: 'Profile' };

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>({ name: 'Login' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const theme = getTheme(isDarkMode);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const [session, themePref] = await Promise.all([
      getUserSession(),
      getThemePreference(),
    ]);
    if (session) {
      setUser(session);
      setCurrentScreen({ name: 'Home' });
    }
    setIsDarkMode(themePref);
    setLoading(false);
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setCurrentScreen({ name: 'Home' });
  };

  const handleLogout = async () => {
    await clearUserSession();
    setUser(null);
    setCurrentScreen({ name: 'Login' });
    showToast('Logout successful');
  };

  const handleToggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await saveThemePreference(value);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'Login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentScreen({ name: 'Signup' })}
            theme={theme}
          />
        );

      case 'Signup':
        return (
          <SignupScreen
            onSignupSuccess={() => setCurrentScreen({ name: 'Login' })}
            onNavigateToLogin={() => setCurrentScreen({ name: 'Login' })}
            theme={theme}
          />
        );

      case 'Home':
        return (
          <HomeScreen
            user={user}
            onDoctorPress={(doctor: any) =>
              setCurrentScreen({ name: 'DoctorDetails', doctor })
            }
            onMyAppointments={() => setCurrentScreen({ name: 'MyAppointments' })}
            onProfile={() => setCurrentScreen({ name: 'Profile' })}
            onLogout={handleLogout}
            theme={theme}
          />
        );

      case 'DoctorDetails':
        return (
          <DoctorDetailsScreen
            doctor={currentScreen.doctor}
            onBack={() => setCurrentScreen({ name: 'Home' })}
            onBookAppointment={(doctor: any) =>
              setCurrentScreen({ name: 'Booking', doctor })
            }
            theme={theme}
          />
        );

      case 'Booking':
        return (
          <BookingScreen
            doctor={currentScreen.doctor}
            user={user}
            onBack={() =>
              setCurrentScreen({ name: 'DoctorDetails', doctor: currentScreen.doctor })
            }
            onBookingComplete={() => setCurrentScreen({ name: 'MyAppointments' })}
            theme={theme}
          />
        );

      case 'MyAppointments':
        return (
          <MyAppointmentsScreen
            user={user}
            onBack={() => setCurrentScreen({ name: 'Home' })}
            theme={theme}
          />
        );

      case 'Profile':
        return (
          <ProfileScreen
            user={user}
            onBack={() => setCurrentScreen({ name: 'Home' })}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            theme={theme}
          />
        );

      default:
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentScreen({ name: 'Signup' })}
            theme={theme}
          />
        );
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderScreen()}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <View style={[styles.toast, { backgroundColor: theme.surface }]}>
            <Text style={[styles.toastText, { color: theme.textPrimary }]}>{toastMessage}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
