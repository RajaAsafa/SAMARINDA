import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

const ADMIN_EMAIL_DOMAIN = 'samarinda-terbaru.local';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadProfile = async (userId) => {
      if (!mounted) return;
      await fetchProfile(userId);
    };

    // Check active session on mount
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setTimeout(() => loadProfile(session.user.id), 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (err) {
      console.error('Profile fetch failed', err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase belum dikonfigurasi.',
      };
    }

    try {
      const email = username.includes('@') ? username : `${username}@${ADMIN_EMAIL_DOMAIN}`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const profile = await fetchProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'Profil pengguna tidak ditemukan.',
        };
      }

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Login gagal.' 
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
